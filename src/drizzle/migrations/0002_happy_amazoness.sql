DROP INDEX "matches_unique";--> statement-breakpoint
CREATE INDEX "idx_matches_property_pair" ON "matches" USING btree (LEAST("property1_id", "property2_id"),GREATEST("property1_id", "property2_id"));--> statement-breakpoint
CREATE UNIQUE INDEX "matches_unique" ON "matches" USING btree (LEAST("user1_id", "user2_id"),GREATEST("user1_id", "user2_id"));