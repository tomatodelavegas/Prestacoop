#!/bin/bash

echo "Variable check & set ..."

if [ -z $SPARK_HOME ]
then
  SPARK_HOME="D:/Documents/cours/S8/SCALA/spark-2.4.5-bin-hadoop2.7/"
  echo "SPARK_HOME not set, defaulting to : ${SPARK_HOME}"
fi

MASTER="local" # local[4], yarn, mesos://207.184.161.138:7077, k8s://xx.yy.zz.ww:443 ...
IP="localhost"
PORT="9999"
TARGET="target/scala-2.12/prestacoop_2.12-1.0.jar"
ARGS="${IP} ${PORT}"
CLASS="Prestacoop" #CLASS="Prestacoop.Prestacoop", "HelloWorld.HelloWorld"

echo "Launching spark submit"

"${SPARK_HOME}/bin/spark-submit" \
  --class "${CLASS}" \
  --master "${MASTER}" \
  "${TARGET}" \
  "${ARGS}"