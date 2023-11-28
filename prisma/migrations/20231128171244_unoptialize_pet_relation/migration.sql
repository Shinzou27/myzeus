/*
  Warnings:

  - Made the column `petId` on table `reports` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "cost" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "petId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reports_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reports" ("amount", "brand", "cost", "created_at", "date", "id", "petId", "updated_at", "userId") SELECT "amount", "brand", "cost", "created_at", "date", "id", "petId", "updated_at", "userId" FROM "reports";
DROP TABLE "reports";
ALTER TABLE "new_reports" RENAME TO "reports";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
