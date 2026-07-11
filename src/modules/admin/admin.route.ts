import { AdminController } from "./admin.controller";
import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/users",
  auth(Role.ADMIN),
  AdminController.getAllUsers
);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
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