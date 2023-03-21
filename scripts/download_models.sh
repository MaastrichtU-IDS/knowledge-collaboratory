#! /usr/bin/env bash

mkdir -p /data/knowledge-collaboratory/ner-models
cd /data/knowledge-collaboratory/ner-models
wget https://download.dumontierlab.com/ner-models/litcoin-ner-model.zip
wget https://download.dumontierlab.com/ner-models/litcoin-relations-extraction-model.zip
unzip "*.zip"
rm *.zip