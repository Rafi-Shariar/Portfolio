import z from "zod";

const createExperienceZodSchema = z.object({
	company: z.string({ message: "Company name is required" }).min(1),
	role: z.string({ message: "Role is required" }).min(1),
	location: z.string().optional().nullable(),
	startDate: z
		.string({ message: "Start date is required" })
		.datetime({ message: "Invalid start date format (ISO required)" }),
	endDate: z
		.string()
		.datetime({ message: "Invalid end date format (ISO required)" })
		.optional()
		.nullable(),
	isCurrent: z.boolean().default(false),
	description: z
		.string({ message: "Description is required" })
		.min(10, "Description must be at least 10 characters long"),
	technologies: z.array(z.string()).default([]),
	order: z.number().int().default(0),
});

const updateExperienceZodSchema = z.object({
	company: z.string().min(1).optional(),
	role: z.string().min(1).optional(),
	location: z.string().optional().nullable(),
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional().nullable(),
	isCurrent: z.boolean().optional(),
	description: z.string().min(10).optional(),
	technologies: z.array(z.string()).optional(),
	order: z.number().int().optional(),
});

export const ExperienceValidations = {
	createExperienceZodSchema,
	updateExperienceZodSchema,
};
