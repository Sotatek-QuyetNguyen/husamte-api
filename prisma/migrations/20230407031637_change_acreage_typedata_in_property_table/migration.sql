/*
  Warnings:

  - You are about to alter the column `acreage` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `properties` MODIFY `acreage` VARCHAR(100) NULL;
