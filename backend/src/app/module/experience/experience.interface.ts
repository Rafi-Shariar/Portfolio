export interface ICreateExperiencePayload {
	company: string;
	role: string;
	location?: string | null;
	startDate: string;
	endDate?: string | null;
	isCurrent?: boolean;
	description: string;
	technologies?: string[];
	order?: number;
}

export interface IUpdateExperiencePayload
	extends Partial<ICreateExperiencePayload> {}
