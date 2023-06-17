FROM node:16-alpine as builder

WORKDIR /usr/src/client/

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
