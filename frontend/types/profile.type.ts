export interface IUpdateProfile {
  name: string;
  headline: string;
  bio: string;
  aboutMe: string;
  resumeUrl: string;
  avatarUrl: string | null;
  email: string;
  phone: string;
  location: string;
  github: string | null;
  linkedin: string | null;
  facebook: string | null;
  codeforces: string | null;
  leetcode: string | null;
}