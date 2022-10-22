-- create database npdo;
-- \c npdo

create table users(
    user_id serial primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    email varchar(60) not null unique,
    password varchar(60) not null,
    code numeric(4) unique
);

create table actions(
    action_id serial primary key,
    user_id int references users(user_id) not null,
    card_id int not null,
    starts char(5) not null,
    day numeric(1) not null
);

create table signed(
    email varchar(60) not null unique
);

-- create table custom_cards(
--     card_id serial primary key,
--     user_id int references users(user_id) not null,
--     name varchar(20) not null,
--     description varchar(255) not null,
--     image varchar(255) not null,

-- )