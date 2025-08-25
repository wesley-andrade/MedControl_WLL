-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequencyHours" INTEGER NOT NULL,
    "fixedSchedules" TEXT,
    "dateStart" DATETIME NOT NULL,
    "dateEnd" DATETIME,
    "observations" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Medicine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dosage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medicineId" INTEGER NOT NULL,
    "expectedTimeDate" DATETIME NOT NULL,
    "takenAt" DATETIME,
    "status" TEXT NOT NULL,
    "lateMinutes" INTEGER,
    CONSTRAINT "Dosage_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_userId_name_key" ON "Medicine"("userId", "name");
