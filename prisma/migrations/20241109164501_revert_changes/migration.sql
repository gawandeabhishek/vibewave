/*
  Warnings:

  - You are about to drop the column `referencedPlaylistId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `userCreatedPlaylistId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `userCreatedPlaylistId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the `ReferencedPlaylist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCreatedPlaylist` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[playlistId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistId` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userCreatedPlaylistId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "fk_referenced_playlist_id";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "fk_user_created_playlist_id";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_userCreatedPlaylistId_fkey";

-- DropForeignKey
ALTER TABLE "UserCreatedPlaylist" DROP CONSTRAINT "UserCreatedPlaylist_userId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "referencedPlaylistId",
DROP COLUMN "userCreatedPlaylistId",
ADD COLUMN     "artist" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "playlistId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" UUID,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "userCreatedPlaylistId";

-- DropTable
DROP TABLE "ReferencedPlaylist";

-- DropTable
DROP TABLE "UserCreatedPlaylist";

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlistId_key" ON "Playlist"("playlistId");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
