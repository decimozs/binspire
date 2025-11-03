CREATE TABLE "user_green_hearts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"total_kg" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"no" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_quota" ALTER COLUMN "used" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user_green_hearts" ADD CONSTRAINT "user_green_hearts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;