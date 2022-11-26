FROM node:18-alpine as development

# we need pnpm first
RUN npm install -g pnpm
WORKDIR /usr/src/app
# copy package.json and package-lock.json to the container
COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
# install the deps
RUN pnpm install --frozen-lockfile
# copy app sauce
COPY --chown=node:node . .
USER node

###########################################################

FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
# in order to run 'nest build' we must have 'nest' installed which is a dev dependency
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . . 
RUN pnpm run build
ENV NODE_ENV production
RUN pnpm install --frozen-lockfile --only=production && pnpm cache clean --force
USER node

###########################################################

FROM node:18-alpine as production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]

