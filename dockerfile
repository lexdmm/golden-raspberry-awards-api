FROM node:latest

WORKDIR /app

RUN mkdir -p /app

COPY package*.json /app/

RUN yarn cache clean \
  rm node_modules/ \
  yarn install --frozen-lockfile

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start:dev"]
