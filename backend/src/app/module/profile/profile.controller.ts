import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProfileServices } from "./profile.service";

const getProfile = catchAsync(async (_req: Request, res: Response) => {
	const result = await ProfileServices.getProfile();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile retrieved successfully",
		data: result,
	});
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await ProfileServices.updateProfile(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile updated successfully",
		data: result,
	});
});

export const ProfileControllers = {
	getProfile,
	updateProfile,
};
