import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CertificationServices } from "./certification.service";

const getAllCertifications = catchAsync(
	async (_req: Request, res: Response) => {
		const result = await CertificationServices.getAllCertifications();

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Certifications retrieved successfully",
			data: result,
		});
	},
);

const createCertification = catchAsync(async (req: Request, res: Response) => {
	const result = await CertificationServices.createCertification(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Certification added successfully",
		data: result,
	});
});

const updateCertification = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await CertificationServices.updateCertification(
		id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Certification updated successfully",
		data: result,
	});
});

const deleteCertification = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await CertificationServices.deleteCertification(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Certification deleted successfully",
		data: result,
	});
});

export const CertificationControllers = {
	getAllCertifications,
	createCertification,
	updateCertification,
	deleteCertification,
};
