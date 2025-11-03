CREATE TABLE "user_quota" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"used" text DEFAULT '0' NOT NULL,
	"no" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_quota" ADD CONSTRAINT "user_quota_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;