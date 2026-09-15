export interface IUpdateProfilePayload {
	name?: string;
	headline?: string;
	bio?: string;
	aboutMe?: string;
	avatarUrl?: string | null;
	resumeUrl?: string | null;
	email?: string;
	phone?: string | null;
	location?: string | null;
	github?: string | null;
	linkedin?: string | null;
	facebook?: string | null;
	codeforces?: string | null;
	leetcode?: string | null;
}
