// src/app/modules/landManagement/landManagement.route.ts

import express from "express";
import { LandManagementController } from "./landManagement.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/properties",
  auth(Role.LANDLORD),
  LandManagementController.createProperty
);

router.put(
  "/properties/:id",
  auth(Role.LANDLORD),
  LandManagementController.updateProperty
);

router.delete(
  "/properties/:id",
  auth(Role.LANDLORD),
  LandManagementController.deleteProperty
);

router.get(
  "/requests",
  auth(Role.LANDLORD),
  LandManagementController.getRentalRequests
);

router.patch(
  "/requests/:id",
  auth(Role.LANDLORD),
  LandManagementController.updateRentalRequest
);

export const LandManagementRoutes = router;