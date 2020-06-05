package drone_simulation

import scala.io.{BufferedSource, Source}
import utils.DroneMsg

import java.util.Properties
import org.apache.kafka.clients.producer._
import org.apache.kafka.common.serialization.StringSerializer

import scala.collection.mutable.ListBuffer

// Circe Json
import io.circe.generic.auto._
import io.circe.syntax._

object Drone_simulation {
  def main(args: Array[String]): Unit = {
    val columnsName: Array[String] = Array("Issue Date", "Plate ID", "Violation Code", "Vehicle Body Type", "Street Code1",
    "Street Code2", "Street Code3", "Violation Time", "Violation County", "Registration State")
    val filename: String = "data/drone_scenario.csv"
    val file: BufferedSource = Source.fromFile(filename)
    val LOCALHOST = "192.168.99.100"

    val columnsId: ListBuffer[Int] = ListBuffer()
    val header: String = file.getLines().toIterable.take(1).toString()
    val columns: Array[String] = header.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)")
    
    for (i <- 0 to columnsName.size - 1)
    {
      columnsId += columns.indexOf(columnsName(i))
    }

    def getDroneMsg(line: String, columnsId: List[Int]): DroneMsg = {
      val row: Array[String] = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)")

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

    val props: Properties = new Properties()
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, LOCALHOST + ":9092")
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
    val producer: KafkaProducer[String, String] = new KafkaProducer[String, String](props)

    val data = file.getLines().drop(1)
    data.foreach{ line =>
      producer.send(new ProducerRecord[String, String]("test", getDroneMsg(line, columnsId.toList).asJson.toString)) }

    file.close()
    producer.close()
    System.err.println("Done")
  }
}