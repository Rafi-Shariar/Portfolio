import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectServices } from "./project.service";

// ==========================================
// Public Controllers
// ==========================================

const getFeaturedProjects = catchAsync(async (_req: Request, res: Response) => {
	const result = await ProjectServices.getFeaturedProjects();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Featured projects retrieved successfully",
		data: result,
	});
});

const getAllPublishedProjects = catchAsync(
	async (_req: Request, res: Response) => {
		const result = await ProjectServices.getAllPublishedProjects();

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "All projects retrieved successfully",
			data: result,
		});
	},
);

const getProjectBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;
	const result = await ProjectServices.getProjectBySlug(slug as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project details retrieved successfully",
		data: result,
	});
});

// ==========================================
// Admin Controllers
// ==========================================

const getAllAdminProjects = catchAsync(async (_req: Request, res: Response) => {
	const result = await ProjectServices.getAllAdminProjects();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Admin projects retrieved successfully",
		data: result,
	});
});

const getAdminProjectById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectServices.getAdminProjectById(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Admin project details retrieved successfully",
		data: result,
	});
});

const createProject = catchAsync(async (req: Request, res: Response) => {
	const result = await ProjectServices.createProject(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Project created successfully",
		data: result,
	});
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectServices.updateProject(id as string, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project updated successfully",
		data: result,
	});
});

const softDeleteProject = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectServices.softDeleteProject(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project deleted successfully",
		data: result,
	});
});

const toggleProjectPublish = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ProjectServices.toggleProjectPublish(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Project publication status updated successfully",
		data: result,
	});
});

const toggleProjectFeatured = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const result = await ProjectServices.toggleProjectFeatured(id as string);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Project featured status updated successfully",
			data: result,
		});
	},
);

export const ProjectControllers = {
	getFeaturedProjects,
	getAllPublishedProjects,
	getProjectBySlug,
	getAllAdminProjects,
	getAdminProjectById,
	createProject,
	updateProject,
	softDeleteProject,
	toggleProjectPublish,
	toggleProjectFeatured,
};
