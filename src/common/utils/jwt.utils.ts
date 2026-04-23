import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import crypto from "node:crypto";

export function signToken(
  payload: JwtPayload,
  secret: string,
  options: SignOptions,
) {
  payload.jti = crypto.randomBytes(10).toString("hex");
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}

export function generateTokens(payload: JwtPayload) {
  const accessToken = signToken(payload, "fkdjfdjvkvsdkjvnv", {
    expiresIn: 60 * 200,
  });

  const refreshToken = signToken(payload, "fjdsgiuegegiesg", {
    expiresIn: "1y",
  });

  return { accessToken, refreshToken };
}
