import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { BcryptUtils } from "../../utils/bcrypt";
import { JwtUtils } from "../../utils/jwt";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { User } from '@prisma/client';


const registerUser = async (payload: IRegisterUser): Promise<Omit<User, "password">> => {
  // Check if user already exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists.");
  }

  // Hash password
  const hashedPassword = await BcryptUtils.hashPassword(payload.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      profileImage: payload.profileImage,
      role: payload.role,
    },
  });

  // Remove password before returning
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const loginUser = async (payload: ILoginUser) => {
  // Check user exists
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new Error("User does not exist.");
  }

  // Compare password
  const isPasswordMatched = await BcryptUtils.comparePassword(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  // Generate Access Token
  const accessToken = JwtUtils.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt_access_secret as SignOptions,
    config.jwt_access_expires_in as SignOptions,
  );

  // Remove password before sending response
  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};