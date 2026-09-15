import { Router } from "express";

import { ProfileControllers } from "./profile.controller";
import { ProfileValidations } from "./profile.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

// Public
router.get("/", ProfileControllers.getProfile);

// Admin (Upsert)
router.patch(
	"/",
	auth(Role.ADMIN),
	validateRequest(ProfileValidations.updateProfileZodSchema),
	ProfileControllers.updateProfile,
);

export const ProfileRoutes = router;
