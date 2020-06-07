package utils
// TODO: have a proper packaging naming choice and folder accordingly ?

/**
We use the following csv columns values
Issue Date
Plate ID
Violation Code
Vehicle Body Type
Street Code1
Street Code2
Street Code3
Violation Time
Violation County
Registration State
**/

case class DroneMsg (
    Drone_ID: Int,
    Issue_Date: String, // maybe more advanced Date java/scala type
    Plate_ID: String, // GGY6450 is a license plate
    Violation_Code: Int, // [-1,99]
    Vehicle_Body_Type: String,
    Street_Code1: Int, // [0,98K]
    Street_Code2: Int, // [0,98K]
    Street_Code3: Int, // [0,98K]
    Violation_Time: String, // 0800A is 8 AM
    Violation_County: String, // NY is NewYork
    Registration_State: String, // 67+ states since including canada and others
    Vehicle_Color: String, //color of the vehicle
    Vehicle_Maker: String //vehicle brand
);