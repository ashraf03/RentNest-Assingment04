import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { JsTokentils } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get Token
      const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization);

      if (!token) {
        throw new Error(
          "You are not logged in. Please login first."
        );
      }

      // Verify Token
      const verifiedToken = JsTokentils.verifyToken(
        token,
        config.jwt_access_secret as string
      );

      if (!verifiedToken.success) {
        throw new Error("Invalid Token");
      }

      const { id } = verifiedToken.data as JwtPayload;

      // Check User
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new Error(
          "User not found. Please login again."
        );
      }

      // Role Check
      if (
        requiredRoles.length &&
        !requiredRoles.includes(user.role)
      ) {
        throw new Error(
          "Forbidden! You do not have permission to access this resource."
        );
      }

      // Attach User
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    }
  );
};

export default auth;