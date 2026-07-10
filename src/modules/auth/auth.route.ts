// src/modules/auth/auth.route.ts

import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
// import validateRequest from "../../middleware/validateRequest";
// import { AuthValidation } from "./auth.validation";

const router = express.Router();

// Register User
router.post("/register", AuthController.registerUser);

router.post(
  "/login",
//   validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.get(
  "/me",
  auth(),
  AuthController.getMe
);

export const AuthRoutes = router;