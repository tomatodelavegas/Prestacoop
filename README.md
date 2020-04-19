# Prestacoop

Prestacop group project for Epita's SCIA major course, written in Scala/Spark.

Group members:
- Geoffrey BOSSUT
- Guillaume BLASSEL
- Sabrina MENG
- Tom MECHINEAU

## TODO

- [ ] Dockerize the App to avoid compatibility issues ...
- [ ] Check Spark streaming API to make a proper Stream

## Setup

- Download & install openjdk8 (1.8), we used the amazon correto 8 version for windows
- Download & extract "spark-2.4.5-bin-hadoop2.7"
- Download & install "scala 2.12.10" and "sbt 1.3.4"
- set SPARK_HOME env variable to the spark-2.4.5-bin-hadoop2.7 folder location

## Run

Nice already DONE POC for streaming :
```language=sh
bin/run-example streaming.NetworkWordCount localhost 9999
```

### sbt run

Normally we should be able to run quickly with :
```language=sh
sbt "run localhost 9999"
```
but this seems not to be the proper way to go since we need to use setMaster.
We could however add arguments and even use src/main/ressources/application.properties, in order to setup dev/pre/pro type of configurations ?

spark-shell is a quick way to run, it can call spark-submit automatically in the sc val, therefore there is no need for SparkContext setup (do not forget to sbt package first) :
```
"${SPARK_HOME}"/bin/spark-shell --master local[4] --jars "target/scala-2.12/prestacoop_2.12-1.0.jar"
```

### Standard process

package app into .jar:
```language=sh
sbt package
```

call spark-submit for our project to run with all the wanted parameters:
```language=sh
./submit.sh
```

start the spark history webserver in order to view what happens after submitting:
```language=sh
"${SPARK_HOME}"/sbin/start-history-server.sh
```

## Test

once app is running use netcat like so:
```language=sh
echo "hello world" > nc -k -lvp 9999
```