ALTER TABLE "user" ALTER COLUMN "image" SET DEFAULT '/api/avatar?name=user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "where_are_you_from" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "where_do_you_want_to_go" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_onboarded" boolean;