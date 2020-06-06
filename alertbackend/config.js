const dotenv = require('dotenv-safe');
// automatically loading the .env file, checking .env.example file
dotenv.config();

module.exports = {
    mongoConf: {
        PCOP_MONGO_HOST_NAME, // 192.168.99.100 or localhost
        PCOP_MONGO_PORT, // 27017
        PCOP_MONGO_USERNAME, // username
        PCOP_MONGO_PWD // password
    } = process.env,
    serverConf: {
        PCOP_BACKEND_HOST_NAME, // nodocker: localhost
        PCOP_BACKEND_PORT // 80
    } = process.env,
    kafkaConf: {
        PCOP_KAFKA_HOST_NAME, // 192.168.99.100 or localhost
        PCOP_KAFKA_ALERT_TOPIC // alert or test
    } = process.env
};