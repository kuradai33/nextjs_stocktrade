/*
  Warnings:

  - The primary key for the `Stockprices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `date_num` to the `Stockprices` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stockprices" (
    "stock_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "date_num" INTEGER NOT NULL,
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
