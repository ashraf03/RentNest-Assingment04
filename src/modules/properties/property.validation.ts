import { z } from "zod";

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters"),

    rent: z
      .number()
      .positive("Rent must be greater than 0"),

    address: z
      .string()
      .trim()
      .min(5, "Address is required"),

    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    bedrooms: z
      .number()
      .int("Bedrooms must be an integer")
      .min(1, "Minimum 1 bedroom is required"),

    bathrooms: z
      .number()
      .int("Bathrooms must be an integer")
      .min(1, "Minimum 1 bathroom is required"),

    availability: z.boolean().optional(),

    categoryId: z
      .string()
      .uuid("Invalid Category ID"),
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(5)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .min(20)
      .optional(),

    rent: z
      .number()
      .positive()
      .optional(),

    address: z
      .string()
      .trim()
      .optional(),

    city: z
      .string()
      .trim()
      .optional(),

    bedrooms: z
      .number()
      .int()
      .min(1)
      .optional(),

    bathrooms: z
      .number()
      .int()
      .min(1)
      .optional(),

    availability: z
      .boolean()
      .optional(),

    categoryId: z
      .string()
      .uuid()
      .optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};