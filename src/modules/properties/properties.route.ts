import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth";
import { PropertyController } from "./properties.controller";
import validateRequest from "../../middleware/validateRequest";
import { PropertyValidation } from "./property.validation";


const router = express.Router();

// Create Property
router.post(
  "/",
  auth(Role.LANDLORD),
validateRequest(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty
);

// Get All Properties (Public)
router.get(
  "/",
  PropertyController.getAllProperties
);

// Get Single Property
router.get(
  "/:id",
  PropertyController.getSingleProperty
);

// Update Property
router.patch(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty
);

// Delete Property
router.delete(
  "/:id",
  auth(Role.LANDLORD),
  PropertyController.deleteProperty
);

// Update Availability
router.patch(
  "/:id/availability",
  auth(Role.LANDLORD),
  PropertyController.updateAvailability
);

export const PropertyRoutes = router;