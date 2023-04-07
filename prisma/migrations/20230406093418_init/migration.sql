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
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    `name` VARCHAR(100) NULL,
    `dateOfBirth` DATE NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `role` INTEGER NOT NULL DEFAULT 0,
    `address` VARCHAR(256) NULL,
    `secretKey` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_time_forgot_password` DATE NULL,

    UNIQUE INDEX `users_email_key`(`email`),
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
CREATE TABLE `properties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NOT NULL,
    `asset_name` VARCHAR(100) NULL,
    `description` VARCHAR(1000) NULL,
    `image` VARCHAR(500) NULL,
    `type` INTEGER NULL,
    `acreage` DOUBLE NULL,
    `bedroom_count` INTEGER NOT NULL DEFAULT 0,
    `bathroom_count` INTEGER NOT NULL DEFAULT 0,
    `parking_slot` INTEGER NOT NULL DEFAULT 0,
    `air_conditioning_type` INTEGER NULL,
    `external` INTEGER NULL,
    `basement` INTEGER NULL,
    `has_kitchen` BOOLEAN NOT NULL DEFAULT false,
    `has_foyer` BOOLEAN NOT NULL DEFAULT false,
    `has_breakfast` BOOLEAN NOT NULL DEFAULT false,
    `has_livingroom` BOOLEAN NOT NULL DEFAULT false,
    `has_diningroom` BOOLEAN NOT NULL DEFAULT false,
    `has_familyroom` BOOLEAN NOT NULL DEFAULT false,
    `has_laundry` BOOLEAN NOT NULL DEFAULT false,
    `extras` VARCHAR(1000) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `primaryContactId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `properties_primaryContactId_key`(`primaryContactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `owner_of_property` (
    `propertyId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `percentage` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`propertyId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `propertyId` INTEGER NOT NULL,
    `length` DOUBLE NULL,
    `width` DOUBLE NULL,
    `feature` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `primary_contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `city` VARCHAR(25) NOT NULL,
    `countryId` INTEGER NOT NULL,
    `stateId` INTEGER NOT NULL,
    `zip_code` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `countryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_primaryContactId_fkey` FOREIGN KEY (`primaryContactId`) REFERENCES `primary_contacts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner_of_property` ADD CONSTRAINT `owner_of_property_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner_of_property` ADD CONSTRAINT `owner_of_property_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `primary_contacts` ADD CONSTRAINT `primary_contacts_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `primary_contacts` ADD CONSTRAINT `primary_contacts_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `states`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `states` ADD CONSTRAINT `states_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
