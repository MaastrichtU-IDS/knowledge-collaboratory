#!/usr/bin/env bash

set -e
set -x

poetry run pytest -s --cov=app --cov-report=term-missing app/tests "${@}"
