import z from "zod";

const projectImageSchema = z.object({
	imageUrl: z.string().url("Image URL must be a valid URL"),
	caption: z.string().optional(),
});

const createProjectZodSchema = z.object({
	name: z
		.string({
			message: "Project name is required",
		})
		.min(2, "Project name must be at least 2 characters long"),
	slug: z.string().optional(),
	type: z.string({
		message: "Project type is required",
	}),
	shortDescription: z
		.string({
			message: "Short description is required",
		})
		.min(10, "Short description must be at least 10 characters")
		.max(280, "Short description cannot exceed 280 characters"),
	description: z
		.string({
			message: "Full description is required",
		})
		.min(20, "Description must be at least 20 characters long"),

	frontendTech: z.array(z.string()).default([]),
	backendTech: z.array(z.string()).default([]),
	tools: z.array(z.string()).default([]),

	githubClient: z
		.string({
			message: "GitHub client URL is required",
		})
		.url("GitHub client must be a valid URL"),
	githubServer: z
		.string({
			message: "GitHub server URL is required",
		})
		.url("GitHub server must be a valid URL"),
	liveUrl: z
		.string({
			message: "Live URL is required",
		})
		.url("Live URL must be a valid URL"),
	walkthroughVideoUrl: z
		.string()
		.url("Video URL must be a valid URL")
		.optional()
		.nullable(),

	keyFeatures: z.array(z.string()).default([]),
	challengesFaced: z.array(z.string()).default([]),
	futurePlans: z.array(z.string()).default([]),

	images: z.array(projectImageSchema).optional(),

	isFeatured: z.boolean().default(false),
	isPublished: z.boolean().default(true),
});

const updateProjectZodSchema = z.object({
	name: z
		.string()
		.min(2, "Project name must be at least 2 characters long")
		.optional(),
	slug: z.string().optional(),
	type: z.string().optional(),
	shortDescription: z
		.string()
		.min(10, "Short description must be at least 10 characters")
		.max(280, "Short description cannot exceed 280 characters")
		.optional(),
	description: z
		.string()
		.min(20, "Description must be at least 20 characters long")
		.optional(),

	frontendTech: z.array(z.string()).optional(),
	backendTech: z.array(z.string()).optional(),
	tools: z.array(z.string()).optional(),

	githubClient: z.string().url("GitHub client must be a valid URL").optional(),
	githubServer: z.string().url("GitHub server must be a valid URL").optional(),
	liveUrl: z.string().url("Live URL must be a valid URL").optional(),
	walkthroughVideoUrl: z
		.string()
		.url("Video URL must be a valid URL")
		.optional()
		.nullable(),

	keyFeatures: z.array(z.string()).optional(),
	challengesFaced: z.array(z.string()).optional(),
	futurePlans: z.array(z.string()).optional(),

	images: z.array(projectImageSchema).optional(),

	isFeatured: z.boolean().optional(),
	isPublished: z.boolean().optional(),
});

export const ProjectValidations = {
	createProjectZodSchema,
	updateProjectZodSchema,
};
