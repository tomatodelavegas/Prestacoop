Alert Backend
=============

Alert Backend is a Backend Nodejs webserver.
This webserver consumes kafka alert topic messages.
The consumed messages are inserted in a mongodb database.

Why mongodb:
- we should/could have instead gone with a SQL DB
- but bonuses are to try new stuff ;)
- it can be quite easily changed...

# Run

## Start mongodb

```
docker-compose up --build -d mongo mongo-express
docker-compose exec mongo sh
```

Now go to your browser to acces mongo-express: (${KAFKA_HOST_NAME:8081})
in mongo-express's interface add the "alertdb" database and inside it the "alerts" collection

Once inside the mongo docker shell:
```
$ mongo
$ use alertdb
$ db.createUser(
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
)
```

## Run it (no Docker)

Once mongodb is setup, the backend can be run:
(currently it is not dockerized)

```
cd alertbackend
npm install # or yarn install
node index.js
```

# Dependencies

- socket.io
- kafkajs
- express
- mongodb

See package.json for more infos