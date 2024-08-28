/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Stocks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stocks_code_key" ON "Stocks"("code");
