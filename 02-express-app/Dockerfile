FROM node:18.19.0-buster

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY index.js index.js

EXPOSE 3000

CMD [ "node", "index.js" ]