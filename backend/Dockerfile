FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app/

ENV PYTHONUNBUFFERED='1'

# Install Poetry
# ENV POETRY_VERSION=1.2.0
# RUN curl -sSL https://install.python-poetry.org | python - --version $POETRY_VERSION
# ENV PATH=/root/.local/bin:$PATH
# RUN poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
# COPY ./pyproject.toml ./poetry.lock* /app/

# COPY ./pySHACL /app/

# # Allow installing dev dependencies to run tests
# ARG INSTALL_DEV=false
# RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then poetry install --no-root ; else poetry install --no-root --no-dev ; fi"

# For development, Jupyter remote kernel, Hydrogen
# Using inside the container:
# jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
# ARG INSTALL_JUPYTER=false
# RUN bash -c "if [ $INSTALL_JUPYTER == 'true' ] ; then pip install jupyterlab ; fi"

# Download some spacy required data
# RUN python -m spacy download en_core_web_trf

RUN pip install --upgrade pip

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . /app/

RUN pip install -e ".[app]"

ENV PYTHONPATH=/app
# ENV PORT=8000
