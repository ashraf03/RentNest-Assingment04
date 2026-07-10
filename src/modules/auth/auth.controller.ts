// src/modules/auth/auth.controller.ts

import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const loginUser = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  try {
    const payload = req.body;
    const {accessToken, refreshToken} = await AuthService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 100 * 60 * 60 * 24, // 24 hour or 1 day
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 100 * 60 * 60 * 7, // 24 hour or 1 day
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {accessToken, refreshToken},
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

const getMe = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  try {
    const result = await AuthService.getMe(req.user?.id as string);

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {result},
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
};