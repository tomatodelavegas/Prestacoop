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

## Ressources

File needed for the drone simulation: **drone_simulation.csv**  
Link to the ressource (an epita account is **required**):
[drone_simulation.csv sharepoint](https://epitafr-my.sharepoint.com/:x:/r/personal/guillaume_blassel_epita_fr/Documents/SCALA/drone_simulation.csv?d=w4727eabdde26415d983f0f7d1a26a6ac&csf=1&web=1&e=MJiXPy)

## Run

```language=sh
$ export KAFKA_HOST_NAME=localhost # or 192.168.99.100
PS> set KAFKA_HOST_NAME=localhost # or 192.168.99.100
```

### Run docker-compose Kafka
Open a shell in the directory and run docker-compose:
```language=sh
docker-compose up -d 
```
This will launch kafka and zookeeper with a demo topic "test".  
Kafka is accessible at: 
```language=sh
${KAFKA_HOST_NAME}:9092
```
Logs are accesible like so:
```
docker-compose logs YOUR_SERVICE_NAME # or just logs but barely readable
```
You can also acces the machines terminal:
```
docker-compose exec YOUR_SERVICE_NAME sh # or some other program
```

Therefore to test if kafka is correctly working on your desktop, open two shells, one which will act as producer and the other as consumer:
```language=sh
kafka-console-consumer.sh --bootstrap-server ${KAFKA_HOST_NAME}:9092 --topic test
kafka-console-producer.sh --broker-list ${KAFKA_HOST_NAME}:9092 --topic test
```
Then write a few messages in the producer shell and check if they correctly appear in the consumer one.

### sbt run

Normally we should be able to run quickly with :
```language=sh
sbt "run"
```

### A word about Running Standard process

sbt run is not the official way of running since we need to use setMaster.
We could however add arguments and even use src/main/ressources/application.properties, in order to setup dev/pre/pro type of configurations ?

spark-shell is a quick way to run, it can call spark-submit automatically in the sc val, therefore there is no need for SparkContext setup (do not forget to sbt package first) :
```
"${SPARK_HOME}"/bin/spark-shell --master local[4] --jars "target/scala-2.12/prestacoop_2.12-1.0.jar"
```

package app into .jar:
```language=sh
sbt package
```

call spark-submit for our project to run with all the wanted parameters:
```language=sh
./submit.sh
```
