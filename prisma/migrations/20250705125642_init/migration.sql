-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED');

-- CreateTable
CREATE TABLE "Tracking" (
    "id" SERIAL NOT NULL,
    "trackingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "origin" TEXT,
    "destination" TEXT,
    "currentLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "estimatedDelivery" TIMESTAMP(3),

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_trackingId_key" ON "Tracking"("trackingId");
