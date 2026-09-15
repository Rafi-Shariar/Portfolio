import path from "node:path";
import ejs from "ejs";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import type { IContactPayload } from "./contact.interface";

const sendContactMessage = async (payload: IContactPayload) => {
	const { name, email, phone, message } = payload;

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/contact-email.ejs",
	);

	const html = await ejs.renderFile(templatePath, {
		name,
		email,
		phone: phone || null,
		message,
	});

	await transporter.sendMail({
		from: `"${name}" <${config.email_sender}>`,
		to: config.email_sender,
		replyTo: email,
		subject: `Portfolio Contact: Message from ${name}`,
		html,
	});

	return null;
};

export const ContactServices = {
	sendContactMessage,
};
