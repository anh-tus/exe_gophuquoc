CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "displayName" VARCHAR(80),
    "preferredLocale" VARCHAR(2) NOT NULL DEFAULT 'vi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalIdentity" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "subject" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExternalIdentity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExternalIdentity_provider_subject_key" ON "ExternalIdentity"("provider", "subject");
CREATE INDEX "ExternalIdentity_customerId_idx" ON "ExternalIdentity"("customerId");
ALTER TABLE "ExternalIdentity" ADD CONSTRAINT "ExternalIdentity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
