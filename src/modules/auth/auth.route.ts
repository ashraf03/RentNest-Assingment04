import express from "express";
import { AuthController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth";

const router = express.Router();

// Register User
router.post("/register", AuthController.registerUser);

// Login User
router.post(
  "/login",
  AuthController.loginUser
);

router.get("/me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), AuthController.getMe);
export const AuthRoutes = router;