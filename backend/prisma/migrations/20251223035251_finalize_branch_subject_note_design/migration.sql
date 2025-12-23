/*
  Warnings:

  - You are about to drop the column `branch` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `branch` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,semester]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subject_name_key";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "branch";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "branch";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "semester" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BranchToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchToNote_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE INDEX "_BranchToSubject_B_index" ON "_BranchToSubject"("B");

-- CreateIndex
CREATE INDEX "_BranchToNote_B_index" ON "_BranchToNote"("B");

-- CreateIndex
CREATE INDEX "Note_semester_idx" ON "Note"("semester");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_semester_key" ON "Subject"("name", "semester");

-- CreateIndex
CREATE INDEX "User_branchId_semester_idx" ON "User"("branchId", "semester");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToSubject" ADD CONSTRAINT "_BranchToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToSubject" ADD CONSTRAINT "_BranchToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToNote" ADD CONSTRAINT "_BranchToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToNote" ADD CONSTRAINT "_BranchToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
