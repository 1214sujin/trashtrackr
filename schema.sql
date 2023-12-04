CREATE TABLE `employee` (
  `emp_id` char(20) PRIMARY KEY,
  `password` varchar(20) NOT NULL,
  `name` varchar(10) NOT NULL,
  `tel` varchar(13) NOT NULL,
  `gu` varchar(10),
  `dong` varchar(10),
  `code` varchar(1) NOT NULL
);

CREATE TABLE `bin` (
  `bin_id` char(6) PRIMARY KEY,
  `gu` varchar(50) NOT NULL,
  `dong` varchar(20) NOT NULL,
  `lat` double NOT NULL,
  `long` double NOT NULL,
  `install_date` date NOT NULL
);

CREATE TABLE `loadage` (
  `bin_id` char(6),
  `load_time` datetime,
  `amount` int NOT NULL,
  PRIMARY KEY (`bin_id`, `load_time`)
);

CREATE TABLE `fire` (
  `bin_id` char(6),
  `fire_time` datetime,
  `image` varchar(20) NOT NULL,
  PRIMARY KEY (`bin_id`, `fire_time`)
);

CREATE TABLE `replacement` (
  `bin_id` char(6),
  `rp_time` datetime,
  `emp_id` char(20) NOT NULL,
  PRIMARY KEY (`bin_id`, `rp_time`)
);

ALTER TABLE `loadage` ADD FOREIGN KEY (`bin_id`) REFERENCES `bin` (`bin_id`);

ALTER TABLE `fire` ADD FOREIGN KEY (`bin_id`) REFERENCES `bin` (`bin_id`);

ALTER TABLE `replacement` ADD FOREIGN KEY (`bin_id`) REFERENCES `bin` (`bin_id`);

ALTER TABLE `replacement` ADD FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`);
