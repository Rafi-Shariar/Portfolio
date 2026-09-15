/*
  Warnings:

  - You are about to drop the column `images` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `projects` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "projects_isPublished_isFeatured_idx";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "images",
DROP COLUMN "order",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "walkthroughVideoUrl" TEXT;

-- CreateTable
CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_images_projectId_idx" ON "project_images"("projectId");

-- CreateIndex
CREATE INDEX "projects_isPublished_isFeatured_isDeleted_idx" ON "projects"("isPublished", "isFeatured", "isDeleted");

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
