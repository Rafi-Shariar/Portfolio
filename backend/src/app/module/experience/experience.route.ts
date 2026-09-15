import { Router } from "express";

import { ExperienceControllers } from "./experience.controller";
import { ExperienceValidations } from "./experience.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

// Public
router.get("/", ExperienceControllers.getAllExperiences);

// Admin
router.post(
	"/",
	auth(Role.ADMIN),
	validateRequest(ExperienceValidations.createExperienceZodSchema),
	ExperienceControllers.createExperience,
);

router.patch(
	"/:id",
	auth(Role.ADMIN),
	validateRequest(ExperienceValidations.updateExperienceZodSchema),
	ExperienceControllers.updateExperience,
);

router.delete("/:id", auth(Role.ADMIN), ExperienceControllers.deleteExperience);

export const ExperienceRoutes = router;
