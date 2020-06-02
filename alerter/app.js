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
            mailer.sendMail({ subject: "New Alert !", body: message.value.toString() });
        },
    })
}

run().catch(console.error)