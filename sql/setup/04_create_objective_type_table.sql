CREATE TABLE objective_type (
	"objective_type_id" BIGSERIAL PRIMARY KEY,
	"name" TEXT UNIQUE NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO objectives_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO objectives_user;

INSERT INTO objective_type (name) VALUES ('objective'), ('challenge'), ('habit');
