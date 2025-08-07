CREATE DATABASE auth_service;
CREATE DATABASE users_service;

CREATE USER auth_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE auth_service TO auth_user;
\connect auth_service;
GRANT ALL ON SCHEMA public TO auth_user;

CREATE USER users_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE users_service TO users_user;
\connect users_service;
GRANT ALL ON SCHEMA public TO users_user;