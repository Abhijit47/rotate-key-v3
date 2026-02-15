CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text DEFAULT '/api/avatar?name=user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"where_are_you_from" varchar,
	"where_do_you_want_to_go" varchar,
	"is_onboarded" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auditLog" (
	"id" text PRIMARY KEY NOT NULL,
	"entityType" text NOT NULL,
	"entityId" text NOT NULL,
	"actionType" text NOT NULL,
	"subjectId" text,
	"ipAddress" text,
	"userAgent" text,
	"changes" json,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"eventTimezone" text NOT NULL,
	CONSTRAINT "auditLog_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "consent" (
	"id" text PRIMARY KEY NOT NULL,
	"subjectId" text NOT NULL,
	"domainId" text NOT NULL,
	"policyId" text,
	"purposeIds" json NOT NULL,
	"metadata" json,
	"ipAddress" text,
	"userAgent" text,
	"status" text NOT NULL,
	"withdrawalReason" text,
	"givenAt" timestamp DEFAULT now() NOT NULL,
	"validUntil" timestamp,
	"isActive" boolean NOT NULL,
	CONSTRAINT "consent_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "consentPolicy" (
	"id" text PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"effectiveDate" timestamp NOT NULL,
	"expirationDate" timestamp,
	"content" text NOT NULL,
	"contentHash" text NOT NULL,
	"isActive" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "consentPolicy_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "consentPurpose" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"isEssential" boolean NOT NULL,
	"dataCategory" text,
	"legalBasis" text,
	"isActive" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "consentPurpose_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "consentRecord" (
	"id" varchar(255) NOT NULL,
	"subjectId" text NOT NULL,
	"consentId" text,
	"actionType" text NOT NULL,
	"details" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"allowedOrigins" json,
	"isVerified" boolean NOT NULL,
	"isActive" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "domain_id_unique" UNIQUE("id"),
	CONSTRAINT "domain_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "private_c15t_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"version" varchar(255) DEFAULT '1.0.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" text PRIMARY KEY NOT NULL,
	"isIdentified" boolean NOT NULL,
	"externalId" text,
	"identityProvider" text,
	"lastIpAddress" text,
	"subjectTimezone" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subject_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditLog" ADD CONSTRAINT "auditLog_subject_subject_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subject"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "consent" ADD CONSTRAINT "consent_subject_subject_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subject"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "consent" ADD CONSTRAINT "consent_domain_domain_fk" FOREIGN KEY ("domainId") REFERENCES "public"."domain"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "consent" ADD CONSTRAINT "consent_consentPolicy_policy_fk" FOREIGN KEY ("policyId") REFERENCES "public"."consentPolicy"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "consentRecord" ADD CONSTRAINT "consentRecord_subject_subject_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subject"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "consentRecord" ADD CONSTRAINT "consentRecord_consent_consent_fk" FOREIGN KEY ("consentId") REFERENCES "public"."consent"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");