import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	ICreateProjectPayload,
	IUpdateProjectPayload,
} from "./project.interface";

const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

// ==========================================
// Public Services
// ==========================================

export const getFeaturedProjects = async () => {
	return await prisma.project.findMany({
		where: {
			isPublished: true,
			isDeleted: false,
			isFeatured: true,
		},
		include: {
			images: {
				select: {
					id: true,
					imageUrl: true,
					caption: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 3,
	});
};

export const getAllPublishedProjects = async () => {
	return await prisma.project.findMany({
		where: {
			isPublished: true,
			isDeleted: false,
		},
		include: {
			images: {
				select: {
					id: true,
					imageUrl: true,
					caption: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

export const getProjectBySlug = async (slug: string) => {
	const project = await prisma.project.findFirst({
		where: {
			slug,
			isPublished: true,
			isDeleted: false,
		},
		include: {
			images: {
				select: {
					id: true,
					imageUrl: true,
					caption: true,
				},
			},
		},
	});

	if (!project) {
		throw new AppError(httpStatus.NOT_FOUND, "Project not found");
	}

	return project;
};

// ==========================================
// Admin Services
// ==========================================

export const getAllAdminProjects = async () => {
	return await prisma.project.findMany({
		where: {
			isDeleted: false,
		},
		include: {
			images: {
				select: {
					id: true,
					imageUrl: true,
					caption: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

export const getAdminProjectById = async (id: string) => {
	const project = await prisma.project.findFirst({
		where: {
			id,
			isDeleted: false,
		},
		include: {
			images: true,
		},
	});

	if (!project) {
		throw new AppError(httpStatus.NOT_FOUND, "Project not found");
	}

	return project;
};

export const createProject = async (payload: ICreateProjectPayload) => {
	const { images, slug, ...projectData } = payload;

	const baseSlug = slug || generateSlug(projectData.name);

	const existingSlug = await prisma.project.findUnique({
		where: { slug: baseSlug },
	});

	const finalSlug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

	return await prisma.project.create({
		data: {
			name: projectData.name,
			slug: finalSlug,
			type: projectData.type,
			shortDescription: projectData.shortDescription,
			description: projectData.description,
			frontendTech: projectData.frontendTech || [],
			backendTech: projectData.backendTech || [],
			tools: projectData.tools || [],
			githubClient: projectData.githubClient,
			githubServer: projectData.githubServer,
			liveUrl: projectData.liveUrl,
			walkthroughVideoUrl: projectData.walkthroughVideoUrl ?? null,
			keyFeatures: projectData.keyFeatures || [],
			challengesFaced: projectData.challengesFaced || [],
			futurePlans: projectData.futurePlans || [],
			isFeatured: projectData.isFeatured ?? false,
			isPublished: projectData.isPublished ?? true,
			images: images?.length
				? {
						create: images.map((img) => ({
							imageUrl: img.imageUrl,
							caption: img.caption,
						})),
					}
				: undefined,
		},
		include: {
			images: true,
		},
	});
};

export const updateProject = async (
	id: string,
	payload: IUpdateProjectPayload,
) => {
	const { images, ...projectData } = payload;

	const existingProject = await prisma.project.findFirst({
		where: { id, isDeleted: false },
	});

	if (!existingProject) {
		throw new AppError(httpStatus.NOT_FOUND, "Project not found");
	}

	if (projectData.name && !projectData.slug) {
		const candidateSlug = generateSlug(projectData.name);
		if (candidateSlug !== existingProject.slug) {
			const slugConflict = await prisma.project.findUnique({
				where: { slug: candidateSlug },
			});
			projectData.slug = slugConflict
				? `${candidateSlug}-${Date.now()}`
				: candidateSlug;
		}
	}

	return await prisma.$transaction(async (tx) => {
		if (images !== undefined) {
			await tx.projectImage.deleteMany({
				where: { projectId: id },
			});

			if (images.length > 0) {
				await tx.projectImage.createMany({
					data: images.map((img) => ({
						projectId: id,
						imageUrl: img.imageUrl,
						caption: img.caption,
					})),
				});
			}
		}

		return await tx.project.update({
			where: { id },
			data: projectData,
			include: {
				images: true,
			},
		});
	});
};

export const softDeleteProject = async (id: string) => {
	const existingProject = await prisma.project.findFirst({
		where: { id, isDeleted: false },
	});

	if (!existingProject) {
		throw new AppError(httpStatus.NOT_FOUND, "Project not found");
	}

	return await prisma.project.update({
		where: { id },
		data: { isDeleted: true },
	});
};

export const toggleProjectPublish = async (id: string) => {
	const existingProject = await prisma.project.findFirst({
		where: { id, isDeleted: false },
	});

	if (!existingProject) {
		throw new AppError(httpStatus.NOT_FOUND, "Project not found");
	}

	return await prisma.project.update({
		where: { id },
		data: {
			isPublished: !existingProject.isPublished,
		},
	});
};

export const toggleProjectFeatured = async (id: string) => {
	const existingProject = await prisma.project.findFirst({
		where: { id, isDeleted: false },
	});

	if (!existingProject) {
		throw new AppError(httpStatus.NOT_FOUND, "Project not found");
	}

	return await prisma.project.update({
		where: { id },
		data: {
			isFeatured: !existingProject.isFeatured,
		},
	});
};

export const ProjectServices = {
	getFeaturedProjects,
	getAllPublishedProjects,
	getProjectBySlug,
	getAllAdminProjects,
	getAdminProjectById,
	updateProject,
	createProject,
	softDeleteProject,
	toggleProjectPublish,
	toggleProjectFeatured,
};
