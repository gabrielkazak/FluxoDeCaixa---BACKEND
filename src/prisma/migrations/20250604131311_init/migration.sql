-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('Entrada', 'Saida');

-- CreateEnum
CREATE TYPE "ClassificacaoMovimentacao" AS ENUM ('Venda', 'Compra', 'Investimento');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FluxoCaixa" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "classificacao" "ClassificacaoMovimentacao" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "FluxoCaixa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "FluxoCaixa" ADD CONSTRAINT "FluxoCaixa_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
