FROM node:20.9.0-alpine

WORKDIR /app

COPY ./package*.json ./

RUN yarn install --production

COPY . .

CMD ["node","main.js"]