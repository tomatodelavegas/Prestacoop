const { sqlConf } = require("./config");
var mysql = require('mysql');

/** mysql **/

const sqldbname = "prestacoop";
//const sqlurl = sqlConf.PCOP_SQL_HOST_NAME + ":" + sqlConf.PCOP_SQL_PORT;
const sqlurl = "mysql_db";
console.log(sqlurl);

var connection = mysql.createConnection({
    host: sqlurl,
    user: sqlConf.PCOP_SQL_USERNAME,
    password: sqlConf.PCOP_SQL_PWD,
    database: sqldbname
});

connection.connect((err) => {
    if (err)
        throw err;
    console.log("Connected to mysql");
});

const querydb = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err)
                return reject(err);
            return resolve(results);
        });
    });
}

module.exports = querydb;