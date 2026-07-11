import { z } from "zod";
import { Role } from "@prisma/client";

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),

    phone: z
      .string()
      .trim()
      .optional(),

    profileImage: z
      .string()
      .url("Invalid image URL")
      .optional(),

    role: z.enum(["TENANT", "LANDLORD"]),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};