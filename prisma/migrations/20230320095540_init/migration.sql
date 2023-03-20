-- CreateTable
CREATE TABLE `crawler_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `stringValue` VARCHAR(1000) NOT NULL DEFAULT '',
    `numberValue` INTEGER NOT NULL DEFAULT 0,
    `isMulti` BOOLEAN NOT NULL DEFAULT true,
    `instanceId` VARCHAR(191) NULL,
    `lastPing` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `crawler_configs_key_idx`(`key`),
    INDEX `crawler_configs_key_instanceId_idx`(`key`, `instanceId`),
    UNIQUE INDEX `crawler_configs_key_order_key`(`key`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(100) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `total_repaid` DOUBLE NOT NULL DEFAULT 0,
    `number_loan_repaid` DOUBLE NOT NULL DEFAULT 0,
    `current_outstanding` DOUBLE NOT NULL DEFAULT 0,
    `proxy_status` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `asset_name` VARCHAR(255) NULL,
    `development_stage` VARCHAR(255) NULL,
    `category` VARCHAR(255) NULL,
    `owner_profile_id` INTEGER NULL,

    UNIQUE INDEX `asset_profiles_owner_profile_id_key`(`owner_profile_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `owner_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NULL,
    `last_name` VARCHAR(30) NULL,
    `owner_name` VARCHAR(128) NULL,
    `ownership_type` INTEGER NULL,
    `website` VARCHAR(255) NULL,
    `relationship` VARCHAR(255) NULL,
    `summary` VARCHAR(1000) NULL,
    `businessSector` VARCHAR(255) NULL,
    `incorporated` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_profiles` ADD CONSTRAINT `asset_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_profiles` ADD CONSTRAINT `asset_profiles_owner_profile_id_fkey` FOREIGN KEY (`owner_profile_id`) REFERENCES `owner_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
