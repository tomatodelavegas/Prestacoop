@echo off 
setlocal

echo "Variable check & set ..."

IF "%SPARK_HOME%"=="" (
    set SPARK_HOME=D:\Documents\cours\S8\SCALA\spark-2.4.5-bin-hadoop2.7\
    echo "SPARK_HOME not set, defaulting to : %SPARK_HOME%"
)

set MASTER=local
Rem # local[4], yarn, mesos://207.184.161.138:7077, k8s://xx.yy.zz.ww:443 ...

set IP=localhost
set PORT=9999
set TARGET=.\target\scala-2.12\prestacoop_2.12-1.0.jar
set ARGS=%IP% %PORT%

set CLASS=Prestacoop
Rem Prestacoop.Prestacoop, HelloWorld

echo "Launching spark submit"

"%SPARK_HOME%\bin\spark-submit" --class "%CLASS%" --master "%MASTER%" "%TARGET%" %ARGS%

endlocal