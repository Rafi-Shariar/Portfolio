export interface IProjectImagePayload {
	imageUrl: string;
	caption?: string;
}

export interface ICreateProjectPayload {
	name: string;
	slug?: string;
	type: string;
	shortDescription: string;
	description: string;
	frontendTech?: string[];
	backendTech?: string[];
	tools?: string[];
	githubClient: string;
	githubServer: string;
	liveUrl: string;
	walkthroughVideoUrl?: string | null;
	keyFeatures?: string[];
	challengesFaced?: string[];
	futurePlans?: string[];
	images?: IProjectImagePayload[];
	isFeatured?: boolean;
	isPublished?: boolean;
}

export interface IUpdateProjectPayload
	extends Partial<Omit<ICreateProjectPayload, "slug">> {
	slug?: string;
}
