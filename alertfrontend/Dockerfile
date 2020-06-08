# npm + node
FROM node:10-alpine as build
# creating nodes_module folder in app directory + permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./package.json .
# root of all evil
USER node
# actually installing the dependencies...
RUN npm install
# copy our code TODO: check if this copies src/* and public/*
COPY --chown=node:node . .
# Dev or production ? (or npm run build) ?
RUN npm run build

# ports
# PCOP_BACKEND_PORT
#EXPOSE 3001
#CMD [ "npm", "start" ]

# nginx server
FROM nginx:stable-alpine
COPY --from=build /home/node/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]