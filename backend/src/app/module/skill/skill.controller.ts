import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SkillServices } from "./skill.service";

const getAllSkills = catchAsync(async (_req: Request, res: Response) => {
	const result = await SkillServices.getAllSkills();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Skills retrieved successfully",
		data: result,
	});
});

const createSkill = catchAsync(async (req: Request, res: Response) => {
	const result = await SkillServices.createSkill(req.body);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Skill created successfully",
		data: result,
	});
});

const updateSkill = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SkillServices.updateSkill(id as string, req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Skill updated successfully",
		data: result,
	});
});

const deleteSkill = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SkillServices.deleteSkill(id as string);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Skill deleted successfully",
		data: result,
	});
});

export const SkillControllers = {
	getAllSkills,
	createSkill,
	updateSkill,
	deleteSkill,
};
