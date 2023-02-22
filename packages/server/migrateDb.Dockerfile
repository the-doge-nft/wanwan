FROM node:18.12.1-alpine3.16

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY ./prisma ./prisma
COPY ./.test.env ./.env

RUN pnpm install
RUN pnpm prisma:deploy
