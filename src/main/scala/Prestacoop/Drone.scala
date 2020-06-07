package drone

import scala.io.{BufferedSource, Source}
import utils.DroneMsg
import java.io.File

import java.util.Properties
import org.apache.kafka.clients.producer._
import org.apache.kafka.common.serialization.StringSerializer

// Circe Json
import io.circe.generic.auto._
import io.circe.syntax._

object Drone {

  def getDefaultKafkaProducer: KafkaProducer[String, String] = {
    val props: Properties = new Properties()
    val kafkahost: String = sys.env.getOrElse("KAFKA_HOST_NAME", "localhost");
    System.err.println("using kafka host: " + kafkahost);
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkahost + ":9092");
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])

    new KafkaProducer[String, String](props)
  }

  def getDroneMsg(id: Int, line: String, columnsId: Array[Int]): DroneMsg = {
    val row: Array[String] = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)")

    val issue_date: String = row(columnsId(0))
    val plate_id: String = row(columnsId(1))
    val violation_code: Int = row(columnsId(2)).toInt
    val vehicle_body_type: String = row(columnsId(3))
    val street_code1: Int = row(columnsId(4)).toInt
    val street_code2: Int = row(columnsId(5)).toInt
    val street_code3: Int = row(columnsId(6)).toInt
    val violation_time: String = row(columnsId(7))
    val violation_county: String = row(columnsId(8))
    val registration_state: String = row(columnsId(9))
    val vehicle_color: String = row(columnsId(10))
    val vehicle_maker: String = row(columnsId(11))

    DroneMsg(id, issue_date, plate_id, violation_code, vehicle_body_type, street_code1, street_code2, street_code3,
      violation_time, violation_county, registration_state, vehicle_color, vehicle_maker)
  }

  def getColumns(file: BufferedSource):  Array[Int] = {
    val columnsName: Array[String] = Array("Issue Date", "Plate ID", "Violation Code", "Vehicle Body Type", "Street Code1",
      "Street Code2", "Street Code3", "Violation Time", "Violation County", "Registration State", "Vehicle Color", "Vehicle Make")

    val columnsId: Array[Int] = new Array[Int](columnsName.length)
    val header: String = file.getLines().toIterable.take(1).toString()
    val columns: Array[String] = header.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)")
    columnsName.indices.foreach{ i  => columnsId(i) = columns.indexOf(columnsName(i)) }
    columnsId
  }

  def getListOfFiles(dir: String): List[File] = {
    val d = new File(dir)
    if (d.exists && d.isDirectory)
      d.listFiles.filter(file => file.isFile && file.getName.endsWith(".csv")).toList
    else if (d.isFile)
      List[File](d)
    else
      List[File]()
  }

  def main(args: Array[String]): Unit = {
    if (args.length == 0)
      System.err.println("No files or directory given")
    else {
      val filenames: List[File] = getListOfFiles(args(0))

      val producer: KafkaProducer[String, String] = getDefaultKafkaProducer

      filenames.foreach{ filename =>
        val file: BufferedSource = Source.fromFile(filename)
        val columnsId: Array[Int] = getColumns(file)
        file.getLines().drop(1).foreach{ line =>
          val rand = scala.util.Random
          producer.send(new ProducerRecord[String, String]("general", getDroneMsg(rand.nextInt(20000), line, columnsId).asJson.toString)) }
        file.close()
        System.err.println(filename + " loaded")
      }

      producer.close()
      System.err.println("Load finished")
    }
  }
}
