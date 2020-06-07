package drone_simulation

import scala.io.{BufferedSource, Source}
import drone.Drone._
import org.apache.kafka.clients.producer._
import scala.collection.mutable.ListBuffer
// Circe Json
import io.circe.generic.auto._
import io.circe.syntax._

object Drone_simulation {
  def main(args: Array[String]): Unit = {
    val columnsName: Array[String] = Array("Issue Date", "Plate ID", "Violation Code", "Vehicle Body Type", "Street Code1",
    "Street Code2", "Street Code3", "Violation Time", "Violation County", "Registration State", "Vehicle Color")
    val filename: String = "data/drone_simulation.csv"
    val file: BufferedSource = Source.fromFile(filename)

    val columnsId: ListBuffer[Int] = ListBuffer()
    val header: String = file.getLines().toIterable.take(1).toString()
    val columns: Array[String] = header.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)")
    
    for (i <- 0 to columnsName.size - 1)
    {
      columnsId += columns.indexOf(columnsName(i))
    }

    val producer: KafkaProducer[String, String] = getDefaultKafkaProducer

    val rand = scala.util.Random

    val data = file.getLines().drop(1)
    data.foreach{ line =>
      if (getDroneMsg(line, columnsId.toList).Violation_Code == -1) //send into alert stream
        producer.send(new ProducerRecord[String, String]("alert", getDroneMsg(line, columnsId.toList).asJson.toString))
      else
        producer.send(new ProducerRecord[String, String]("general", getDroneMsg(line, columnsId.toList).asJson.toString))
      Thread.sleep((rand.nextFloat()*100).toInt)
    }

    file.close()
    producer.close()
    System.err.println("Done")
  }
}