import { Router } from "express";
import rateLimit from "express-rate-limit";
import authController from "../controllers/authController";
import { validateRequest } from "../middlewares/validationMiddleware";
import { registerSchema, loginSchema } from "../validators/authValidators";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post(
  "/login",
  loginLimiter,
  validateRequest(loginSchema),
  authController.login
);

export default router;
