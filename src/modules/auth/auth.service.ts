import bcrypt from "bcryptjs";
import config from "../../config";
import { IRegisterUser } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { JsTokentils } from "../../utils/jwt";


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

const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password does not match");
  }

 const accessToken = JsTokentils.createToken(
  {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  config.jwt_access_secret as string,
  config.jwt_access_expires_in as SignOptions
);

const refreshToken = JsTokentils.createToken(
  {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  config.jwt_refresh_secret as string,
  config.jwt_access_expires_in as SignOptions
);
  return {
    accessToken,
    refreshToken
  };
};


const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthService = {
  registerUserIntoDB,
  loginUser,
  getMe,
};