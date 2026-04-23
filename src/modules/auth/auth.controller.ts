import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware";
import { signupSchema } from "./auth.validation";
const router = Router();

// signup
router.post(
  "/signup",
  isValid(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    // call service
    await authService.signup(req.body);
    // send response
    return res.status(201).json({
      massege: "user created successfully",
      success: true,
    });
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.login(req.body);
    return res.status(200).json({
      massege: "login successfully",
      success: true,
    });
  },
);

router.post(
  "/verify-account",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.verifyAccount(req.body);
    return res.status(200).json({
      massege: "user verifed successfully",
      success: true,
    });
  },
);

router.post(
  "/resend-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.sendOtp(req.body);
    return res.status(200).json({
      massege: "resend otp successfully",
      success: true,
    });
  },
);

router.patch(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.resetPassword(req.body);
    return res.status(200).json({
      massege: "reset password successfully",
      success: true,
    });
  },
);
export default router;
