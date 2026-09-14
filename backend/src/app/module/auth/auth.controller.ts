import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";



const loginAdmin = catchAsync(async (req: Request, res: Response) => {

	const result = await AuthServices.loginAdmin(req.body);
	const { accessToken } = result;


res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: config.node_env === "development" ? false : true,
		sameSite: config.node_env === "development" ? "lax" : "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});


	

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Welcome Back",
		data: {
			accessToken : accessToken
		},
	});
});



export const AuthControllers = {
	loginAdmin
	
};
