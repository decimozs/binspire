CREATE TABLE "maintenance" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"is_in_maintenance" boolean NOT NULL,
	"message" text NOT NULL,
	"description" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"no" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;