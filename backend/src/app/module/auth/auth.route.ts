import { Router } from "express";
import { authRateLimiter } from "../../middleware/rateLimiter";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
	"/login",
	authRateLimiter,
	validateRequest(AuthValidation.loginSchema),
	AuthControllers.loginAdmin,
);

export const AuthRoutes = router;
