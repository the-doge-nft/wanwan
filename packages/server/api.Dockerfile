# https://github.com/prisma/prisma/issues/16553#issuecomment-1353302617
FROM node:18.12.1-alpine3.16 as development

RUN npm install -g pnpm
WORKDIR /usr/src/app
# copy package.json and package-lock.json to the container
COPY --chown=node:node package.json ./package.json
COPY --chown=node:node pnpm-lock.yaml ./pnpm-lock.yaml
# copy app sauce
COPY --chown=node:node . .

# install the deps
RUN pnpm install

# generate prisma client
RUN pnpm run prisma:generate

###########################################################

FROM node:18.12.1-alpine3.16 as build
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY --chown=node:node --from=development /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=development /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
# in order to run 'nest build' we must have 'nest' installed which is a dev dependency
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN pnpm run build
ENV NODE_ENV production

###########################################################

FROM node:18.12.1-alpine3.16 as production
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
CMD ["pnpm", "start:migrate:prod"]
