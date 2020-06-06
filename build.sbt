// Build file
name := "Prestacoop"
version := "1.0"
scalaVersion := "2.12.10"
val sparkVersion = "2.4.5"
libraryDependencies += "org.apache.spark" % "spark-streaming_2.12" % sparkVersion
libraryDependencies += "org.apache.spark" % "spark-streaming-kafka-0-10_2.12" % sparkVersion
libraryDependencies += "org.apache.spark" %% "spark-sql" % sparkVersion
libraryDependencies += "org.apache.spark" %% "spark-sql-kafka-0-10" % sparkVersion
libraryDependencies += "org.apache.kafka" %% "kafka" % "2.5.0"

// Circe Json
val circeVersion = "0.13.0"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)