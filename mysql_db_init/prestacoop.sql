USE prestacoop;

CREATE TABLE IF NOT EXISTS drone_messages(
  drone_id INT NOT NULL,
  issue_date varchar(100),
  plate_id varchar(100),
  violation_code INT,
  vehicle_body_type varchar(255),
  street_code1 INT,
  street_code2 INT,
  street_code3 INT,
  violation_time varchar(200),
  violation_county varchar(150),
  registration_state varchar(200),
  PRIMARY KEY (drone_id)
);