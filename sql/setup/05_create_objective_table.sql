CREATE TABLE objective (
	"objective_id" BIGSERIAL PRIMARY KEY,
	"objective_type_id" INTEGER NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"user_id" INTEGER,
	"parent_id" INTEGER,
	"created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	"status" BOOLEAN NOT NULL DEFAULT true,
	CONSTRAINT objective_name_user_unique_key UNIQUE (name, user_id),
	CONSTRAINT objective_user_fkey FOREIGN KEY (user_id)
		REFERENCES "user" (user_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT objective_parent_fkey FOREIGN KEY (parent_id)
		REFERENCES objective (objective_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT objective_objective_type_fkey FOREIGN KEY (objective_type_id)
		REFERENCES objective_type (objective_type_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO objectives_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO objectives_user;
