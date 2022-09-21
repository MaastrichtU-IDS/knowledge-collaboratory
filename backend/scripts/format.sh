#!/bin/sh -e
set -x

poetry run autoflake --remove-all-unused-imports --recursive --remove-unused-variables --in-place app tests --exclude=__init__.py
poetry run black app tests
poetry run isort .
