import { Router } from "express";

import { ProjectControllers } from "./project.controller";
import { ProjectValidations } from "./project.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

// Public routes
router.get("/featured", ProjectControllers.getFeaturedProjects);
router.get("/", ProjectControllers.getAllPublishedProjects);
router.get("/:slug", ProjectControllers.getProjectBySlug);

// Admin routes
router.get(
	"/admin/all",
	auth(Role.ADMIN),
	ProjectControllers.getAllAdminProjects,
);
router.get(
	"/admin/:id",
	auth(Role.ADMIN),
	ProjectControllers.getAdminProjectById,
);

router.post(
	"/",
	auth(Role.ADMIN),
	validateRequest(ProjectValidations.createProjectZodSchema),
	ProjectControllers.createProject,
);

router.patch(
	"/:id",
	auth(Role.ADMIN),
	validateRequest(ProjectValidations.updateProjectZodSchema),
	ProjectControllers.updateProject,
);

router.delete("/:id", auth(Role.ADMIN), ProjectControllers.softDeleteProject);

router.patch(
	"/:id/toggle-publish",
	auth(Role.ADMIN),
	ProjectControllers.toggleProjectPublish,
);

router.patch(
	"/:id/toggle-featured",
	auth(Role.ADMIN),
	ProjectControllers.toggleProjectFeatured,
);

export const ProjectRoutes = router;
