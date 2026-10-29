/*
  Warnings:

  - You are about to drop the column `attribute` on the `gw1_skilldesc` table. All the data in the column will be lost.
  - You are about to drop the column `elite` on the `gw1_skilldesc` table. All the data in the column will be lost.
  - You are about to drop the column `pve` on the `gw1_skilldesc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gw1_skilldesc" DROP COLUMN "attribute",
DROP COLUMN "elite",
DROP COLUMN "pve";
