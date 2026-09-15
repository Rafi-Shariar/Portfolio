import z from "zod";

const sendContactEmailZodSchema = z.object({
	name: z
		.string({ message: "Name is required" })
		.min(2, "Name must be at least 2 characters"),
	email: z
		.string({ message: "Email is required" })
		.email("Invalid email address"),
	phone: z.string().optional(),
	message: z
		.string({ message: "Message is required" })
		.min(5, "Message must be at least 5 characters")
		.max(2000, "Message cannot exceed 2000 characters"),
});

export const ContactValidation = {
	sendContactEmailZodSchema,
};
