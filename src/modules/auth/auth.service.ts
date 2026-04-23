import {
  BadRequestException,
  compare,
  ConflictException,
  encryption,
  generateOTP,
  hash,
  NotFoundException,
  sendEmail,
} from "../../common";
import { generateTokens, signToken } from "../../common/utils/jwt.utils";

import { UserRepository } from "../../DB/models/user/user.repository";
import {
  deleteFromCache,
  getFromCache,
  setIntoCache,
} from "../../DB/redis.service";
import { LoginDTO, ResetPasswordDTO, SendOtpDTO } from "./auth.dto";

// dependancy injection >> nest js
import { SignupDTO, VerifyAccountDTO } from "./auth.dto";

class AuthService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(signupDTO: SignupDTO) {
    // check user existance
    const { email } = signupDTO;
    const userExist = await this.userRepository.getOne({ email });
    if (userExist) throw new ConflictException("user already exists");
    // hash password
    signupDTO.password = await hash(signupDTO.password);
    // encryption phone
    if (signupDTO.phoneNumber)
      signupDTO.phoneNumber = encryption(signupDTO.phoneNumber);
    // send otp
    const otp = generateOTP();
    // send email
    await sendEmail({
      to: signupDTO.email,
      subject: "confirm email",
      html: `<p> your otp to verify account is ${otp} </p>`,
    });
    // save otp in cash >> ttl
    await setIntoCache(`${signupDTO.email}:otp`, otp, 3 * 60);
    // create user into redis
    await setIntoCache(
      signupDTO.email,
      JSON.stringify(signupDTO),
      3 * 24 * 60 * 60,
    );
  }
  async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
    // get from cache
    const userData = await getFromCache(verifyAccountDTO.email);
    if (!userData) throw new NotFoundException("user not found ");
    const otp = await getFromCache(`${verifyAccountDTO.email}:otp`);
    if (!otp) throw new BadRequestException("expire otp");
    if (otp != verifyAccountDTO.otp)
      throw new BadRequestException("invalid otp");

    // create into DB
    this.userRepository.create(JSON.parse(userData));

    // remove from redis
    await deleteFromCache(`${verifyAccountDTO.email}`);
    await deleteFromCache(`${verifyAccountDTO.email}:otp`);
  }

  async login(loginDTO: LoginDTO) {
    // check user exist
    const userExist = await this.userRepository.getOne({
      email: loginDTO.email,
    });
    // if not exist throw error
    if (!userExist) throw new NotFoundException("usesr not found");
    console.log(userExist);
    // hash password
    // loginDTO.password = await hash(loginDTO.password); >> false because compare internaly hash the password
    console.log(loginDTO.password);
    // compare hashed password with hashed password from DB
    const match = await compare(loginDTO.password, userExist.password);
    console.log(match);
    // if not equal throw invalid credantails
    if (!match) throw new BadRequestException("invalid credantails");
    // generate tokens {access token , refresh token}
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    // check is email exist
    const userExist = await this.userRepository.getOne({
      email: resetPasswordDTO.email,
    });
    if (!userExist) throw new NotFoundException("user not found");
    // check otp
    const otp = await getFromCache(`${resetPasswordDTO.email}:otp`);
    console.log(otp);

    if (otp != resetPasswordDTO.otp)
      throw new BadRequestException("invalid otp");
    // hash password
    resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);
    // update password
    await this.userRepository.updateOne(
      { email: resetPasswordDTO.email },
      { password: resetPasswordDTO.newPassword },
    );
  }

  async sendOtp(sendOtpDTO: SendOtpDTO) {
    // resend otp
    // check email into DB
    const userExistIntoDB = await this.userRepository.getOne({
      email: sendOtpDTO.email,
    });
    // check email into chace
    const userExistIntoCache = await getFromCache(sendOtpDTO.email);
    if (!userExistIntoCache && !userExistIntoDB)
      throw new NotFoundException("user not found, please signup first");
    // check already has a valid otp
    const otpExist = await getFromCache(`${sendOtpDTO.email}:otp`);
    if (otpExist) throw new BadRequestException("you already have a valid otp");
    // generate otp
    const otp = generateOTP();
    await setIntoCache(`${sendOtpDTO.email}:otp`, otp, 3 * 60);
    await sendEmail({
      to: sendOtpDTO.email,
      subject: "resend otp",
      html: `<p>your otp is ${otp}</p>`,
    });
  }
}

export default new AuthService();
