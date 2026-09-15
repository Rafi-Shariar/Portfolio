import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { CertificationControllers } from "./certification.controller";
import { CertificationValidations } from "./certification.validation";

const router = Router();

// Public
router.get("/", CertificationControllers.getAllCertifications);

// Admin
router.post(
	"/",
	auth(Role.ADMIN),
	validateRequest(CertificationValidations.createCertificationZodSchema),
	CertificationControllers.createCertification,
);

router.patch(
	"/:id",
	auth(Role.ADMIN),
	validateRequest(CertificationValidations.updateCertificationZodSchema),
	CertificationControllers.updateCertification,
);

router.delete(
	"/:id",
	auth(Role.ADMIN),
	CertificationControllers.deleteCertification,
);

export const CertificationRoutes = router;
