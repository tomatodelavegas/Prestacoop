# npm + node
FROM node:10-alpine
# creating nodes_module folder in app directory + permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./package.json .
# root of all evil
USER node
# actually installing the dependencies...
RUN npm install
# copy our code
COPY --chown=node:node . .
# ports
EXPOSE 3005
EXPOSE 25
CMD [ "node", "app.js" ]