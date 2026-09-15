/*
  Warnings:

  - You are about to drop the column `twitter` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "twitter",
ADD COLUMN     "aaboutMe" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "leetcode" TEXT;
