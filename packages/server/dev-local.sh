#!/bin/bash

# dev-local.sh
# runs & brings down api and db docker containers
#
# Usage
#   ./dev-local.sh up
#   ./dev-local.sh down

set -eu

export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"


spacedEcho() {
    echo ""
    echo "$1"
    echo ""
}

removePreviousBuildMaybe() {
  if [ -d "$SCRIPTPATH/dist" ]
  then
    spacedEcho "removing old dist"
    rm -r dist/
  fi
}

up() {
    removePreviousBuildMaybe
    spinDownApiMaybe

    spacedEcho "spinning up db"
    docker-compose up -d postgres
    
    spacedEcho "spinning up redis"
    docker-compose up -d redis

    # spacedEcho "migrating local db"
    # yarn prisma:migratedev

    spacedEcho "spinning up api"
    if [[ "${1-false}" == true ]]; then
      spacedEcho "building api image"
      docker-compose up --build -d api;
    else
      docker-compose up -d api
    fi;

    spacedEcho "listening to logs"
    docker-compose logs -f
}

spinDownApiMaybe() {
    # https://serverfault.com/questions/789601/check-is-container-service-running-with-docker-compose
    if [ "$(docker ps -a | grep meme-api)" ]; then
        spacedEcho "api is up, spinning down first"
        docker-compose stop api
    fi
}

down() {
    spacedEcho "bringing down db, redis, & api"
    docker-compose down --remove-orphans -v
}

pushDb() {
    spacedEcho "pushing db"
    pnpm prisma:push
}

seedDb() {
    spacedEcho "seeding db"
    pnpm prisma:seed
}

usage() {
    cat <<HELP_USAGE
Usage:
    dev-local.sh up:
        spins up containers for local development
        
        --build: rebuilds the containers (this will be necessary if any new dependencies are added)

    dev-local.sh down:
        pulls down local development containers

    dev-local.sh dbpush:
        push changes to db without creating a prisma migration - NOTE: this should be used for prototyping in development only

    dev-local.sh dbseed:
        seed data located in prisma/seed.ts to local database
HELP_USAGE
    exit 0
}

if [[ $1 == "down" ]]; then
    down
elif [[ $1 == "up" ]]; then
    if [[ "${2-""}" == "--build" ]]; then
        up true
    else
        up
    fi
elif [[ $1 == "dbpush" ]]; then
    pushDb
elif [[ $1 == "dbseed" ]]; then
    seedDb
else
    usage
fi
