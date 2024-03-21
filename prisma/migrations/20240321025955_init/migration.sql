-- CreateTable
CREATE TABLE "TeeTime" (
    "id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "open_spots" INTEGER NOT NULL,
    "green_fee" INTEGER NOT NULL,
    "out_of_capacity" BOOLEAN NOT NULL,

    CONSTRAINT "TeeTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenFee" (
    "id" INTEGER NOT NULL,
    "green_fee" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "teetime_id" INTEGER NOT NULL,
    "affiliation_type_id" INTEGER NOT NULL,

    CONSTRAINT "GreenFee_pkey" PRIMARY KEY ("id")
);
