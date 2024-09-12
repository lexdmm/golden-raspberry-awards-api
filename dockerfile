FROM node:21-alpine

WORKDIR /awards

RUN npm install -g npm@latest

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

RUN yarn cache clean

CMD ["yarn", "run", "start:dev"]