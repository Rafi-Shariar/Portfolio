import { Router } from "express";
import { contactRateLimiter } from "../../middleware/rateLimiter";
import { validateRequest } from "../../middleware/validateRequest";
import { ContactControllers } from "./contact.controller";
import { ContactValidation } from "./contact.validation";

const router = Router();

router.post(
	"/",
	contactRateLimiter,
	validateRequest(ContactValidation.sendContactEmailZodSchema),
	ContactControllers.sendContactMessage,
);

export const ContactRoutes = router;
