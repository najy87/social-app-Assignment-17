import { NextFunction, Request, Response } from "express";

import { ZodObject } from "zod";
import { BadRequestException } from "../common";

export const isValid = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const reslut = await schema.safeParseAsync(req.body);
    if (reslut.success == false) {
      // prepare errors
      const errMasseges = reslut.error.issues.map((issue) => ({
        path: issue.path[0] as string,
        messege: issue.message,
      }));
      throw new BadRequestException("validation error", errMasseges);
    }
    next();
  };
};
