import { UserStatus } from "../../../prisma/schemas/enums";
import { z } from "zod";

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(UserStatus),
  }),
});

export const AdminValidation = {
  updateUserStatusValidationSchema,
};