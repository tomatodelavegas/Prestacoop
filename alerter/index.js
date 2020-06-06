//const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const assert = require("assert");
const { MongoClient } = require('mongodb');
let app = express();



// server setup with express JS

let hostname = "localhost";
let port = 80;

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
];

let alertsid = [0, 1];

app.get("/", function (req, res) {
    res.send(alertsid); // TODO: send db ids with time
});

app.get("/:id", function (req, res) {
    let id = req.params.id; // TODO: string -> int conversion checking
    if (id >= alerts.length || id < 0) {
        console.error(`Invalid id ${id}`);
        res.status(500).send(`Invalid id ${id}`);
    }
    res.send(alerts[id]);
});

var server = app.listen(port, hostname, function () {
    console.log(`Server running http://${hostname}:${port}`);
});

/**
let server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World !\n");
});

server.listen(port, hostname, () => {
    console.log(`Server running http://${hostname}:${port}`);
});**/

// socket io

let socket = socketio.listen(server);
let broadcaster;

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

broadcaster = setInterval(() => {
    const datenow = new Date().toLocaleString('en-GB');
    const msg = `New alert (${datenow}) !`;
    console.log("Emitting to clients !");
    socket.sockets.emit("FromAPI", msg);
    //sckt.emit("FromAPI", msg);//clients); // .broadcast to broadcast to all clients
    //socket.broadcast.emit("FromAPI", msg);
}, 5000);

// mongo setup
// TODO: dotenv package
const mongohostname = "192.168.99.100";
const mongoport = "27017";
const mongousername = "LT.User1";
const mongopwd = "PoliceOffice";
const mongodbname = "alertdb";

let mongourl = `mongodb://${mongousername}:${mongopwd}@${mongohostname}:${mongoport}/${mongodbname}`;

console.log(mongourl);

MongoClient.connect(mongourl, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to mongodb");

    const db = client.db(mongodbname);
    const alertsColection = db.collection("alerts");

    alertsColection.insertOne(alerts[0]);

    client.close();
});