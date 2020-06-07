package Prestacoop


import org.apache.spark.sql
import org.apache.spark.sql.functions._
import org.apache.spark.sql.SparkSession



object Analytics {
  def main(args: Array[String]): Unit = {
    val spark : SparkSession = SparkSession.builder()
      .master("local[*]")
      .appName("Testing")
      .getOrCreate()

    val df = spark.read.parquet("data/test.parquet")

    def worstNeighbor(df : sql.DataFrame)
    {
      System.out.println("The top 10 worst neighbors is officially:")
      df.where(df("Registration_State") =!= "NY")
        .groupBy("Registration_State")
        .count().withColumnRenamed("count", "Count")
        .orderBy(desc("count"))
        .limit(10)
        .show()
    }

    def worstType(df : sql.DataFrame)
    {
      df.groupBy("Vehicle_Body_Type")
        .count().withColumnRenamed("count", "Count")
        .orderBy(desc("count"))
        .limit(10)
        .show()
    }

    def worstMoment(df : sql.DataFrame)
    {
      df.withColumn("Time",
        when(col("Violation_Time").contains("07") && col("Violation_Time").contains("A"), "07h")
          .when(col("Violation_Time").contains("08") && col("Violation_Time").contains("A"), "08h")
          .when(col("Violation_Time").contains("09") && col("Violation_Time").contains("A"), "09h")
          .when(col("Violation_Time").contains("10") && col("Violation_Time").contains("A"), "10h")
          .when(col("Violation_Time").contains("11") && col("Violation_Time").contains("A"), "11h")
          .when(col("Violation_Time").contains("12") && col("Violation_Time").contains("P"), "12h")
          .when(col("Violation_Time").contains("A"), "00h - 06h")
          .when(col("Violation_Time").contains("01") && col("Violation_Time").contains("P"), "13h")
          .when(col("Violation_Time").contains("02") && col("Violation_Time").contains("P"), "14h")
          .when(col("Violation_Time").contains("03") && col("Violation_Time").contains("P"), "15h")
          .when(col("Violation_Time").contains("04") && col("Violation_Time").contains("P"), "16h")
          .when(col("Violation_Time").contains("05") && col("Violation_Time").contains("P"), "17h")
          .when(col("Violation_Time").contains("P"), "18h - 24h")
          .otherwise("Other")).groupBy("Time")
        .count().withColumnRenamed("count", "Count")
        .orderBy(asc("Time"))
        .show()
    }

    def mostDangerousStreet(df : sql.DataFrame)
    {
      val street1 = df.where(col("Street_Code1") =!= 0)
        .groupBy(col("Street_Code1"))
        .count()

      val street2 = df.where(col("Street_Code2") =!= 0)
        .groupBy(col("Street_Code2"))
        .count()

      val street3 = df.where(col("Street_Code3") =!= 0)
        .groupBy(col("Street_Code3"))
        .count()

      street1.join(street2, street2.col("Street_Code2") === street1.col("Street_Code1"), "cross")
        .join(street3, street3.col("Street_Code3") === street1.col("Street_Code1"), "cross")
        .select(col("Street_Code1").alias("Street_Code"),
          (street1.col("count") + street2.col("count") + street3.col("count"))
            .alias("Total violation"))
        .sort(desc("Total violation"))
        .limit(10)
        .show()
    }

    mostDangerousStreet(df)
  }
}
