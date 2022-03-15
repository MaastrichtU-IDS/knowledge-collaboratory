#!/bin/bash

# Build with cache:
ssh ids2 'cd /data/deploy-services/knowledge-collaboratory ; git pull ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --force-recreate --build -d'

# Build without cache:
# ssh ids2 'cd /data/deploy-services/knowledge-collaboratory ; git pull ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml build ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml down ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --force-recreate -d'
