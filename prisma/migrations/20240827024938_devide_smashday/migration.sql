/*
  Warnings:

  - You are about to drop the column `smashday` on the `Signal` table. All the data in the column will be lost.
  - Added the required column `smashday_buy` to the `Signal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smashday_sell` to the `Signal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signal" (
    "id_stockprice" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "smashday_buy" BOOLEAN NOT NULL,
    "smashday_sell" BOOLEAN NOT NULL
);
INSERT INTO "new_Signal" ("id_stockprice") SELECT "id_stockprice" FROM "Signal";
DROP TABLE "Signal";
ALTER TABLE "new_Signal" RENAME TO "Signal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
