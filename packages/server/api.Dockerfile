FROM node:18

# we need to install pnpm
RUN npm install -g pnpm

# specify working directory in the image
WORKDIR /usr/src/app

# copy from local to directory
COPY package*.json ./

# install the deps
RUN pnpm install

# copy all from local to working dir in the image
# (will be copied to /usr/src/app/...)
COPY . .

# build the typescript files
RUN pnpm run build

# command to the container upon spinning up
CMD ["node", "dist/main.js"]



