#! /usr/bin/env bash
set -e

poetry run python ./app/initial_data.py

if  [[ $@ == -* ]] ;
then
    poetry run pytest -s --cov=app --cov-report=term-missing tests "${@}"
else
    # In case we pass a specific folder to test
    poetry run pytest -s --cov=app --cov-report=term-missing tests/"${@}"
fi

# bash ./scripts/test.sh "$@"
