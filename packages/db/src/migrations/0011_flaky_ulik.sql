CREATE TABLE "qr_code" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"no" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
