ALTER TABLE "maintenance" ALTER COLUMN "is_in_maintenance" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "maintenance" ALTER COLUMN "message" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance" ALTER COLUMN "start_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance" ALTER COLUMN "end_time" DROP NOT NULL;