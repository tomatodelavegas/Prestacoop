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
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.SparkSession

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

    val kafkaHost: String = sys.env.getOrElse("KAFKA_HOST_NAME", "localhost") + ":9092";

    val kafkaParams = Map[String, Object](
      "bootstrap.servers" -> kafkaHost,
      "key.deserializer" -> classOf[StringDeserializer],
      "value.deserializer" -> classOf[StringDeserializer],
      "group.id" -> groupId,
      "auto.offset.reset" -> "latest",
      "enable.auto.commit" -> (false: java.lang.Boolean)
    )

    val topics = Array("general", "alert")
    val batchInterval = Seconds(30)
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
      }).filter(msg => msg != None).map(value => value.asInstanceOf[DroneMsg])

    messages.cache()

    messages.foreachRDD(rdd =>{
      rdd.foreach(drone => println(drone)) // FIXME
      
      val spark =
        SparkSession.builder.config(rdd.sparkContext.getConf).getOrCreate()
      import spark.implicits._
      val df = rdd.toDF()
      df.write
        .mode("append")
        .parquet("data/parquet")
    })

    ssc.start()
    ssc.awaitTermination()
  }
}
