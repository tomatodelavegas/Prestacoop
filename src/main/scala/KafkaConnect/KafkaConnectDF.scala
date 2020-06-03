package KafkaConnect

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.types.{DataTypes, StructType}

object KafkaConnectDF {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("kafka-connect-df")
      .master("local[*]")
      .getOrCreate()

    val inputDf = spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "localhost:9092")
      .option("subscribe", "test")
      .load()

    /*
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
     */
    inputDf.writeStream
      .outputMode("append")
      .format("console")
      .start()
      .awaitTermination()
  }
}
