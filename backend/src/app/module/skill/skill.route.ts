import { Router } from "express";

import { SkillControllers } from "./skill.controller";
import { SkillValidations } from "./skill.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

// Public
router.get("/", SkillControllers.getAllSkills);

// Admin
router.post(
	"/",
	auth(Role.ADMIN),
	validateRequest(SkillValidations.createSkillZodSchema),
	SkillControllers.createSkill,
);

router.patch(
	"/:id",
	auth(Role.ADMIN),
	validateRequest(SkillValidations.updateSkillZodSchema),
	SkillControllers.updateSkill,
);

router.delete("/:id", auth(Role.ADMIN), SkillControllers.deleteSkill);

export const SkillRoutes = router;
