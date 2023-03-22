/*
  Warnings:

  - You are about to drop the column `category` on the `asset_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `development_stage` on the `asset_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stage_id]` on the table `asset_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_id]` on the table `asset_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sector_id]` on the table `asset_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `asset_profiles` DROP COLUMN `category`,
    DROP COLUMN `development_stage`,
    ADD COLUMN `category_id` INTEGER NULL,
    ADD COLUMN `sector_id` INTEGER NULL,
    ADD COLUMN `stage_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `stage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `asset_profiles_stage_id_key` ON `asset_profiles`(`stage_id`);

-- CreateIndex
CREATE UNIQUE INDEX `asset_profiles_category_id_key` ON `asset_profiles`(`category_id`);

-- CreateIndex
CREATE UNIQUE INDEX `asset_profiles_sector_id_key` ON `asset_profiles`(`sector_id`);

-- AddForeignKey
ALTER TABLE `asset_profiles` ADD CONSTRAINT `asset_profiles_stage_id_fkey` FOREIGN KEY (`stage_id`) REFERENCES `stage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_profiles` ADD CONSTRAINT `asset_profiles_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_profiles` ADD CONSTRAINT `asset_profiles_sector_id_fkey` FOREIGN KEY (`sector_id`) REFERENCES `sector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
