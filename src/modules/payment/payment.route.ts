import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post(
  "/create",
  auth(Role.TENANT),
  PaymentController.createPayment
);

router.post(
  "/confirm",
  PaymentController.confirmPayment
);

router.get(
  "/",
  auth(Role.TENANT),
  PaymentController.getPaymentHistory
);

router.get(
  "/:id",
  auth(Role.TENANT),
  PaymentController.getSinglePayment
);

export const PaymentRoutes = router;