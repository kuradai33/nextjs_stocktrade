/*
  Warnings:

  - You are about to drop the `Signal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stockprice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Signal";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Stockprice";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Stocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Stockprices" (
    "stock_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "volume" INTEGER NOT NULL,

    PRIMARY KEY ("stock_id", "date")
);

-- CreateTable
CREATE TABLE "SignalSmashday" (
    "stock_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "smashday_buy" BOOLEAN NOT NULL,
    "smashday_sell" BOOLEAN NOT NULL,

    PRIMARY KEY ("stock_id", "date")
);
