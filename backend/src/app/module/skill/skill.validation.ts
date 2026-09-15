import z from "zod";

const createSkillZodSchema = z.object({
	name: z.string({ message: "Skill name is required" }).min(1),
	category: z.string({ message: "Category is required" }).min(1),
	iconUrl: z.string().url("Icon URL must be valid").optional().nullable(),
	order: z.number().int().default(0),
});

const updateSkillZodSchema = z.object({
	name: z.string().min(1).optional(),
	category: z.string().min(1).optional(),
	iconUrl: z.string().url("Icon URL must be valid").optional().nullable(),
	order: z.number().int().optional(),
});

export const SkillValidations = {
	createSkillZodSchema,
	updateSkillZodSchema,
};
