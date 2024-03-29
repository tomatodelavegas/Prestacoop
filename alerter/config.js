const dotenv = require('dotenv-safe');
// automatically loading the .env file, checking .env.example file
dotenv.config();

// TODO: undefined env variable checking
module.exports = {
    mailerConf: {
        PCOP_MAILER_HOST, // smtp.gmail.com
        PCOP_MAILER_TYPE, // OAuth2
        PCOP_MAILER_MAIL, // account email (Prestacoop.gr4@gmail.com)
        PCOP_MAILER_CLIENT_ID, // OAuth2 client id
        PCOP_MAILER_CLIENT_SECRET, // OAuth2 secret client key
        PCOP_MAILER_ACCESS_TOKEN, // OAuth2 accesstoken
        PCOP_MAILER_REFRESH_TOKEN, // OAuth2 refreshtoken
        PCOP_MAILER_RECIPIENTS, // Recipients for emails
        PCOP_MAILER_DEBUG, // wether to preview mails or send emails
    } = process.env,
    kafkaConf: {
        PCOP_KAFKA_HOST_NAME, // 192.168.99.100 or localhost
        PCOP_KAFKA_ALERT_TOPIC // test
    } = process.env
};