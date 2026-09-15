export interface ICreateCertificationPayload {
	title: string;
	issuer: string;
	issueDate: string;
	expiryDate?: string | null;
	credentialUrl?: string | null;
	certificateImage?: string | null;
	order?: number;
}

export interface IUpdateCertificationPayload
	extends Partial<ICreateCertificationPayload> {}
