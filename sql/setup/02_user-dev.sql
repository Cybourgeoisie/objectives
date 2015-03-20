CREATE USER objectives_user WITH PASSWORD 'objpass';

GRANT ALL PRIVILEGES ON DATABASE objectives TO objectives_user;
GRANT SELECT ON ALL TABLES IN SCHEMA PUBLIC TO objectives_user;
