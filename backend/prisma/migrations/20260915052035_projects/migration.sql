/*
  Warnings:

  - Made the column `githubClient` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `githubServer` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `liveUrl` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "githubClient" SET NOT NULL,
ALTER COLUMN "githubServer" SET NOT NULL,
ALTER COLUMN "liveUrl" SET NOT NULL;
