/*
  Warnings:

  - Added the required column `data` to the `SaldoAtual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaldoAtual" ADD COLUMN     "data" TIMESTAMP(3) NOT NULL;
