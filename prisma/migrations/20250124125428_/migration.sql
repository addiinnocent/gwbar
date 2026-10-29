-- CreateTable
CREATE TABLE "gw1_professions" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "abbr_de" TEXT NOT NULL,
    "abbr_en" TEXT NOT NULL,
    "desc_de" TEXT NOT NULL,
    "desc_en" TEXT NOT NULL,
    "armor" INTEGER NOT NULL DEFAULT 0,
    "bonus_de" TEXT NOT NULL,
    "bonus_en" TEXT NOT NULL,
    "chest_de" TEXT NOT NULL,
    "chest_en" TEXT NOT NULL,
    "hand_de" TEXT NOT NULL,
    "hand_en" TEXT NOT NULL,
    "leg_de" TEXT NOT NULL,
    "leg_en" TEXT NOT NULL,
    "foot_de" TEXT NOT NULL,
    "foot_en" TEXT NOT NULL,

    CONSTRAINT "gw1_professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gw1_attributes" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "desc_de" TEXT NOT NULL,
    "desc_en" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "primary" INTEGER NOT NULL DEFAULT 0,
    "max" INTEGER NOT NULL DEFAULT 21,
    "profession" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gw1_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gw1_skilldesc" (
    "id" SERIAL NOT NULL,
    "pve_name" TEXT NOT NULL,
    "pve_desc" TEXT NOT NULL,
    "pve_concise" TEXT NOT NULL,
    "pvp_name" TEXT NOT NULL,
    "pvp_desc" TEXT NOT NULL,
    "pvp_concise" TEXT NOT NULL,
    "attribute" INTEGER,
    "elite" INTEGER,

    CONSTRAINT "gw1_skilldesc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gw1_skilldata" (
    "id" SMALLSERIAL NOT NULL,
    "campaign" SMALLINT NOT NULL DEFAULT 0,
    "profession" SMALLINT NOT NULL DEFAULT 0,
    "attribute" SMALLINT NOT NULL DEFAULT 0,
    "elite" SMALLINT NOT NULL DEFAULT 0,
    "rp" SMALLINT NOT NULL DEFAULT 0,
    "player" SMALLINT NOT NULL DEFAULT 0,
    "split" SMALLINT NOT NULL DEFAULT 0,
    "pve_type" SMALLINT NOT NULL DEFAULT 0,
    "pve_upkeep" SMALLINT NOT NULL DEFAULT 0,
    "pve_energy" SMALLINT NOT NULL DEFAULT 0,
    "pve_activation" DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    "pve_recharge" SMALLINT NOT NULL DEFAULT 0,
    "pve_adrenaline" SMALLINT NOT NULL DEFAULT 0,
    "pve_sacrifice" SMALLINT NOT NULL DEFAULT 0,
    "pve_overcast" SMALLINT NOT NULL DEFAULT 0,
    "pvp_type" SMALLINT NOT NULL DEFAULT 0,
    "pvp_upkeep" SMALLINT NOT NULL DEFAULT 0,
    "pvp_energy" SMALLINT NOT NULL DEFAULT 0,
    "pvp_activation" DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    "pvp_recharge" SMALLINT NOT NULL DEFAULT 0,
    "pvp_adrenaline" SMALLINT NOT NULL DEFAULT 0,
    "pvp_sacrifice" SMALLINT NOT NULL DEFAULT 0,
    "pvp_overcast" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "gw1_skilldata_pkey" PRIMARY KEY ("id")
);
