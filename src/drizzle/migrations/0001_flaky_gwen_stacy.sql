ALTER TABLE "consentRecord" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "consentRecord" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "consentRecord" ADD CONSTRAINT "consentRecord_id_unique" UNIQUE("id");