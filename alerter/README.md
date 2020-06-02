Prestacoop Alerter
==================

Prestacoop Alerter is a node.js application which sends emails upon incoming messages from a kafka stream.

# Get started

## Creditentials

change the following variables with true creditentials

```
export PCOP_MAILER_MAIL="yourmail@gmail.com"
export PCOP_MAILER_CLIENT_ID="yourclientid"
export PCOP_MAILER_CLIENT_SECRET="yourclientsecret"
export PCOP_MAILER_ACCESS_TOKEN="youraccesstoken"
export PCOP_MAILER_REFRESH_TOKEN="yourrefreshtoken"
```

NB: we might be considering using dotenv package with .env file

## Installing

Our app requires nodejs and yarn/npm to be installed on your machine.

```
yarn install # or npm install -g
node ./app.js
```

then start publishing messages to the stream

# Dependencies

Built using:
- kafkajs
- nodemailer

(see package.json for more informations)