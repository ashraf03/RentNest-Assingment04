import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { ReviewController } from "./reviews.controller";

const router = express.Router();

router.post(
  "/",
  auth(Role.TENANT),
  ReviewController.createReview
);

export const ReviewRoute = router;