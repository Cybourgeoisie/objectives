CREATE TABLE "user" (
	"user_id" BIGSERIAL PRIMARY KEY,
	"name" VARCHAR(128) NOT NULL,
	"original_name" VARCHAR(128) NOT NULL,
	"password" VARCHAR(128) NOT NULL,
	"session" VARCHAR(128),
	"email" VARCHAR(256) UNIQUE,
	"created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	"status" BOOLEAN NOT NULL DEFAULT true,
	CONSTRAINT user_name_status_unique_key UNIQUE (name, status)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO objectives_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO objectives_user;
