CREATE SCHEMA "private_schema";
--> statement-breakpoint
CREATE TABLE "private_schema"."matches-test-env" (
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
DROP TABLE IF EXISTS "public"."matches-test-env" CASCADE;--> statement-breakpoint
ALTER TABLE "private_schema"."matches-test-env" ADD CONSTRAINT "matches-test-env_user1_id_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_schema"."matches-test-env" ADD CONSTRAINT "matches-test-env_user2_id_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "matches_test_unique" ON "private_schema"."matches-test-env" USING btree (LEAST("user1_id", "user2_id"),GREATEST("user1_id", "user2_id"));--> statement-breakpoint
CREATE INDEX "idx_matches_test_user1" ON "private_schema"."matches-test-env" USING btree ("user1_id");--> statement-breakpoint
CREATE INDEX "idx_matches_test_user2" ON "private_schema"."matches-test-env" USING btree ("user2_id");--> statement-breakpoint
CREATE INDEX "idx_matches_test_created_at" ON "private_schema"."matches-test-env" USING btree ("created_at");