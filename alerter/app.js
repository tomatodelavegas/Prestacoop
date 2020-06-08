const { Kafka } = require('kafkajs');
const mailer = require("./alert_mailer");
const { kafkaConf } = require("./config");

const kafka = new Kafka({
    clientId: 'nodemailer',
    brokers: [kafkaConf.PCOP_KAFKA_HOST_NAME + ':9092']
});

const consumer = kafka.consumer({ groupId: 'alerter' });

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
    await consumer.subscribe({ topic: kafkaConf.PCOP_KAFKA_ALERT_TOPIC, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
            PJsonParse(message.value.toString()).then(json => {
                let temp = {
                    droneid: "default",
                    issuedate: "01/01/2020",
                    statuscode: -1
                }
                if (json.hasOwnProperty("Drone_ID")) {
                    temp.droneid = json.Drone_ID;
                }
                if (json.hasOwnProperty("Violation_Code")) {
                    temp.statuscode = json.Violation_Code;
                }
                if (json.hasOwnProperty("Issue_Date")) {
                    temp.issuedate = json.Issue_Date;
                }
                mailer.sendMail(`New Alert from ${temp.droneid}`, temp);
            }).catch(err => console.error(err));
        },
    })
}

run().catch(console.error);