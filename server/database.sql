CREATE DATABASE challengealkemy;

--set extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--create tables
CREATE TABLE users(
user_id UUID DEFAULT uuid_generate_v4(),
user_name VARCHAR(255) NOT NULL,
user_email VARCHAR(255) NOT NULL UNIQUE,
user_password VARCHAR(255) NOT NULL,
PRIMARY KEY(user_id));

CREATE TABLE category(
category_id SERIAL,
category_name VARCHAR(255) NOT NULL,
PRIMARY KEY(category_id)
);

CREATE TABLE vouchers(
    voucher_id SERIAL,
    user_id UUID,
    category_id INT, 
    voucher_name VARCHAR(255) NOT NULL,
    voucher_type VARCHAR(255) NOT NULL,
    voucher_value INTEGER NOT NULL,
    voucher_date DATE,
    PRIMARY KEY(voucher_id),
    FOREIGN KEY(category_id) REFERENCES category(category_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

--inserting examples
INSERT INTO users (user_name, user_email,user_password) VALUES ('nhoga','n9746ab@gmail.com','asd123');

INSERT INTO category (category_name) VALUES ('food');

INSERT INTO vouchers(user_id,category_id,voucher_name,voucher_type,voucher_value,voucher_date) VALUES('dcc083b8-eab6-4543-96ef-a94be3f4d185','2','2week','liability','300','2022/03/22');
