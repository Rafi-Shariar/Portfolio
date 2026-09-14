import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post(
	"/login",
	validateRequest(AuthValidation.loginSchema),
	AuthControllers.loginAdmin,
);


export const AuthRoutes = router;
