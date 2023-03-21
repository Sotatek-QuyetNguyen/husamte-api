/*
  Warnings:

  - Added the required column `asset_id` to the `owner_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `owner_profiles` ADD COLUMN `asset_id` INTEGER NOT NULL;
