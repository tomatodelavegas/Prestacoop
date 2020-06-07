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
    val filename: String = "data/drone_simulation.csv"
    val file: BufferedSource = Source.fromFile(filename)

    val columnsId: Array[Int] = getColumns(file)

    val producer: KafkaProducer[String, String] = getDefaultKafkaProducer

    val rand = scala.util.Random
    val rand_ID = rand.nextInt(20000)

    val data = file.getLines().drop(1)
    data.foreach{ line =>
      if (getDroneMsg(rand_ID, line, columnsId).Violation_Code == -1) //send into alert stream
        producer.send(new ProducerRecord[String, String]("alert", getDroneMsg(rand_ID, line, columnsId).asJson.toString))
      else
        producer.send(new ProducerRecord[String, String]("general", getDroneMsg(rand_ID, line, columnsId).asJson.toString))
      Thread.sleep((rand.nextFloat()*100).toInt)
    }

    file.close()
    producer.close()
    System.err.println("Done")
  }
}