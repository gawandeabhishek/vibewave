/*
  Warnings:

  - A unique constraint covering the columns `[currentSongId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentSongId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_currentSongId_key" ON "User"("currentSongId");
