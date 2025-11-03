CREATE TABLE "user_collection_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"trashbin_id" text NOT NULL,
	"no" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_collection_assignments" ADD CONSTRAINT "user_collection_assignments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_collection_assignments" ADD CONSTRAINT "user_collection_assignments_trashbin_id_trashbin_id_fk" FOREIGN KEY ("trashbin_id") REFERENCES "public"."trashbin"("id") ON DELETE no action ON UPDATE no action;