import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	ICreateExperiencePayload,
	IUpdateExperiencePayload,
} from "./experience.interface";

const getAllExperiences = async () => {
	return await prisma.experience.findMany({
		orderBy: [{ order: "asc" }, { startDate: "desc" }],
	});
};

const createExperience = async (payload: ICreateExperiencePayload) => {
	return await prisma.experience.create({
		data: {
			...payload,
			startDate: new Date(payload.startDate),
			endDate: payload.endDate ? new Date(payload.endDate) : null,
		},
	});
};

const updateExperience = async (
	id: string,
	payload: IUpdateExperiencePayload,
) => {
	const existing = await prisma.experience.findUnique({ where: { id } });
	if (!existing)
		throw new AppError(httpStatus.NOT_FOUND, "Experience record not found");

	const { startDate, endDate, ...rest } = payload;

	return await prisma.experience.update({
		where: { id },
		data: {
			...rest,
			...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
			...(endDate !== undefined
				? { endDate: endDate ? new Date(endDate) : null }
				: {}),
		},
	});
};

const deleteExperience = async (id: string) => {
	const existing = await prisma.experience.findUnique({ where: { id } });
	if (!existing)
		throw new AppError(httpStatus.NOT_FOUND, "Experience record not found");

	return await prisma.experience.delete({ where: { id } });
};

export const ExperienceServices = {
	getAllExperiences,
	createExperience,
	updateExperience,
	deleteExperience,
};
