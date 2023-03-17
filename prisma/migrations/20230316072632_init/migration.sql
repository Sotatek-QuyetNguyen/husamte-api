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
CREATE TABLE `overviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NULL,
    `string_value` VARCHAR(255) NULL,
    `number_value` DOUBLE NULL DEFAULT 0,
    `unit` VARCHAR(191) NULL,

    UNIQUE INDEX `overviews_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(100) NOT NULL,
    `nft_id` INTEGER NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `total_repaid` DOUBLE NOT NULL DEFAULT 0,
    `number_loan_repaid` DOUBLE NOT NULL DEFAULT 0,
    `current_outstanding` DOUBLE NOT NULL DEFAULT 0,
    `proxy_status` INTEGER NOT NULL DEFAULT 0,
    `earliest_maturty` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_kyc_nfts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nft_id` INTEGER NULL,
    `chain_id` INTEGER NOT NULL,
    `expires_at` BIGINT NOT NULL,
    `uniqueIdentityAddress` VARCHAR(191) NOT NULL,
    `sign` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_kyc_nfts_user_id_chain_id_uniqueIdentityAddress_key`(`user_id`, `chain_id`, `uniqueIdentityAddress`),
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

-- AddForeignKey
ALTER TABLE `user_kyc_nfts` ADD CONSTRAINT `user_kyc_nfts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
