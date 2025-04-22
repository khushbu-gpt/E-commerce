import { ROLE } from "@/features/auth/users.types";
import jwt from "jsonwebtoken";
import AppError from "./AppError";

export type TokenPayload = {
  email: string;
  role: ROLE;
  uid: string;
};
type Unit =
  | "Years"
  | "Year"
  | "Yrs"
  | "Yr"
  | "Y"
  | "Weeks"
  | "Week"
  | "W"
  | "Days"
  | "Day"
  | "D"
  | "Hours"
  | "Hour"
  | "Hrs"
  | "Hr"
  | "H"
  | "Minutes"
  | "Minute"
  | "Mins"
  | "Min"
  | "M"
  | "Seconds"
  | "Second"
  | "Secs"
  | "Sec"
  | "s"
  | "Milliseconds"
  | "Millisecond"
  | "Msecs"
  | "Msec"
  | "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type JWT_EXPIRY_FORMAT =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

// interface JWTPayload {
//   [key: string]: unknown;
// }

function generateToken(data: TokenPayload, expiry: JWT_EXPIRY_FORMAT): string {
  const secret = process.env.SECRET as string;
  if (!secret) throw new AppError("JWT_SECRET is required");
  const token = jwt.sign(data, secret, { expiresIn: expiry });
  return token;
}

function generateAccessToken({ uid, email, role }: TokenPayload) {
  const accessExpiry =
    (process.env.JWT_ACCESS_EXPIRY as JWT_EXPIRY_FORMAT) || "1d";
  if (!accessExpiry) throw new AppError("JWT_ACCESS_EXPIRY is required");
  return generateToken({ uid, email, role }, accessExpiry);
}

function generateRefreshToken({ uid, email, role }: TokenPayload) {
  const refreshExpiry =
    (process.env.JWT_REFRESH_EXPIRY as JWT_EXPIRY_FORMAT) || "30d";
  if (!refreshExpiry) throw new AppError("JWT_REFRESH_EXPIRY is required");
  return generateToken({ uid, email, role }, refreshExpiry);
}

function generateLoginTokens({ uid, email, role }: TokenPayload): {
  accessToken: string;
  refreshToken: string;
} {
  const refreshExpiry =
    (process.env.JWT_REFRESH_EXPIRY as JWT_EXPIRY_FORMAT) || "30d";
  if (!refreshExpiry) throw new Error("JWT_REFRESH_EXPIRY is required");
  return {
    accessToken: generateAccessToken({ uid, email, role }),
    refreshToken: generateRefreshToken({ uid, email, role }),
  };
}

function decodeToken(token: string): TokenPayload {
  const secret = process.env.SECRET;
  if (!secret) throw new Error("JWT_SECRET is required!");
  return jwt.verify(token, secret) as TokenPayload;
}
export {
  generateAccessToken,
  generateRefreshToken,
  generateLoginTokens,
  decodeToken,
};
