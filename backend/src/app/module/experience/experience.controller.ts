import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ExperienceServices } from "./experience.service";

const getAllExperiences = catchAsync(async (_req: Request, res: Response) => {
	const result = await ExperienceServices.getAllExperiences();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Experiences retrieved successfully",
		data: result,
	});
});

const createExperience = catchAsync(async (req: Request, res: Response) => {
	const result = await ExperienceServices.createExperience(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Experience added successfully",
		data: result,
	});
});

const updateExperience = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ExperienceServices.updateExperience(
		id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Experience updated successfully",
		data: result,
	});
});

const deleteExperience = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ExperienceServices.deleteExperience(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Experience deleted successfully",
		data: result,
	});
});

export const ExperienceControllers = {
	getAllExperiences,
	createExperience,
	updateExperience,
	deleteExperience,
};
