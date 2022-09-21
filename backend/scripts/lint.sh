#!/usr/bin/env bash

set -x

poetry run mypy .
poetry run black app --check
poetry run isort --check-only .
poetry run flake8
