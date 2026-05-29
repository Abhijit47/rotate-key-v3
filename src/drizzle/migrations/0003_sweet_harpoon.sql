CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'declined', 'completed');--> statement-breakpoint
CREATE TABLE "matches-test-env" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" uuid NOT NULL,
	"user2_id" uuid NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"channel_id" varchar,
	"channel_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matches-test-env_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "swaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" uuid NOT NULL,
	"user2_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"property1_id" uuid NOT NULL,
	"property2_id" uuid NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "swaps_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "matches-test-env" ADD CONSTRAINT "matches-test-env_user1_id_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches-test-env" ADD CONSTRAINT "matches-test-env_user2_id_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_user1_id_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_user2_id_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_property1_id_property_id_fk" FOREIGN KEY ("property1_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_property2_id_property_id_fk" FOREIGN KEY ("property2_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "matches_test_unique" ON "matches-test-env" USING btree (LEAST("user1_id", "user2_id"),GREATEST("user1_id", "user2_id"));--> statement-breakpoint
CREATE INDEX "idx_matches_test_user1" ON "matches-test-env" USING btree ("user1_id");--> statement-breakpoint
CREATE INDEX "idx_matches_test_user2" ON "matches-test-env" USING btree ("user2_id");--> statement-breakpoint
CREATE INDEX "idx_matches_test_created_at" ON "matches-test-env" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_swaps_property1" ON "swaps" USING btree ("property1_id");--> statement-breakpoint
CREATE INDEX "idx_swaps_property2" ON "swaps" USING btree ("property2_id");--> statement-breakpoint
CREATE INDEX "idx_swaps_user1" ON "swaps" USING btree ("user1_id");--> statement-breakpoint
CREATE INDEX "idx_swaps_user2" ON "swaps" USING btree ("user2_id");--> statement-breakpoint
CREATE INDEX "idx_swaps_match" ON "swaps" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "idx_swaps_status" ON "swaps" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_swap_pure" ON "swaps" USING btree ("user1_id","user2_id","property1_id","property2_id","match_id");