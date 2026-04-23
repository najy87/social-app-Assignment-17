import z from "zod";
import { signupSchema } from "./auth.validation";
// // data to object
// export interface SignupDTO {
//   email: string;
//   password: string;
//   userName: string;
//   phoneNumber?: string;
//   salary: number;
//   DOB: Date;
// }

export type SignupDTO = z.infer<typeof signupSchema>;

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  otp: string;
  email: string;
  newPassword: string;
}
export interface ResetPassword {
  password: string;
  otp: string;
  email: string;
}

export interface VerifyAccountDTO {
  otp: string;
  email: string;
}

export interface SendOtpDTO {
  email: string;
}
