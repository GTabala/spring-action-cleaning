ALTER TABLE if exists customers DROP COLUMN if exists main_branch_id;
drop table if exists jobs;
drop table if exists branches;
drop table if exists workers;
drop table if exists customers;

CREATE TABLE languages (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(20) NOT NULL,
  your_jobs       VARCHAR(40) NOT NULL,
  from            VARCHAR(10) NOT NULL,
  to              VARCHAR(10) NOT NULL,
  address         VARCHAR(20) NOT NULL,
  date            VARCHAR(10) NOT NULL,
  time            VARCHAR(10) NOT NULL,
  contact         VARCHAR(10) NOT NULL,
  plan_duration   VARCHAR(20) NOT NULL,
  job_details     VARCHAR(20) NOT NULL,
  start_time_expl VARCHAR(40) NOT NULL,
  end_time_expl   VARCHAR(40) NOT NULL,
  details         VARCHAR(15) NOT NULL,
  submit          VARCHAR(15) NOT NULL,
  back            VARCHAR(15) NOT NULL
);

CREATE TABLE workers (
  id                    SERIAL PRIMARY KEY,
  name                  VARCHAR(100) NOT NULL,
  address               VARCHAR(200) NOT NULL,
  email                 VARCHAR(60) NOT NULL UNIQUE,
  phone_number          VARCHAR(50) NOT NULL,
  whatsapp              VARCHAR(50) NOT NULL,
  permanent_contract    BOOLEAN NOT NULL,
  language              INT REFERENCES languages(id)
);

CREATE TABLE customers (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(60) NOT NULL,
  phone_number    VARCHAR(50) NOT NULL
);



CREATE TABLE branches (
  id              SERIAL PRIMARY KEY,
  address         VARCHAR(200) NOT NULL,
  contact_name    VARCHAR(100) NOT NULL,
  contact_phone   VARCHAR(50) NOT NULL,
  details         VARCHAR(250),
  customer_id     INT REFERENCES customers(id),
  worker_id       INT REFERENCES workers(id),
  visit_time      TIME,
  duration        INT
);

ALTER TABLE customers ADD COLUMN main_branch_id INT REFERENCES branches(id);

CREATE TABLE jobs (
  id              SERIAL PRIMARY KEY,
  date_created    DATE NOT NULL,
  customer_id     INT REFERENCES customers(id),
  branch_id       INT REFERENCES branches(id),
  worker_id       INT REFERENCES workers(id),
  details         VARCHAR(500),
  visit_on        DATE NOT NULL,
  visit_time      TIME (0) NOT NULL,
  status          INT NOT NULL DEFAULT 0,
  start_time      TIME (0),
  end_time        TIME (0),
  duration        INT,
  pay_rate        FLOAT,
  feedback        VARCHAR(500)
);

insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Kathe Henniger', 'khenniger0@mayoclinic.com', '997-883-3933', '34409 La Follette Pass', '852-452-4383', false);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Codie Bamfield', 'cbamfield1@tumblr.com', '503-704-8699', '4 Continental Lane', '144-207-5560', true);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Marrilee MacCole', 'mmaccole2@rakuten.co.jp', '716-658-6477', '87 John Wall Road', '207-855-1099', false);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Marylou Alltimes', 'malltimes3@mac.com', '673-326-5905', '7245 Beilfuss Road', '479-778-2850', true);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Doralynne Harrad', 'dharrad4@netscape.com', '766-539-9540', '43 Birchwood Circle', '405-368-4404', false);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Jeanelle Faragan', 'jfaragan5@bigcartel.com', '469-988-0012', '9 Blackbird Alley', '138-391-3086', true);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Klement Criple', 'kcriple6@ycombinator.com', '179-490-4162', '38 Talmadge Way', '242-778-2477', false);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Fara Pettyfer', 'fpettyfer7@businessinsider.com', '424-350-2595', '4048 Heffernan Road', '565-970-1133', false);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Haroun Croci', 'hcroci8@ustream.tv', '101-499-0339', '542 Huxley Crossing', '729-529-3467', true);
insert into workers (name, email, phone_number , address, whatsapp, permanent_contract) values ('Meryl Windrass', 'mwindrass9@ustream.tv', '184-465-3796', '235 Susan Point', '864-737-0454', false);

insert into customers (name, email, phone_number ) values ('Kwinu', 'vcassam0@umn.edu', '522-124-1500');
insert into customers (name, email, phone_number ) values ('Thoughtbeat', 'mdeandisie1@g.co', '513-305-6189');
insert into customers (name, email, phone_number ) values ('Latz', 'rnapolione2@mozilla.com', '865-139-9520');
insert into customers (name, email, phone_number ) values ('Jayo', 'hhowselee3@omniture.com', '744-502-8775');
insert into customers (name, email, phone_number ) values ('Jaxspan', 'agoodman4@yahoo.co.jp', '113-798-8476');
insert into customers (name, email, phone_number ) values ('Avamm', 'dpapps5@seattletimes.com', '816-312-1419');
insert into customers (name, email, phone_number ) values ('Jabbersphere', 'ghaselhurst6@networkadvertising.org', '380-496-6072');
insert into customers (name, email, phone_number ) values ('Realblab', 'rtemblett7@uol.com.br', '837-987-3494');
insert into customers (name, email, phone_number ) values ('Flipbug', 'ebrou8@imageshack.us', '886-701-4124');
insert into customers (name, email, phone_number ) values ('Zooveo', 'dpittel9@amazon.de', '248-509-4767');

insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Gan Clerc', '9404 Manley Lane', '387-952-0980', 1, 1, '15:20', 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Israel Devericks', '88 Eliot Avenue', '324-972-6022', 2, 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Cecily Eastment', '2139 Monument Center', '997-486-0205', 3, 3);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Tim Portman', '539 Schurz Parkway', '758-438-2304', 4, 4, '12:20', 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Kylen Landy', '9845 Mccormick Terrace', '463-502-4437', 5, 5);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Kelcey Chastenet', '94199 Westport Avenue', '738-206-5334', 6, 6, '13:20', 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Jermayne Tumility', '38022 Straubel Way', '554-654-7333', 7, 7);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Pearl Ksandra', '28996 Sunfield Pass', '478-994-8942', 8, 8);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Donielle Bondar', '29950 Karstens Lane', '152-850-4177', 9, 9, '07:20', 1);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Phebe Brussell', '3666 Menomonie Drive', '927-971-0859', 10, 10);

insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Amos Cavy', '98017 Westport Drive', '175-427-9359', 1, 1);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Sephira Varran', '6 Buhler Pass', '751-263-2780', 2, 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Josey Boseley', '221 Meadow Ridge Street', '705-120-9724', 3, 3, '07:20', 1);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Cosimo Norvel', '8 Starling Hill', '756-428-5856', 4, 4);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Annalee MacBrearty', '7 Hoepker Crossing', '711-417-7631', 5, 5, '07:20', 1);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Cass Conradsen', '73 Towne Drive', '454-458-8492', 6, 6);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Jerry Vose', '4 Novick Junction', '460-444-5822', 7, 7, '08:20', 3);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Drucill Aickin', '14 Wayridge Pass', '495-688-3267', 8, 8);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Mirelle Girodin', '73412 Fieldstone Trail', '559-275-7421', 9, 9);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Rubia Masselin', '938 Garrison Parkway', '843-717-9810', 10, 10, '09:20', 2);

insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Darcie Morkham', '3 Prairieview Way', '816-366-0605', 1, 1);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Hatty Roon', '0299 La Follette Trail', '606-239-3229', 2, 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Kendall Brotheridge', '40494 Mayfield Road', '904-737-5946', 3, 3);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Maurie Males', '44145 Bartelt Alley', '262-843-2974', 4, 4);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id, visit_time, duration) values ('Ermanno Eliff', '723 Eggendart Road', '954-202-3864', 5, 5, '07:20', 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Kalina Sahnow', '255 Merchant Pass', '137-205-9773', 6, 6);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Misty MacPaden', '25365 Comanche Street', '301-101-0913', 7, 7);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Lenci Grayne', '70 Weeping Birch Plaza', '850-852-3281', 1, 1);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Horatio Mascall', '590 Schurz Place', '553-419-2650', 2, 2);
insert into branches (contact_name, address, contact_phone, customer_id, worker_id) values ('Haley Beldan', '757 Mayfield Court', '531-295-7126', 3, 3);

UPDATE customers SET main_branch_id=1 WHERE id=1;
UPDATE customers SET main_branch_id=2 WHERE id=2;
UPDATE customers SET main_branch_id=3 WHERE id=3;
UPDATE customers SET main_branch_id=4 WHERE id=4;
UPDATE customers SET main_branch_id=5 WHERE id=5;
UPDATE customers SET main_branch_id=6 WHERE id=6;
UPDATE customers SET main_branch_id=7 WHERE id=7;
UPDATE customers SET main_branch_id=8 WHERE id=8;
UPDATE customers SET main_branch_id=9 WHERE id=9;
UPDATE customers SET main_branch_id=10 WHERE id=10;

insert into jobs (date_created, customer_id, branch_id , worker_id, visit_on, visit_time, pay_rate) values ('2020-12-09', 1, 1, 1, '2020-12-21', '15:20', 10);
insert into jobs (date_created, customer_id, branch_id , worker_id, visit_on, visit_time, pay_rate) values ('2020-12-09', 2, 22, 2, '2020-12-12', '15:20', 10);
insert into jobs (date_created, customer_id, branch_id , worker_id, visit_on, visit_time, pay_rate, duration) values ('2020-12-09', 3, 3, 7, '2020-12-12', '15:20', 10.5, 2);
insert into jobs (date_created, customer_id, branch_id , worker_id, visit_on, visit_time, pay_rate, duration) values ('2020-12-09', 4, 4, 3, '2020-12-12', '15:20', 10.5, 2);
