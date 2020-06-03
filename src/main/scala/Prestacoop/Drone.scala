package drone

import scala.io.{BufferedSource, Source}
import utils.DroneMsg

import scala.collection.mutable.ListBuffer

// Play-Json
// See more on https://github.com/playframework/play-json
import play.api.libs.json._

object Drone {

  def main(args: Array[String]): Unit = {
    // Converter for DroneMsg to Json
    implicit val droneWrites = new Writes[DroneMsg] {
      def writes(droneMsg: DroneMsg) = Json.obj(
        "issue_date" -> droneMsg.Issue_Date,
        "plate_id" -> droneMsg.Plate_ID,
        "violation_code" -> droneMsg.Violation_Code,
        "vehicle_body_type" -> droneMsg.Vehicle_Body_Type,
        "street_code1" -> droneMsg.Street_Code1,
        "street_code2" -> droneMsg.Street_Code2,
        "street_code3" -> droneMsg.Street_Code3,
        "violation_time" -> droneMsg.Violation_Time,
        "violation_county" -> droneMsg.Violation_County,
        "registration_state" -> droneMsg.Registration_State
      )
    }

    val columnsName: Array[String] = Array("Issue Date", "Plate ID", "Violation Code", "Vehicle Body Type", "Street Code1",
    "Street Code2", "Street Code3", "Violation Time", "Violation County", "Registration State")
    val filename: String = "data/Parking_Violations_Issued_-_Fiscal_Year_2017.csv"
    val file: BufferedSource = Source.fromFile(filename)

    def getDroneMsg(line: String, columnsId: List[Int]): DroneMsg = {
      val row: Array[String] = line.split(",")
      // println("Row size: " + row.size)

      val issue_date: String = row(columnsId(0))
      val plate_id: String = row(columnsId(1))
      val violation_code: Byte = row(columnsId(2)).toByte
      val vehicle_body_type: String = row(columnsId(3))
      val street_code1: Int = row(columnsId(4)).toInt
      val street_code2: Int = row(columnsId(5)).toInt
      val street_code3: Int = row(columnsId(6)).toInt
      val violation_time: String = row(columnsId(7))
      val violation_county: String = row(columnsId(8))
      val registration_state: String = row(columnsId(9))

      return DroneMsg(issue_date, plate_id, violation_code, vehicle_body_type, street_code1, street_code2, street_code3,
                      violation_time, violation_county, registration_state)
    }

    val columnsId: ListBuffer[Int] = ListBuffer()
    val header: String = file.getLines().toIterable.take(1).toString()
    val columns: Array[String] = header.split(",")
    
    for (i <- 0 to columnsName.size - 1)
    {
      columnsId += columns.indexOf(columnsName(i))
    }

    for (line <- file.getLines().drop(1))
    {
      val droneMsg: DroneMsg = getDroneMsg(line, columnsId.toList)
      val droneJson = Json.toJson(droneMsg)
      // println(droneJson)
    }
    file.close()
    println("Done")
  }

  // Get a specific Json column
  // val plate_id = (droneJson \ "plate_id").as[String]
  // Pretty print
  // Json.prettyPrint(droneJson)
}