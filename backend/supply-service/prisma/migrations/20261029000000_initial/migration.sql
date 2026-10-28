-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "supply";

-- CreateEnum
CREATE TYPE "supply"."ServiceCategory" AS ENUM ('STAY', 'TOUR', 'TRANSPORT', 'SPA', 'LAUNDRY');

-- CreateEnum
CREATE TYPE "supply"."ListingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "supply"."HoldStatus" AS ENUM ('ACTIVE', 'CONFIRMED', 'RELEASED', 'EXPIRED');

-- CreateTable
CREATE TABLE "supply"."Listing" (
    "id" TEXT NOT NULL,
    "category" "supply"."ServiceCategory" NOT NULL,
    "status" "supply"."ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionVi" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "area" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "partnerRef" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply"."Offering" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "unitPriceVnd" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "minGuests" INTEGER NOT NULL DEFAULT 1,
    "maxGuests" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "cancellation" TEXT NOT NULL DEFAULT 'FLEXIBLE',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply"."InventorySlot" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventorySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply"."InventoryHold" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "bookingId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceVnd" INTEGER NOT NULL,
    "category" "supply"."ServiceCategory" NOT NULL,
    "cancellationPolicy" TEXT NOT NULL,
    "partnerRef" TEXT,
    "status" "supply"."HoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "extendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryHold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Listing_status_category_area_idx" ON "supply"."Listing"("status", "category", "area");

-- CreateIndex
CREATE INDEX "Offering_listingId_active_idx" ON "supply"."Offering"("listingId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "InventorySlot_offeringId_dateTime_key" ON "supply"."InventorySlot"("offeringId", "dateTime");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryHold_idempotencyKey_key" ON "supply"."InventoryHold"("idempotencyKey");

-- CreateIndex
CREATE INDEX "InventoryHold_slotId_status_expiresAt_idx" ON "supply"."InventoryHold"("slotId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "InventoryHold_bookingId_idx" ON "supply"."InventoryHold"("bookingId");

-- AddForeignKey
ALTER TABLE "supply"."Offering" ADD CONSTRAINT "Offering_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "supply"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply"."InventorySlot" ADD CONSTRAINT "InventorySlot_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "supply"."Offering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply"."InventoryHold" ADD CONSTRAINT "InventoryHold_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "supply"."InventorySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

