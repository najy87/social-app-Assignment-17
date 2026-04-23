// zod
import z from "zod";
import { SYS_GENDER } from "../../common";
import { generalFildes } from "../../common/constant";
export const signupSchema = z.object({
  email: generalFildes.email,
  gender: generalFildes.gender,
  password: generalFildes.password,
  phoneNumber: generalFildes.phoneNumber,
  userName: generalFildes.userName,
});

// export const loginSchema =
// export const forgetPasswordSchema =
