
import { z } from "zod";
import { RentalRequestStatus } from "../../../generated/prisma/enums";

const createRentalRequestValidationSchema = z.object({
  body: z.object({
    propertyId: z
      .string()
      .uuid("Invalid Property ID"),

    moveInDate: z
      .string()
      .datetime("Invalid move-in date"),

    message: z
      .string()
      .trim()
      .max(500, "Message cannot exceed 500 characters")
      .optional(),
  }),
});

const updateRentalRequestValidationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(RentalRequestStatus),
  }),
});

export const RentalRequestValidation = {
  createRentalRequestValidationSchema,
  updateRentalRequestValidationSchema,
};