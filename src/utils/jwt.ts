import jwt, { Secret, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: object,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

const verifyToken = (
  token: string,
  secret: Secret
): jwt.JwtPayload => {
  return jwt.verify(token, secret) as jwt.JwtPayload;
};

export const JwtUtils = {
  generateToken,
  verifyToken,
};