import { prisma } from "../../lib/prisma";
import type { IUpdateProfilePayload } from "./profile.interface";

const getProfile = async () => {
	return await prisma.profile.findFirst();
};

const updateProfile = async (payload: IUpdateProfilePayload) => {
	const existingProfile = await prisma.profile.findFirst();

	if (!existingProfile) {
		return await prisma.profile.create({ data: payload });
	}

	return await prisma.profile.update({
		where: { id: existingProfile.id },
		data: payload,
	});
};

export const ProfileServices = {
	getProfile,
	updateProfile,
};
