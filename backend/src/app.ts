import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { CertificationRoutes } from "./app/module/certification/certification.route";
import { ContactRoutes } from "./app/module/contact/contact.route";
import { ExperienceRoutes } from "./app/module/experience/experience.route";
import { ProfileRoutes } from "./app/module/profile/profile.route";
import { ProjectRoutes } from "./app/module/project/project.route";
import { SkillRoutes } from "./app/module/skill/skill.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.get("/", (_req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Rafi Shariar's Portfolio",
	});
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/profile", ProfileRoutes);
app.use("/api/v1/project", ProjectRoutes);
app.use("/api/v1/skill", SkillRoutes);
app.use("/api/v1/experience", ExperienceRoutes);
app.use("/api/v1/certification", CertificationRoutes);
app.use("/api/v1/contact", ContactRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
