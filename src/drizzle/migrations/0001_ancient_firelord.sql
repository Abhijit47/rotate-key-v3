CREATE TYPE "public"."room_type" AS ENUM('apartment', 'house', 'villa', 'penthouse', 'studio', 'cottage', 'townhouse', 'duplex/triplex', 'shared apartment', 'co-living space', 'guest house', 'office space', 'retail space', 'warehouse/industrial space', 'hotel/resort', 'raw land', 'construction-ready land', 'multi-family home', 'gated community property');--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "roomType" "room_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."type";