ALTER TABLE "user_collection_assignments" DROP CONSTRAINT "user_collection_assignments_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_green_hearts" DROP CONSTRAINT "user_green_hearts_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_quota" DROP CONSTRAINT "user_quota_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_collection_assignments" ADD CONSTRAINT "user_collection_assignments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_green_hearts" ADD CONSTRAINT "user_green_hearts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quota" ADD CONSTRAINT "user_quota_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;