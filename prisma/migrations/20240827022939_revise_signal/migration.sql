/*
  Warnings:

  - The primary key for the `Signal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Signal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signal" (
    "id_stockprice" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "smashday" BOOLEAN NOT NULL
);
INSERT INTO "new_Signal" ("id_stockprice", "smashday") SELECT "id_stockprice", "smashday" FROM "Signal";
DROP TABLE "Signal";
ALTER TABLE "new_Signal" RENAME TO "Signal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
