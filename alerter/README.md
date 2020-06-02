Prestacoop Alerter
==================

Prestacoop Alerter is a node.js application which sends emails upon incoming messages from a kafka stream.

# Get started

## Creditentials

change the .env_example to .env and fill the contained variables (do not add the filled variables to the repo)

## Installing (no Docker)

Our app requires nodejs and yarn/npm to be installed on your machine.

```
$ yarn install # or npm install -g
$ node ./app.js
```

then start publishing messages to the stream

## Docker install

```
$ docker build -t prestacoop_nodemailer_alerter . # thisis the docker way
$ docker-compose build alerter # docker-compose way
$ docker-compose up -d #or docker-compose up -d alerter
```

```
$ docker image ls
$ docker image rm ${IMG_ID}
```
to uninstall

# Dependencies

Built using:
- kafkajs
- nodemailer
- dotenv

(see package.json for more informations)