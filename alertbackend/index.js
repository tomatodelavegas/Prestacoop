const socketio = require("socket.io");
const express = require("express");
const assert = require("assert");
const { mongoConf, serverConf, kafkaConf } = require("./config");
const { Kafka } = require('kafkajs');
const { MongoClient, ObjectId } = require('mongodb');

/** Express server **/
let app = express();

/** kafka **/
const kafka = new Kafka({
    clientId: 'backendalerter',
    brokers: [kafkaConf.PCOP_KAFKA_HOST_NAME + ':9092']
});
const consumer = kafka.consumer({ groupId: 'backend-group' });

/**
let alerts = [
    {
        id: 0,
        Issue_Date: "04/06/2020",
        Plate_ID: "GGY6450",
        Violation_Code: -1,
        Vehicle_Body_Type: "SUBN",
        Street_Code1: 20390,
        Street_Code2: 29890,
        Street_Code3: 31490,
        Violation_Time: "0800A",
        Violation_County: "NY",
        Registration_State: "NY"
    },
    {
        id: 1,
        Issue_Date: "04/06/2020",
        Plate_ID: "GGY6450",
        Violation_Code: -1,
        Vehicle_Body_Type: "SUBN",
        Street_Code1: 20390,
        Street_Code2: 29890,
        Street_Code3: 31490,
        Violation_Time: "0805A",
        Violation_County: "NY",
        Registration_State: "NY"
    }
];**/

// socket io

const sendNotif = () => {
    const datenow = new Date().toLocaleString('en-GB');
    const msg = `New alert (${datenow}) !`;
    console.log("Emitting to clients !");
    socket.sockets.emit("FromAPI", msg);
}

const addAlert = async (alert) => {
    const client = await MongoClient.connect(mongourl);
    if (client == null)
        return res.status(500).send("Failed to connect to database");
    console.log("Connected successfully to mongodb");
    const db = client.db(mongodbname);
    const alertsColection = db.collection("alerts");
    alertsColection.insertOne(alert);
    client.close();
    sendNotif(); // informs frontend of the new alert
};

// mongo setup
const mongodbname = "alertdb";

let mongourl = `mongodb://${mongoConf.PCOP_MONGO_USERNAME}:${mongoConf.PCOP_MONGO_PWD}@${mongoConf.PCOP_MONGO_HOST_NAME}:${mongoConf.PCOP_MONGO_PORT}/${mongodbname}`;
console.log(mongourl);


/**
 ** Get all alerts
 **/
app.get("/", function (req, res) {
    let resArr = [];
    MongoClient.connect(mongourl, function (err, client) {
        assert.equal(null, err);
        const db = client.db(mongodbname);
        const alertsColection = db.collection("alerts");
        let cursor = alertsColection.find();
        cursor.forEach((doc, err) => {
            assert.equal(null, err);
            resArr.push(doc);
        }, () => {
            client.close();
            res.send(resArr);
        });
    });
});

/**
 ** Getting a specific alert by id
 **/
app.get("/:id", async function (req, res) {
    let id = req.params.id; // TODO: string -> int conversion checking
    try {
        let o_id = new ObjectId(id);
        const client = await MongoClient.connect(mongourl).catch(err => res.status(500).send(err));
        if (client == null)
            return res.status(500).send("Failed to connect to database");
        const db = client.db(mongodbname);
        const alertsColection = db.collection("alerts");
        const elm = await alertsColection.findOne({ _id: o_id }).catch(err => res.status(500).send(err));
        if (typeof client !== "undefined" && client)
            client.close();
        if (elm == null)
            return res.status(500).send(`No such element _id: ${id}`);
        res.send(elm);
    } catch (err) {
        if (typeof client !== "undefined" && client)
            client.close();
        res.status(500).send(`No such element _id: ${id}`);
    }
});

/** Backend server running **/
var server = app.listen(serverConf.PCOP_BACKEND_PORT, serverConf.PCOP_BACKEND_HOST_NAME, function () {
    console.log(`Server running http://${serverConf.PCOP_BACKEND_HOST_NAME}:${serverConf.PCOP_BACKEND_PORT}`);
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