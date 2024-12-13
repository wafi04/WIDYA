import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const registerHandler: AsyncRouteHandler = async (req, res, _next) => {
  await registerUser(req, res);
};

const loginHandler: AsyncRouteHandler = async (req, res, _next) => {
  await loginUser(req, res);
};
const getUSer: AsyncRouteHandler = async (req, res, next) => {
  await protect(req, res, next);
};

router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));

router.get("/profile", asyncHandler(getUSer), getUserProfile);

export default router;
