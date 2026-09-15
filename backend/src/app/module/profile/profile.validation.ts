import z from "zod";

const updateProfileZodSchema = z.object({
	name: z.string().min(1).optional(),
	headline: z.string().min(1).optional(),
	bio: z.string().min(10).optional(),
	aboutMe: z.string().min(10).optional(),
	avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
	resumeUrl: z.string().url("Invalid resume URL").optional().nullable(),
	email: z.string().email("Invalid email").optional(),
	phone: z.string().optional().nullable(),
	location: z.string().optional().nullable(),
	github: z.string().url("Invalid GitHub URL").optional().nullable(),
	linkedin: z.string().url("Invalid LinkedIn URL").optional().nullable(),
	facebook: z.string().url("Invalid Facebook URL").optional().nullable(),
	codeforces: z.string().url("Invalid Codeforces URL").optional().nullable(),
	leetcode: z.string().url("Invalid LeetCode URL").optional().nullable(),
});

export const ProfileValidations = {
	updateProfileZodSchema,
};
