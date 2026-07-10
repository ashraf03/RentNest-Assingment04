// src/middleware/auth.ts

import { NextFunction, Request, Response } from "express";
import { JwtUtils } from "../utils/jwt";
import { Role } from "../../generated/prisma/client";
import config from "../config";
import { SignOptions } from "jsonwebtoken";

const auth =
  (...requiredRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: "Authorization token is missing",
        });
      }

      const token = authorization.split(" ")[1];

      const decoded = JwtUtils.verifyToken(
        token,
        config.jwt_access_secret as SignOptions
      );

      (req as any).user = decoded;

      if (
        requiredRoles.length &&
        !requiredRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden Access",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or Expired Token",
      });
    }
  };

export default auth;