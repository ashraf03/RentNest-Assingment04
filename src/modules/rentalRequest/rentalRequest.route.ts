import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth";
import { RentalRequestController } from "./rentalRequest.controller";
import validateRequest from "../../middleware/validateRequest";
import { RentalRequestValidation } from "./rentalRequest.validation";


const router = express.Router();

router.post(
  "/",
  auth(Role.TENANT),
   validateRequest(
    RentalRequestValidation.createRentalRequestValidationSchema
  ),
  RentalRequestController.createRentalRequest
);

router.get(
  "/",
  auth(Role.TENANT),
  RentalRequestController.getMyRentalRequests
);

router.get(
  "/:id",
  auth(Role.TENANT),
  RentalRequestController.getSingleRentalRequest
);

export const RentalRequestRoutes = router;