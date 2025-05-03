/*
  Warnings:

  - You are about to drop the column `reward_card_name` on the `quests` table. All the data in the column will be lost.
  - You are about to drop the column `reward_card_number` on the `quests` table. All the data in the column will be lost.
  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_quest_id_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_user_id_fkey";

-- AlterTable
ALTER TABLE "quests" DROP COLUMN "reward_card_name",
DROP COLUMN "reward_card_number",
ADD COLUMN     "category" TEXT;

-- DropTable
DROP TABLE "cards";
