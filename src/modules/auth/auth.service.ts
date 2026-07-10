import bcrypt from "bcryptjs";
import config from "../../config";
import { IRegisterUser } from "./auth.interface";
import { prisma } from "../../lib/prisma";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const {
    name,
    email,
    password,
    phone,
    profileImage,
    role,
  } = payload;

  // Check if user already exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  // Create User
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      profileImage,
      role,
    },
  });

  // Return user without password
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const AuthService = {
  registerUserIntoDB,
};