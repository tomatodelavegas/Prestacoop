USE prestacoop;

CREATE TABLE IF NOT EXISTS drone_messages(
  id INT AUTO_INCREMENT PRIMARY KEY,
  Drone_ID INT,
  Issue_Date varchar(100),
  Plate_ID varchar(100),
  Violation_Code INT,
  Vehicle_Body_Type varchar(255),
  Street_Code1 INT,
  Street_Code2 INT,
  Street_Code3 INT,
  Violation_Time varchar(200),
  Violation_County varchar(150),
  Registration_State varchar(200),
  Vehicle_Color varchar(100),
  Vehicle_Maker varchar(100)
);