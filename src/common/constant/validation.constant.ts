import z from "zod";
import { SYS_GENDER } from "../enums";

export const generalFildes = {
  email: z.email({ message: "invalid email adress" }),
  gender: z.enum(SYS_GENDER).optional(),
  password: z
    .string({ message: "password is required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
  userName: z.string({ message: "username is required" }).min(2).max(20),
  phoneNumber: z
    .string({ message: "invalid phone number" })
    .regex(/^(00201|01|\+201)[0-25]{1}[0-9]{8}$/),  
};
