import jwt from "jsonwebtoken";

export function verifyMobileToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}