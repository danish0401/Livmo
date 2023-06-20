FROM node:18-alpine

WORKDIR /usr/src/server

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["node", "server.js"]
