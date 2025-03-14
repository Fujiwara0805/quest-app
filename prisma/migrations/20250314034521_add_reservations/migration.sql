-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_paymentIntentId_key" ON "Reservation"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Reservation_questId_idx" ON "Reservation"("questId");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
