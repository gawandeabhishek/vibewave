/*
  Warnings:

  - You are about to drop the column `artist` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Playlist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropIndex
DROP INDEX "Playlist_playlistId_key";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "artist",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "language",
DROP COLUMN "link",
DROP COLUMN "playlistId",
DROP COLUMN "title",
DROP COLUMN "userId",
DROP COLUMN "year",
ADD COLUMN     "referencedPlaylistId" UUID,
ADD COLUMN     "userCreatedPlaylistId" UUID;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "userCreatedPlaylistId" UUID;

-- CreateTable
CREATE TABLE "UserCreatedPlaylist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCreatedPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferencedPlaylist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "playlistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferencedPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferencedPlaylist_playlistId_key" ON "ReferencedPlaylist"("playlistId");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "fk_user_created_playlist_id" FOREIGN KEY ("userCreatedPlaylistId") REFERENCES "UserCreatedPlaylist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "fk_referenced_playlist_id" FOREIGN KEY ("referencedPlaylistId") REFERENCES "ReferencedPlaylist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userCreatedPlaylistId_fkey" FOREIGN KEY ("userCreatedPlaylistId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCreatedPlaylist" ADD CONSTRAINT "UserCreatedPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userCreatedPlaylistId_fkey" FOREIGN KEY ("userCreatedPlaylistId") REFERENCES "UserCreatedPlaylist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
