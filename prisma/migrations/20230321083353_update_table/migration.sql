-- AlterTable
ALTER TABLE `asset_profiles` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `valuation` DECIMAL(20, 2) NOT NULL DEFAULT 0;
