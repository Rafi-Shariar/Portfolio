-- AlterTable
ALTER TABLE "profile" RENAME COLUMN "aaboutMe" TO "aboutMe";
ALTER TABLE "profile" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "profile" ALTER COLUMN "headline" SET DEFAULT '';
ALTER TABLE "profile" ALTER COLUMN "bio" SET DEFAULT '';
ALTER TABLE "profile" ALTER COLUMN "email" SET DEFAULT '';
