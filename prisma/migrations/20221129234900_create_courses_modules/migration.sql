/*
  Warnings:

  - A unique constraint covering the columns `[fk_id_teacher]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - The required column `fk_id_teacher` was added to the `courses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `courses` ADD COLUMN `fk_id_teacher` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `teachers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses_modules` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_id_course` VARCHAR(191) NOT NULL,
    `fk_id_module` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `courses_fk_id_teacher_key` ON `courses`(`fk_id_teacher`);

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_fk_id_teacher_fkey` FOREIGN KEY (`fk_id_teacher`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses_modules` ADD CONSTRAINT `courses_modules_fk_id_course_fkey` FOREIGN KEY (`fk_id_course`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses_modules` ADD CONSTRAINT `courses_modules_fk_id_module_fkey` FOREIGN KEY (`fk_id_module`) REFERENCES `modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
