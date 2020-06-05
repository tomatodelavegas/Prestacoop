var nodemailer = require('nodemailer');
const Handlebars = require('handlebars'); // for html templating
const fs = require('fs'); // for loading html file
const previewEmail = require('preview-email'); // for email previews in debug
const { mailerConf } = require("./config");

// Loading and compiling the template Only once :)
const path = __dirname + "/views/index.html";
let template = Handlebars.compile(fs.readFileSync(path, { encoding: "utf-8", flag: "r" }));

module.exports = {
    sendMail: function (subject, data) {
        if (typeof subject !== 'undefined') {
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
            // TODO: replacements is data, rights issue with NYPD logo ?
            data.nypd_logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Patch_of_the_New_York_City_Police_Department.svg/langfr-800px-Patch_of_the_New_York_City_Police_Department.svg.png";//"cid:nypdlogo";
            //data.nypd_logo = __dirname + "\\images\\94941591197037168.png"; // or small : "https://www1.nyc.gov/favicon"
            let filledhtml = template(data);
            const message = {
                from: mailerConf.PCOP_MAILER_MAIL, // sender address  
                to: mailerConf.PCOP_MAILER_RECIPIENTS, // list of receivers (comma separated)
                subject: subject, // Subject line  
                html: filledhtml, ////text: // this is for plaintext body
                /**attachments: [{
                    filename: "94941591197037168.png",
                    path: __dirname + '/images/94941591197037168.png',
                    cid: 'nypdlogo' //same cid value as in the html img src
                }]**/
            }
            // send mail with defined transport object  
            if (mailerConf.PCOP_MAILER_DEBUG == "0") {
                transporter.sendMail(message, function (error, info) {
                    if (error) {
                        console.log("Error");
                        console.log({ error, info });
                    } else {
                        console.log("Email Send");
                        console.log({ subject, data });
                    }
                });
            } else {
                previewEmail(message).then(console.log).catch(console.error);
            }
        } else {
            throw new Error("illegal parameters");
        }
    }
};