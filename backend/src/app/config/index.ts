import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().default("5000"),
	DATABASE_URL: z.string().url(),
	FRONTEND_URL: z.string().url(),
	BACKEND_URL: z.string().url().optional(),
	BCRYPT_SALT_ROUNDS: z.string().default("10"),
	JWT_ACCESS_SECRET: z.string().min(1),
	JWT_ACCESS_EXPIRES_IN: z.string().min(1),
	SMTP_USER: z.string().email(),
	SMTP_PASSWORD: z.string().min(1),
	EMAIL_SENDER: z.string().email(),
	ADMIN_NAME: z.string().min(1),
	ADMIN_EMAIL: z.string().email(),
	ADMIN_PASSWORD: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error(
		"Invalid environment variables:",
		parsed.error.issues.map(
			(issue) => `${issue.path.join(".")}: ${issue.message}`,
		),
	);
	process.exit(1);
}

const env = parsed.data;

const config = {
	node_env: env.NODE_ENV,
	port: env.PORT,
	database_url: env.DATABASE_URL,
	frontend_url: env.FRONTEND_URL,
	backend_url: env.BACKEND_URL,
	bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
	jwt_access_secret: env.JWT_ACCESS_SECRET,
	jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN,
	smtp_user: env.SMTP_USER,
	smtp_password: env.SMTP_PASSWORD,
	email_sender: env.EMAIL_SENDER,
	admin_name: env.ADMIN_NAME,
	admin_email: env.ADMIN_EMAIL,
	admin_password: env.ADMIN_PASSWORD,
};

export default config;
