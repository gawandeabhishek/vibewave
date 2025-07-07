-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_userId_fkey";

-- CreateTable
CREATE TABLE "_UserLikedSongs" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikedSongs_AB_unique" ON "_UserLikedSongs"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikedSongs_B_index" ON "_UserLikedSongs"("B");

-- AddForeignKey
ALTER TABLE "_UserLikedSongs" ADD CONSTRAINT "_UserLikedSongs_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikedSongs" ADD CONSTRAINT "_UserLikedSongs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
