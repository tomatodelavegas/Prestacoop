db.createUser(
    {
        user: "LT.User1",
        pwd: "PoliceOffice",
        roles: [
            {
                role: "readWrite",
                db: "alertdb"
            }
        ]
    }
);

//process.env.MONGO_INITDB_PASSWORD,
//process.env.MONGO_INITDB_ROOT_USERNAME,
//process.env.MONGO_INITDB_DATABASE
//console.log(process.env.MONGO_INITDB_ROOT_USERNAME);
//console.log(process.env.MONGO_INITDB_DATABASE);