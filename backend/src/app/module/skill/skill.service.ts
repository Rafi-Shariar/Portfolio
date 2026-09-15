import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const getAllSkills = async () => {
	const skills = await prisma.skill.findMany({
		orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
	});

	// Group by category alphabetically
	const groupedSkills = skills.reduce(
		(acc, skill) => {
			const { category } = skill;
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(skill);
			return acc;
		},
		{} as Record<string, typeof skills>,
	);

	return groupedSkills;
};
const createSkill = async (payload: {
	name: string;
	category: string;
	iconUrl?: string | null;
	order?: number;
}) => {
	return await prisma.skill.create({ data: payload });
};

const updateSkill = async (
	id: string,
	payload: Partial<{
		name: string;
		category: string;
		iconUrl?: string | null;
		order?: number;
	}>,
) => {
	const existing = await prisma.skill.findUnique({ where: { id } });
	if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Skill not found");

	return await prisma.skill.update({
		where: { id },
		data: payload,
	});
};

const deleteSkill = async (id: string) => {
	const existing = await prisma.skill.findUnique({ where: { id } });
	if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Skill not found");

	return await prisma.skill.delete({ where: { id } });
};

export const SkillServices = {
	getAllSkills,
	createSkill,
	updateSkill,
	deleteSkill,
};
