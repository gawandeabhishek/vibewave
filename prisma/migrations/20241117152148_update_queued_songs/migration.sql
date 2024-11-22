-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "queuedUserId" UUID;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_queuedUserId_fkey" FOREIGN KEY ("queuedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
