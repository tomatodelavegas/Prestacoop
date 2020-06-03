package KafkaConnect

import org.apache.spark.{SparkConf, SparkContext}
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.streaming.kafka010._
import org.apache.spark.streaming.kafka010.LocationStrategies.PreferConsistent
import org.apache.spark.streaming.kafka010.ConsumerStrategies.Subscribe
import utils.DroneMsg
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe._
import io.circe.generic.semiauto._

object KafkaConnect {
  def main(args: Array[String]): Unit = {
    val conf = new SparkConf()
      .setAppName("Kafka Connect")
      .setMaster("local[*]")

    val sc = SparkContext.getOrCreate(conf)
    sc.setLogLevel("WARN")

    val r = scala.util.Random
    // Generate a new Kafka Consumer group id every run
    val groupId = s"stream-checker-v${r.nextInt.toString}"
    val kafkaParams = Map[String, Object](
      "bootstrap.servers" -> "localhost:9092",
      "key.deserializer" -> classOf[StringDeserializer],
      "value.deserializer" -> classOf[StringDeserializer],
      "group.id" -> groupId,
      "auto.offset.reset" -> "latest",
      "enable.auto.commit" -> (false: java.lang.Boolean)
    )

    val topics = Array("test")
    val batchInterval = Seconds(5)
    val ssc = new StreamingContext(sc, batchInterval)
    val stream = KafkaUtils.createDirectStream[String, String](
      ssc,
      PreferConsistent,
      Subscribe[String, String](topics, kafkaParams)
    )


    val messages = stream.map(record => record.value)
      .map(record => {
        val decode = parser.decode[DroneMsg](record)
        decode match {
          case Right(staff) => staff
          case Left(error) => None
        }
      })
    messages.foreachRDD(rdd =>{
      rdd.foreach(drone => println(drone))
    })

    ssc.start()
    ssc.awaitTermination()
  }
}
