import { AdminController } from "./admin.controller";
import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { AdminValidation } from "./admin.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get(
  "/users",
  auth(Role.ADMIN),
  AdminController.getAllUsers
);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(AdminValidation.updateUserStatusValidationSchema),
  AdminController.updateUserStatus
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  AdminController.getAllProperties
);

router.get(
  "/rentals",
  auth(Role.ADMIN),
  AdminController.getAllRentalRequests
);

export const AdminRoutes = router;