
import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),

    phone: z.string().optional(),

    profileImage: z.string().optional(),

    role: z.nativeEnum(Role, {
      required_error: "Role is required",
    }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};