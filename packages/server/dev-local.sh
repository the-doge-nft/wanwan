#!/bin/bash

# dev-local.sh
# interact with the local docker project

set -eu

export SCRIPTPATH="$(
    cd "$(dirname "$0")" >/dev/null 2>&1
    pwd -P
)"

__spacedEcho() {
    echo ""
    echo "$1"
    echo ""
}

__removePreviousBuildMaybe() {
    if [ -d "$SCRIPTPATH/dist" ]; then
        __spacedEcho "removing old dist"
        rm -r -f dist/
    fi
}

__depsUp() {
    __spacedEcho "spinning up db"
    docker-compose up -d postgres

    __spacedEcho "spinning up redis"
    docker-compose up -d redis
}

up() {
    __removePreviousBuildMaybe
    __depsUp

    sleep 2

    dbMigrateDev
    dbSeed

    __spacedEcho "spinning up api"
    npm run start:dev
}

down() {
    __spacedEcho "bringing down db, redis, & api"
    docker-compose down --remove-orphans -v
}

dbPush() {
    __spacedEcho "pushing db"
    npm run prisma:push
}

dbSeed() {
    __spacedEcho "seeding db"
    npm run prisma:seed
}

dbMigrateDev() {
    __spacedEcho "migrating db"
    npm run prisma:migrate:dev
}

dbGenerate() {
    __spacedEcho "generating prisma client"
    npm run prisma:generate
}

repl() {
    npm run start:repl
}

test() {
    npm run test
}

e2e() {
    npm run test:e2e
}

usage() {
    cat <<HELP_USAGE
Usage:

    dev-local.sh up:
        spins up containers for local development
        
    dev-local.sh down:
        pulls down local development containers

    dev-local.sh dbpush:
        push changes to db without creating a prisma migration - NOTE: this should be used for prototyping in development only

    dev-local.sh dbseed:
        seed data located in prisma/seed.ts to local database

    dev-local.sh dbmigratedev:
        create a prisma migration and apply it to the local database

    dev-local.sh repl:
        start a REPL for super dev powers. read more here: https://docs.nestjs.com/recipes/repl

    dev-local.sh test:
        run unit tests

    dev-local.sh e2e:
        run integration tests
HELP_USAGE
    exit 0
}

case $1 in
"down")
    down
    ;;

"up")
    if [[ "${2-""}" == "--build" ]]; then
        up "--build"
    else
        up
    fi
    ;;

"dbpush")
    dbPush
    ;;

"dbseed")
    dbSeed
    ;;

"dbgenerate")
    dbGenerate
    ;;

"dbmigratedev")
    dbMigrateDev
    ;;

"repl")
    repl
    ;;

"test")
    test
    ;;

"e2e")
    e2e
    ;;

"exec")
    exec "${@:2}"
    ;;

"--help")
    usage
    ;;

*)
    usage
    ;;
esac
