from node:latest

COPY . .

COPY .env .env

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]