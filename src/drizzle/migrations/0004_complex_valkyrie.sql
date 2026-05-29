ALTER TABLE "user" ALTER COLUMN "is_contact_number_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_profile_document_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "property_document" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_property_document_uploaded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_property_document_verified" boolean DEFAULT false NOT NULL;