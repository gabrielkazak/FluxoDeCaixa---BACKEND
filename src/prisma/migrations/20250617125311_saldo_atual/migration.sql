/*
  Warnings:

  - You are about to drop the column `saldo` on the `FluxoCaixa` table. All the data in the column will be lost.
  - Added the required column `formaPagamento` to the `FluxoCaixa` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('Pix', 'Dinheiro', 'Cartao');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ClassificacaoMovimentacao" ADD VALUE 'PrestacaoServico';
ALTER TYPE "ClassificacaoMovimentacao" ADD VALUE 'GastoFixo';

-- AlterTable
ALTER TABLE "FluxoCaixa" DROP COLUMN "saldo",
ADD COLUMN     "formaPagamento" "FormaPagamento" NOT NULL;

-- CreateTable
CREATE TABLE "SaldoAtual" (
    "id" SERIAL NOT NULL,
    "saldoConta" DECIMAL(10,2) NOT NULL,
    "saldoCaixa" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "SaldoAtual_pkey" PRIMARY KEY ("id")
);
