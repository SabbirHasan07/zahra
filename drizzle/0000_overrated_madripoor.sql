CREATE TABLE "masjids" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"district" varchar(50) NOT NULL,
	"fajr" varchar(5),
	"dhuhr" varchar(5),
	"asr" varchar(5),
	"maghrib" varchar(5),
	"isha" varchar(5),
	"jummah" varchar(5),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
