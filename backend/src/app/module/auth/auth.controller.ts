import type { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
	const { accessToken } = await AuthServices.loginAdmin(req.body);

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: config.node_env !== "development",
		sameSite: config.node_env === "development" ? "lax" : "none",
		maxAge: 1000 * 60 * 60 * 24, // 1 day
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Welcome Back",
		data: null,
	});
});

export const AuthControllers = {
	loginAdmin,
};
