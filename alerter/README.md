Prestacoop Alerter
==================

Prestacoop Alerter is a node.js application which sends emails upon incoming messages from a kafka stream.

# Get started

## Creditentials

change the .env_example to .env and fill the contained variables (do not add the filled variables to the repo)

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
- dotenv

(see package.json for more informations)