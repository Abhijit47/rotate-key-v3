CREATE TYPE "public"."hold_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "propertyFavorite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"favorite_by" uuid NOT NULL,
	"favorite_at" timestamp NOT NULL,
	CONSTRAINT "propertyFavorite_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "propertyHold" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"hold_by" uuid NOT NULL,
	"holdStatus" "hold_status",
	"is_active_hold" boolean DEFAULT true NOT NULL,
	"hold_date" timestamp,
	"expired_at" timestamp,
	CONSTRAINT "propertyHold_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "propertyStats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"favorites" integer DEFAULT 0 NOT NULL,
	"holds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "propertyStats_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "propertyFavorite" ADD CONSTRAINT "propertyFavorite_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyFavorite" ADD CONSTRAINT "propertyFavorite_favorite_by_user_id_fk" FOREIGN KEY ("favorite_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyHold" ADD CONSTRAINT "propertyHold_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyHold" ADD CONSTRAINT "propertyHold_hold_by_user_id_fk" FOREIGN KEY ("hold_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyStats" ADD CONSTRAINT "propertyStats_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;