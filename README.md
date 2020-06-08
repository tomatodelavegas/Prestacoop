# Prestacoop

Prestacop group project for Epita's SCIA major course, written in Scala/Spark.

Group members:
- Geoffrey BOSSUT
- Guillaume BLASSEL
- Sabrina MENG
- Tom MECHINEAU

## Setup

- Download & install openjdk8 (1.8), we used the amazon correto 8 version for windows
- Download & extract "spark-2.4.5-bin-hadoop2.7"
- Download & install "scala 2.12.10" and "sbt 1.3.4"
- set SPARK_HOME env variable to the spark-2.4.5-bin-hadoop2.7 folder location
- Download docker for your machine (**be sure to know your local docker-machine ip**, it will be required later)
- "winutils.exe" might be needed to run spark content on windows: 
[winutils](https://github.com/cdarlint/winutils)

## Ressources

File needed for the drone simulation: **drone_simulation.csv**  
Place the file in **'data/'**  
Link to the ressource (an epita account is **required**):
[drone_simulation.csv sharepoint](https://epitafr-my.sharepoint.com/:x:/r/personal/guillaume_blassel_epita_fr/Documents/SCALA/drone_simulation.csv?d=w4727eabdde26415d983f0f7d1a26a6ac&csf=1&web=1&e=MJiXPy)  
File needed for the drone import of NYPD dataset;  
Place the file in **'data/'**   
Link to the ressource: [NYPD Kaggle](https://www.kaggle.com/new-york-city/nyc-parking-tickets)

## Quickstart
Launch kafka and website alerter:
```
> docker-compose up -d
```
Run spark and scala components:
- KafkaConnect: Links the kafka to the storage component.
- Drone: NYC dataset import, nyc file needed or csv folder needed; Give the path in argument  
- Drone_simulation: Simulate drones, simulation file from 'ressources' needed.  
- Analytics: Analyse data saved in parquet thanks to KafkaConnect, can only be run once data has already been written.

## Run

**Our app requires your to set the KAFKA_HOST_NAME environment variable (needed by dockerized components as well as drone simulator).**

**This variable should be your local ip !**

```language=sh
$ export KAFKA_HOST_NAME=(local_ipv4) # or 192.168.99.100 or localhost (not assured to work)
PS> set KAFKA_HOST_NAME=(local_ipv4) # or 192.168.99.100 or localhost (not assured to work)
```

### Using Docker-Toolbox

Windows non Hyper-V versions using Docker-Toolbox should must use the **KAFKA_HOST_NAME** variable for almost all docker and non docker communications.

### Using Standard docker

Windows or linux non Docker-Toolboox users should use **KAFKA_HOST_NAME** for dockerized components while localhost can be used to access the dockerized components from outside.

### Setting environment files

- **Copy alerter/.env.example to alerter/.env and fill the values**.
- **Copy alerterbackend/.env.example to alerterbackend/.env and fill the values**.
- **Modify the host variable inside alertfrontend/src/config.js host variable**.

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
kafka-console-consumer.sh --bootstrap-server ${KAFKA_HOST_NAME}:9092 --topic test # or localhost depending on your docker version
kafka-console-producer.sh --broker-list ${KAFKA_HOST_NAME}:9092 --topic test # or localhost depending on your docker version
```
Then write a few messages in the producer shell and check if they correctly appear in the consumer one.

### sbt run

Normally we should be able to run quickly with :
```language=sh
sbt "run"
```

For the Drone component, we must run sbt with a file or directory path :
```langaguage=sh
sbt "run data/nypd"
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
