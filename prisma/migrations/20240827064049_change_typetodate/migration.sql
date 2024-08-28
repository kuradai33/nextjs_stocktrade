/*
  Warnings:

  - The primary key for the `SignalSmashday` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `date` on the `SignalSmashday` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - The primary key for the `Stockprices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `date` on the `Stockprices` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SignalSmashday" (
    "stock_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "smashday_buy" BOOLEAN NOT NULL,
    "smashday_sell" BOOLEAN NOT NULL,

    PRIMARY KEY ("stock_id", "date")
);
INSERT INTO "new_SignalSmashday" ("date", "smashday_buy", "smashday_sell", "stock_id") SELECT "date", "smashday_buy", "smashday_sell", "stock_id" FROM "SignalSmashday";
DROP TABLE "SignalSmashday";
ALTER TABLE "new_SignalSmashday" RENAME TO "SignalSmashday";
CREATE TABLE "new_Stockprices" (
    "stock_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "volume" INTEGER NOT NULL,

    PRIMARY KEY ("stock_id", "date")
);
INSERT INTO "new_Stockprices" ("close", "date", "high", "low", "open", "stock_id", "volume") SELECT "close", "date", "high", "low", "open", "stock_id", "volume" FROM "Stockprices";
DROP TABLE "Stockprices";
ALTER TABLE "new_Stockprices" RENAME TO "Stockprices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
