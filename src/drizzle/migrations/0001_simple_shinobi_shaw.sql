UPDATE "swaps" SET "user1_accepted" = false WHERE "user1_accepted" IS NULL;
UPDATE "swaps" SET "user2_accepted" = false WHERE "user2_accepted" IS NULL;
UPDATE "swaps" SET "status" = 'pending' WHERE "status" IS NULL;

ALTER TABLE "swaps" ALTER COLUMN "user1_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "user2_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "match_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "property1_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "property2_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "user1_accepted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "user2_accepted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "swaps" ALTER COLUMN "status" SET NOT NULL;