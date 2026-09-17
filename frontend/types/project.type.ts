// ১. প্রজেক্ট ইমেজের ইন্টারফেস (Prisma ProjectImage মডেল অনুযায়ী)
export interface IProjectImage {
  id?: string;
  projectId?: string;
  imageUrl: string;
  caption?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ২. মূল প্রজেক্ট মডেল (ডাটাবেস ও API রেসপন্স)
export interface IProject {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription: string;
  description: string;

  frontendTech: string[];
  backendTech: string[];
  tools: string[];

  githubClient: string;
  githubServer: string;
  liveUrl: string;
  walkthroughVideoUrl?: string | null;

  keyFeatures: string[];
  challengesFaced: string[];
  futurePlans: string[];

  images: IProjectImage[];

  isFeatured: boolean;
  isPublished: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

// ৩. নতুন প্রজেক্ট তৈরি করার পে-লোড
export interface ICreateProject {
  name: string;
  slug?: string;
  type: string;
  shortDescription: string;
  description: string;

  frontendTech: string[];
  backendTech: string[];
  tools: string[];

  githubClient: string;
  githubServer: string;
  liveUrl: string;
  walkthroughVideoUrl?: string | null;

  keyFeatures: string[];
  challengesFaced: string[];
  futurePlans: string[];

  images?: Array<{
    imageUrl: string;
    caption?: string | null;
  }>;

  isFeatured?: boolean;
  isPublished?: boolean;
}

// ৪. প্রজেক্ট আপডেটের পে-লোড
export type IUpdateProject = Partial<ICreateProject>;