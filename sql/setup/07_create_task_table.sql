CREATE TABLE task (
	"task_id" BIGSERIAL PRIMARY KEY,
	"task_type_id" INTEGER NOT NULL,
	"objective_id" INTEGER,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"user_id" INTEGER,
	"parent_id" INTEGER,
	"order" INTEGER NOT NULL DEFAULT 0,
	"privacy" INTEGER NOT NULL DEFAULT 0,
	"start" TIMESTAMP WITH TIME ZONE,
	"end" TIMESTAMP WITH TIME ZONE,
	"created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	"completed" TIMESTAMP WITH TIME ZONE,
	"deleted" TIMESTAMP WITH TIME ZONE,
	"status" BOOLEAN NOT NULL DEFAULT true,
	CONSTRAINT task_user_fkey FOREIGN KEY (user_id)
		REFERENCES "user" (user_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT task_objective_fkey FOREIGN KEY (objective_id)
		REFERENCES objective (objective_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT task_parent_fkey FOREIGN KEY (parent_id)
		REFERENCES task (task_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT task_task_type_fkey FOREIGN KEY (task_type_id)
		REFERENCES task_type (task_type_id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO objectives_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO objectives_user;
