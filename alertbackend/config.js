const dotenv = require('dotenv-safe');
// automatically loading the .env file, checking .env.example file
dotenv.config();

const host = '0.0.0.0'

module.exports = {
    sqlConf: {
        PCOP_SQL_HOST_NAME, // 192.168.99.100 or localhost
        PCOP_SQL_PORT, // 3306
        PCOP_SQL_USERNAME, // username
        PCOP_SQL_PWD // password
    } = process.env,
    kafkaConf: {
        PCOP_KAFKA_HOST_NAME, // 192.168.99.100 or localhost
        PCOP_KAFKA_ALERT_TOPIC // alert or test
    } = process.env,
    serverConf: {
        PCOP_BACKEND_HOST_NAME: host
    }
};