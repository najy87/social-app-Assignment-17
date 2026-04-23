import type { NextFunction, Request, Response } from "express";



export const isAuthentecated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get token >> authorization from req >> headres
  // check token
  // check user into DB
  // await userRepo ....
};
