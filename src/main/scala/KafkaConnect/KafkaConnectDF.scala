package KafkaConnect

import org.apache.spark.sql.{DataFrame, Dataset, SparkSession}
import org.apache.spark.sql.types.{DataTypes, StructType}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.streaming.Trigger

object KafkaConnectDF {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("kafka-connect-df")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    val kafkaHost: String = sys.env.getOrElse("KAFKA_HOST_NAME", "localhost") + ":9092";

    val inputDf = spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafkaHost)
      .option("subscribe", "test")
      .load()

    val testJsonDF = inputDf.selectExpr("CAST(value AS STRING)")

    val struct = new StructType()
      .add("Issue_Date", DataTypes.StringType)
      .add("Plate_ID", DataTypes.StringType)
      .add("Violation_Code", DataTypes.ByteType)
      .add("Vehicle_Body_Type", DataTypes.StringType)
      .add("Street_Code1", DataTypes.IntegerType)
      .add("Street_Code2", DataTypes.IntegerType)
      .add("Street_Code3", DataTypes.IntegerType)
      .add("Violation_Time", DataTypes.StringType)
      .add("Violation_County", DataTypes.StringType)
      .add("Registration_State", DataTypes.StringType)

    val personNestedDf = testJsonDF.select(from_json($"value", struct).as("Drone_Msg"))

    personNestedDf.writeStream.foreachBatch {
      (batchDF: DataFrame, batchId: Long) =>
        batchDF.cache()

        val newDf = batchDF.na.drop()

        newDf.write
          .mode("append")
          .format("parquet")
          .option("path", "data")
          .option("checkpointLocation", "data_checkpoint")

        batchDF.unpersist()
        batchDF.show()
    }.trigger(Trigger.ProcessingTime("30 seconds")).start().awaitTermination()
  }
}
