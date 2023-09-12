-- SHOW DATABASES;

CREATE DATABASE dvc;

USE dvc;

CREATE USER 'dvcuser'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON dvc.* TO 'dvcuser'@'%';
-- ALTER USER 'dvcuser'@'%' IDENTIFIED WITH mysql_native_password BY '1234';

CREATE TABLE user (
	uid			VARCHAR(128) 	NOT NULL,
    pw			VARCHAR(50)		NULL,
    nickname	VARCHAR(30) 	NOT NULL,
	PRIMARY KEY (uid)
);

CREATE TABLE address (
	uid1		VARCHAR(128)	NOT NULL,
    uid2		VARCHAR(128)	NOT NULL,
    PRIMARY KEY (uid1, uid2),
    FOREIGN KEY (uid1) REFERENCES user(uid),
    FOREIGN KEY (uid2) REFERENCES user(uid)
);

CREATE TABLE room (
	room_id			VARCHAR(128)	NOT NULL,
    uid				VARCHAR(128)	NOT NULL,
    room_title		VARCHAR(30)		NOT NULL,
    inProgress        BOOLEAN        NOT NULL DEFAULT FALSE,
    PRIMARY KEY (room_id),
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE participation (
	room_id			VARCHAR(128)	NOT NULL,
    uid				VARCHAR(128)	NOT NULL,
    PRIMARY KEY (room_id, uid),
    FOREIGN KEY (room_id) REFERENCES room(room_id),
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE room_chat (
	room_chat_id		VARCHAR(128)	NOT NULL,
    room_id				VARCHAR(128)	NOT NULL,
    uid					VARCHAR(128)	NOT NULL,
    message				TEXT			NOT NULL,
    chat_time			TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_chat_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id),
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE user_chat (
	user_chat_id		VARCHAR(128)	NOT NULL,
    uid1				VARCHAR(128)	NOT NULL,
    uid2				VARCHAR(128)	NOT NULL,
    message				TEXT			NOT NULL,
    chat_time			TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_chat_id),
    FOREIGN KEY (uid1) REFERENCES user(uid),
    FOREIGN KEY (uid2) REFERENCES user(uid)
);

CREATE TABLE conference_record (
	record_id		VARCHAR(30)		NOT NULL,
	room_id			VARCHAR(30)		NOT NULL,
	start_time		TIMESTAMP		NOT NULL,
	end_time		DATETIME		NULL,
    PRIMARY KEY (record_id, room_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id)
);

CREATE TABLE conference_chat (
	conference_chat_id		VARCHAR(128)	NOT NULL,
	room_id					VARCHAR(30)		NOT NULL,
	record_id				VARCHAR(30)		NOT NULL,
	uid						VARCHAR(128)	NOT NULL,
	message					TEXT			NOT NULL,
	chat_time				TIMESTAMP		NOT NULL,
    PRIMARY KEY (conference_chat_id, room_id, record_id, uid),
    FOREIGN KEY (record_id, room_id) REFERENCES conference_record(record_id, room_id),
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE conference_archive (
	archive_id			VARCHAR(30)		NOT NULL,
	room_id				VARCHAR(30)		NOT NULL,
	record_id			VARCHAR(30)		NOT NULL,
	file_path			TEXT			NOT NULL,
	conference_time		TIMESTAMP		NOT NULL,
    PRIMARY KEY (archive_id, room_id, record_id),
    FOREIGN KEY (room_id, record_id) REFERENCES conference_record(room_id, record_id)
);

-- SHOW TABLES;