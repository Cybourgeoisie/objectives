CREATE TABLE task_type (
	"task_type_id" BIGSERIAL PRIMARY KEY,
	"name" TEXT UNIQUE NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO objectives_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO objectives_user;

INSERT INTO task_type (name) VALUES ('task'), ('goal'), ('mission');
