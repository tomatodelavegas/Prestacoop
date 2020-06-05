const { Kafka } = require('kafkajs');
const mailer = require("./alert_mailer");
const { kafkaConf } = require("./config");

const kafka = new Kafka({
    clientId: 'nodemailer',
    brokers: [kafkaConf.PCOP_KAFKA_HOST_NAME + ':9092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    /**
    // Producing
    await producer.connect()
    await producer.send({
        topic: 'test',
        messages: [
            { value: 'Hello KafkaJS user!' },
        ],
    });
    **/

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
            // TODO: use Promise JSON.parse(message.value.toString())
            mailer.sendMail("New Alert !", { droneid: "142e1fa1", messageid: "1", statuscode: -1 });
        },
    })
}

run().catch(console.error)