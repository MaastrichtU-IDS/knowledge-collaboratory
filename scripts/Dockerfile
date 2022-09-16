FROM python:3.8

WORKDIR /app

ADD . .

RUN pip install -e .

# ENTRYPOINT [ "python", "drug_indications_from_gdocs.py" ]
ENTRYPOINT [ "tail", "-f", "/dev/null" ]