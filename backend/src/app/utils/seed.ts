import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
	try {
		const isAdminExist = await prisma.user.findFirst({
			where: { role: Role.ADMIN },
		});

		if (isAdminExist) {
			return;
		}

		const {
			admin_name: name,
			admin_email: email,
			admin_password: password,
		} = config;

		if (!name || !email || !password) {
			console.warn(
				"Admin seed skipped: ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.",
			);
			return;
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		await prisma.user.create({
			data: { name, email, password: hashedPassword },
		});

		const existingProfile = await prisma.profile.findFirst();

		if (!existingProfile) {
			await prisma.profile.create({
				data: {
					name,
					headline: "Full-Stack Developer",
					bio: "Passionate software engineer building scalable web apps.",
					email,
				},
			});
		}

		console.log("Admin seeded successfully.");
	} catch (error) {
		console.error("Failed to seed admin:", error);
	}
};
