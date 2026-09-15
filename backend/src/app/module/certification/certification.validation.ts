import z from "zod";

const createCertificationZodSchema = z.object({
	title: z.string({ message: "Title is required" }).min(1),
	issuer: z.string({ message: "Issuer is required" }).min(1),
	issueDate: z
		.string({ message: "Issue date is required" })
		.datetime({ message: "Invalid issue date format (ISO required)" }),
	expiryDate: z
		.string()
		.datetime({ message: "Invalid expiry date format (ISO required)" })
		.optional()
		.nullable(),
	credentialUrl: z.string().url("Invalid credential URL").optional().nullable(),
	certificateImage: z.string().url("Invalid image URL").optional().nullable(),
	order: z.number().int().default(0),
});

const updateCertificationZodSchema = z.object({
	title: z.string().min(1).optional(),
	issuer: z.string().min(1).optional(),
	issueDate: z.string().datetime().optional(),
	expiryDate: z.string().datetime().optional().nullable(),
	credentialUrl: z.string().url("Invalid credential URL").optional().nullable(),
	certificateImage: z.string().url("Invalid image URL").optional().nullable(),
	order: z.number().int().optional(),
});

export const CertificationValidations = {
	createCertificationZodSchema,
	updateCertificationZodSchema,
};
