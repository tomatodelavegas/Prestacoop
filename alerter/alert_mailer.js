var nodemailer = require('nodemailer');
const { mailerConf } = require("./config");

module.exports.sendMail = function (data) {
    var transporter = nodemailer.createTransport({
        host: mailerConf.PCOP_MAILER_HOST, //"smtp.gmail.com",
        auth: {
            type: mailerConf.PCOP_MAILER_TYPE, //"OAuth2",
            user: mailerConf.PCOP_MAILER_MAIL,
            clientId: mailerConf.PCOP_MAILER_CLIENT_ID,
            clientSecret: mailerConf.PCOP_MAILER_CLIENT_SECRET,
            refreshToken: mailerConf.PCOP_MAILER_REFRESH_TOKEN,
            accessToken: mailerConf.PCOP_MAILER_ACCESS_TOKEN
        }
    });
    var message = {
        from: mailerConf.PCOP_MAILER_MAIL, // sender address  
        to: mailerConf.PCOP_MAILER_MAIL, // list of receivers (comma separated)
        subject: data.subject, // Subject line  
        text: data.body, // plaintext body  
        html: "<p>" + data.body + "</p>"
    }
    if (typeof data.subject !== 'undefined' && typeof data.body !== 'undefined') {
        // send mail with defined transport object  
        transporter.sendMail(message, function (error, info) {
            if (error) {
                console.log("Error");
                console.log(error);
            } else {
                console.log("Email Send");
                console.log(data);
            }
        });
    } else {
        console.log("illegal parameters !");
    }
};