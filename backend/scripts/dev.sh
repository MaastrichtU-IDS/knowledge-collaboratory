#!/usr/bin/env bash

set -e

poetry run uvicorn app.main:app --reload "${@}"
