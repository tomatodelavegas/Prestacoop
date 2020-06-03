// Build file
name := "Prestacoop"
version := "1.0"
scalaVersion := "2.12.10"
val sparkVersion = "2.4.5"
libraryDependencies += "org.apache.spark" % "spark-streaming_2.12" % sparkVersion

// Play-json
libraryDependencies += "com.typesafe.play" %% "play-json" % "2.9.0"