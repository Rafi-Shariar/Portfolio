import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	ICreateCertificationPayload,
	IUpdateCertificationPayload,
} from "./certification.interface";

const getAllCertifications = async () => {
	return await prisma.certification.findMany({
		orderBy: [{ order: "asc" }, { issueDate: "desc" }],
	});
};

const createCertification = async (payload: ICreateCertificationPayload) => {
	return await prisma.certification.create({
		data: {
			...payload,
			issueDate: new Date(payload.issueDate),
			expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
		},
	});
};

const updateCertification = async (
	id: string,
	payload: IUpdateCertificationPayload,
) => {
	const existing = await prisma.certification.findUnique({ where: { id } });
	if (!existing)
		throw new AppError(httpStatus.NOT_FOUND, "Certification not found");

	const { issueDate, expiryDate, ...rest } = payload;

	return await prisma.certification.update({
		where: { id },
		data: {
			...rest,
			...(issueDate !== undefined ? { issueDate: new Date(issueDate) } : {}),
			...(expiryDate !== undefined
				? { expiryDate: expiryDate ? new Date(expiryDate) : null }
				: {}),
		},
	});
};

const deleteCertification = async (id: string) => {
	const existing = await prisma.certification.findUnique({ where: { id } });
	if (!existing)
		throw new AppError(httpStatus.NOT_FOUND, "Certification not found");

	return await prisma.certification.delete({ where: { id } });
};

export const CertificationServices = {
	getAllCertifications,
	createCertification,
	updateCertification,
	deleteCertification,
};
