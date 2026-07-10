// src/modules/auth/auth.interface.ts

import { Role } from "../../../generated/prisma/enums";

/**
 * Register Payload
 */
export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  role: Role;
}

/**
 * Login Payload
 */
export interface ILoginUser {
  email: string;
  password: string;
}

/**
 * JWT Payload
 */
export interface IJwtPayload {
  userId: string;
  email: string;
  role: Role;
}

/**
 * Auth Response
 */
export interface IAuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone?: string | null;
    profileImage?: string | null;
  };
}