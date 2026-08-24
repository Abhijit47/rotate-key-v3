ALTER TABLE "propertyFavorite" DROP CONSTRAINT "propertyFavorite_property_id_property_id_fk";
--> statement-breakpoint
ALTER TABLE "propertyFavorite" DROP CONSTRAINT "propertyFavorite_favorite_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "propertyHold" DROP CONSTRAINT "propertyHold_property_id_property_id_fk";
--> statement-breakpoint
ALTER TABLE "propertyHold" DROP CONSTRAINT "propertyHold_hold_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "propertyStats" DROP CONSTRAINT "propertyStats_property_id_property_id_fk";
--> statement-breakpoint
ALTER TABLE "propertyFavorite" ADD CONSTRAINT "propertyFavorite_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyFavorite" ADD CONSTRAINT "propertyFavorite_favorite_by_user_id_fk" FOREIGN KEY ("favorite_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyHold" ADD CONSTRAINT "propertyHold_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyHold" ADD CONSTRAINT "propertyHold_hold_by_user_id_fk" FOREIGN KEY ("hold_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyStats" ADD CONSTRAINT "propertyStats_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propertyStats" ADD CONSTRAINT "propertyStats_property_id_unique" UNIQUE("property_id");