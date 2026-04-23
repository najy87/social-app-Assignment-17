"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const user_repository_1 = require("../../DB/models/user/user.repository");
const redis_service_1 = require("../../DB/redis.service");
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async signup(signupDTO) {
        // check user existance
        const { email } = signupDTO;
        const userExist = await this.userRepository.getOne({ email });
        if (userExist)
            throw new common_1.ConflictException("user already exists");
        // hash password
        signupDTO.password = await (0, common_1.hash)(signupDTO.password);
        // encryption phone
        if (signupDTO.phoneNumber)
            signupDTO.phoneNumber = (0, common_1.encryption)(signupDTO.phoneNumber);
        // send otp
        const otp = (0, common_1.generateOTP)();
        // send email
        await (0, common_1.sendEmail)({
            to: signupDTO.email,
            subject: "confirm email",
            html: `<p> your otp to verify account is ${otp} </p>`,
        });
        // save otp in cash >> ttl
        await (0, redis_service_1.setIntoCache)(`${signupDTO.email}:otp`, otp, 3 * 60);
        // create user into redis
        await (0, redis_service_1.setIntoCache)(signupDTO.email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
    }
    async verifyAccount(verifyAccountDTO) {
        // get from cache
        const userData = await (0, redis_service_1.getFromCache)(verifyAccountDTO.email);
        if (!userData)
            throw new common_1.NotFoundException("user not found ");
        const otp = await (0, redis_service_1.getFromCache)(`${verifyAccountDTO.email}:otp`);
        if (!otp)
            throw new common_1.BadRequestException("expire otp");
        if (otp != verifyAccountDTO.otp)
            throw new common_1.BadRequestException("invalid otp");
        // create into DB
        this.userRepository.create(JSON.parse(userData));
        // remove from redis
        await (0, redis_service_1.deleteFromCache)(`${verifyAccountDTO.email}`);
        await (0, redis_service_1.deleteFromCache)(`${verifyAccountDTO.email}:otp`);
    }
    async login(loginDTO) {
        // check user exist
        const userExist = await this.userRepository.getOne({
            email: loginDTO.email,
        });
        // if not exist throw error
        if (!userExist)
            throw new common_1.NotFoundException("usesr not found");
        console.log(userExist);
        // hash password
        // loginDTO.password = await hash(loginDTO.password); >> false because compare internaly hash the password
        console.log(loginDTO.password);
        // compare hashed password with hashed password from DB
        const match = await (0, common_1.compare)(loginDTO.password, userExist.password);
        console.log(match);
        // if not equal throw invalid credantails
        if (!match)
            throw new common_1.BadRequestException("invalid credantails");
        // generate tokens {access token , refresh token}
    }
    async resetPassword(resetPasswordDTO) {
        // check is email exist
        const userExist = await this.userRepository.getOne({
            email: resetPasswordDTO.email,
        });
        if (!userExist)
            throw new common_1.NotFoundException("user not found");
        // check otp
        const otp = await (0, redis_service_1.getFromCache)(`${resetPasswordDTO.email}:otp`);
        console.log(otp);
        if (otp != resetPasswordDTO.otp)
            throw new common_1.BadRequestException("invalid otp");
        // hash password
        resetPasswordDTO.newPassword = await (0, common_1.hash)(resetPasswordDTO.newPassword);
        // update password
        await this.userRepository.updateOne({ email: resetPasswordDTO.email }, { password: resetPasswordDTO.newPassword });
    }
    async sendOtp(sendOtpDTO) {
        // resend otp
        // check email into DB
        const userExistIntoDB = await this.userRepository.getOne({
            email: sendOtpDTO.email,
        });
        // check email into chace
        const userExistIntoCache = await (0, redis_service_1.getFromCache)(sendOtpDTO.email);
        if (!userExistIntoCache && !userExistIntoDB)
            throw new common_1.NotFoundException("user not found, please signup first");
        // check already has a valid otp
        const otpExist = await (0, redis_service_1.getFromCache)(`${sendOtpDTO.email}:otp`);
        if (otpExist)
            throw new common_1.BadRequestException("you already have a valid otp");
        // generate otp
        const otp = (0, common_1.generateOTP)();
        await (0, redis_service_1.setIntoCache)(`${sendOtpDTO.email}:otp`, otp, 3 * 60);
        await (0, common_1.sendEmail)({
            to: sendOtpDTO.email,
            subject: "resend otp",
            html: `<p>your otp is ${otp}</p>`,
        });
    }
}
exports.default = new AuthService();
