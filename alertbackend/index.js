"use strict";
const socketio = require("socket.io");
const express = require("express");
const { serverConf, kafkaConf } = require("./config");
const { Kafka } = require('kafkajs');
var cors = require('cors');
const querydb = require("./sqlconnection");

/** Express server **/
let app = express();
app.use(cors({
    origin: '*' // TODO: specific CORS
}));

/** kafka **/
const kafka = new Kafka({
    clientId: 'backendalerter',
    brokers: [kafkaConf.PCOP_KAFKA_HOST_NAME + ':9092']
});
const consumer = kafka.consumer({ groupId: 'backend-group' });

// socket io

const sendNotif = (msg) => {
    console.log("Emitting to clients !");
    socket.sockets.emit("FromAPI", msg);
}

const addAlert = async (msg) => {
    await querydb(`INSERT INTO drone_messages (Issue_Date,Plate_ID,Violation_Code,Vehicle_Body_Type,Street_Code1,Street_Code2,Street_Code3,Violation_Time,Violation_County,Registration_State) VALUES ('${msg.Issue_Date}','${msg.Plate_ID}','${msg.Violation_Code}','${msg.Vehicle_Body_Type}','${msg.Street_Code1}','${msg.Street_Code2}','${msg.Street_Code3}','${msg.Violation_Time}','${msg.Violation_County}','${msg.Registration_State}')`).catch(err => {
        console.error(err);
    }).then(results => {
        sendNotif(msg);
    });
};

/** express **/

/**
 ** OK (empty JSON if not exists)
 **/
app.get("/msglist/:offset/:count", async function (req, res) {
    let offset = req.params.offset;
    let count = req.params.count;
    await querydb(`SELECT * FROM drone_messages LIMIT ${offset},${count}`).catch(err => {
        res.status(500).send(err);
    }).then(results => {
        res.send(results);
    });
});

/**
 ** Get alerts list, OK (empty JSON if none)
 **/
app.get("/msgcount/", async function (req, res) {
    await querydb("SELECT count(*) FROM drone_messages").catch(err => {
        res.status(500).send(err);
    }).then(results => {
        res.send(results);
    });
});

/**
 ** Getting a specific alert by id, OK (empty JSON if not exists)
 **/
app.get("/msg/:id", async function (req, res) {
    let id = req.params.id; // TODO: string -> int conversion checking
    await querydb(`SELECT * FROM drone_messages WHERE id=${id}`).catch(err => {
        res.status(500).send(err);
    }).then(results => {
        if (results.length > 0)
            res.send(results[0]);
        else
            res.send({});
    });
});

/** Backend server running **/
var server = app.listen("3000", serverConf.PCOP_BACKEND_HOST_NAME, function () {
    console.log(`Server running http://${serverConf.PCOP_BACKEND_HOST_NAME}:3000`);
});

/** websocket **/
let socket = socketio.listen(server);//, { origins: "localhost:3000", transports: ["websocket"], allowUpgrades: false });

socket.on('connection', function (client) {
    client.on('message', function (event) {
        console.log('Received message from client!', event);
    });
    //broadcaster = setInterval(() => emitToClient(client), 1000);
    client.on('disconnect', function () {
        //clearInterval(broadcaster);
        console.log('Client has disconnected');
    });
});

/** Kafka setup **/

const PJsonParse = (json) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(json))
        } catch (e) {
            reject(e)
        }
    })
}
const run = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: kafkaConf.PCOP_KAFKA_ALERT_TOPIC, fromBeginning: true }) // kafkaConf.PCOP_KAFKA_ALERT_TOPIC

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
            PJsonParse(message.value.toString()).then(json => {
                addAlert(json);
            }).catch(err => console.error(err))
        },
    })
}
run().catch(console.error)