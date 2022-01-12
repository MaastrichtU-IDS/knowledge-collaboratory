#!/bin/bash

## Use cache:
ssh ids2 'cd /data/deploy-ids-tests/knowledge-collaboratory ; git pull ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml down ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --force-recreate --build -d'

## Build without cache:
# ssh ids3 'cd /data/deploy-ids-tests/knowledge-collaboratory ; git pull ; docker-compose down ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d'
