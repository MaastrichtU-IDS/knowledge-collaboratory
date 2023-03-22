# Knowledge Collaboratory

[![Deploy frontend to GitHub Pages](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/deploy-frontend.yml) [![Test production API](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/test-prod.yml/badge.svg)](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/test-prod.yml) [![Run backend tests](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/test-backend.yml/badge.svg)](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/test-backend.yml) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/codeql-analysis.yml)

Services to query the Nanopublications network using Translator standards to retrieve the Knowledge Collaboratory graph, a collection of drug indications annotated using preferred identifiers (usually from MONDO, CHEBI, DrugBank, etc).

A website to enable users to easily annotate, publish and browse biomedical claims from natural language to a structured format recognized by the Translator. To publish new claims the users login with their ORCID, and submit the sentence they want to annotate, optionally providing an additional link to specify the provenance of this statement.

The model for annotating drug indications claims built for the LitCoin competition is used to automatically extract potential entities and relations. The SRI NameResolution API is then used to retrieve standard identifiers for each entities. And the BioLink model is used to define the relations between entities.

The extracted entities and relations are then displayed to the users on the website, and users can change the automatically generated claim to better reflect the emitted statement before publishing it to the Nanopublication network.

Backend built with [FastAPI](https://fastapi.tiangolo.com/), and [RDFLib](https://github.com/RDFLib/rdflib).

Frontend built with [Astro](https://astro.build/), [ReactJS](https://reactjs.org/), and [Material UI](https://mui.com/)

## 🌐 Public deployments

* Experimental frontend on GitHub Pages: https://maastrichtu-ids.github.io/knowledge-collaboratory (uses IDS server as backend)
* IDS servers: https://collaboratory.semanticscience.org
* Translator ITRB servers:
  * Test: https://collaboratory.test.transltr.io
  * CI: https://collaboratory.ci.transltr.io
  * Prod: https://collaboratory.transltr.io

## 📥️ Requirements

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/install/)

* [Poetry](https://python-poetry.org/) for backend development
* [Node.js](https://nodejs.org/en/) (with `npm`) and [`yarn`](https://yarnpkg.com/) if you need to do frontend development

## 🚀 Production deployment

Checkout the `docker-compose.prod.yml` file for more details about the deployment.

1. Create a `.env` file with your production settings:

```
ORCID_CLIENT_ID=APP-XXX
ORCID_CLIENT_SECRET=XXX
OPENAI_APIKEY=sk-XXX
FRONTEND_URL=https://collaboratory.semanticscience.org
```

2. Deploy the app with production config:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🐳 Local development

Requirements: python >=3.9 with [`hatch`](https://hatch.pypa.io/latest/), and node >=16 with [`yarn`](https://yarnpkg.com/)

⚠️ Create a `.env` file with your development settings in the `backend` folder of this repository:

```bash
ORCID_CLIENT_ID=APP-XXX
ORCID_CLIENT_SECRET=XXXX
OPENAI_APIKEY=sk-XXX
FRONTEND_URL=http://localhost:4000
DATA_PATH=./data
```

### Start the backend

Start the FastAPI python backend from the `backend/` folder:

```bash
cd backend
hatch run dev
```

### Start the frontend

Then install and start the react frontend with nextjs from the `frontend/` folder:

```bash
cd frontend
yarn
yarn dev
```

Now you can open your browser and interact with these URLs:

* Frontend: http://localhost:4000
* Backend OpenAPI documentation: http://localhost:8000/docs

## ✅ Tests

2 sets of tests are available: `integration` tests to test local changes, and `production` tests to test the API deployed in production

You can run the tests in docker when the backend is already running:

```bash
hatch run test tests/integration -s
```

Or locally directly with poetry:

```bash
hatch run test tests/integration -s
```

You can start a shell session with the new environment with:

```bash
hatch shell
```



## 🔧 Maintenance

### ⏫ Upgrade TRAPI version

Get the latest TRAPI YAML: https://github.com/NCATSTranslator/ReasonerAPI/blob/master/TranslatorReasonerAPI.yaml

For the OpenAPI specifications: change the `TRAPI_VERSION_TEST` in `backend/app/config.py`

For the reasoner_validator tests:

1. Change `TRAPI_VERSION_TEST` in `backend/app/config.py`

2. In `pyproject.toml` upgrade the version for the [reasoner-validator](https://pypi.org/project/reasoner-validator/)

3. Run the tests:

```bash
hatch run test tests/integration -s
```

## 🐳 Docker Compose files and env vars

There is a main `docker-compose.yml` file with all the configurations that apply to the whole stack, it is used automatically by `docker-compose`.

And there's also a `docker-compose.override.yml` with overrides for development, for example to mount the source code as a volume. It is used automatically by `docker-compose` to apply overrides on top of `docker-compose.yml`.

These Docker Compose files use the `.env` file containing configurations to be injected as environment variables in the containers.

They also use some additional configurations taken from environment variables set in the scripts before calling the `docker-compose` command.

It is all designed to support several "stages", like development, building, testing, and deployment. Also, allowing the deployment to different environments like staging and production (and you can add more environments very easily).

They are designed to have the minimum repetition of code and configurations, so that if you need to change something, you have to change it in the minimum amount of places. That's why files use environment variables that get auto-expanded. That way, if for example, you want to use a different domain, you can call the `docker-compose` command with a different `DOMAIN` environment variable instead of having to change the domain in several places inside the Docker Compose files.

Also, if you want to have another deployment environment, say `preprod`, you just have to change environment variables, but you can keep using the same Docker Compose files.

## 🔗 Links

Livestream logs:

* https://fastapi.tiangolo.com/advanced/websockets/
* https://amittallapragada.github.io/docker/fastapi/python/2020/12/23/server-side-events.html

Project bootstrapped with https://github.com/tiangolo/full-stack-fastapi-postgresql

## 🗃️ Current resources in the Collaboratory

- A dataset of 1971 drug indications retrieved from the [PREDICT publication](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3159979/) and used as reference dataset for the [OpenPredict model](https://github.com/MaastrichtU-IDS/translator-openpredict)
  - Published in Nanopub Index http://purl.org/np/RAWWaT9M_Nd8cVm_-amJErz60Ak__tkS6ROi2P-swdmMw
  - Containing the following subsets:
    - http://purl.org/np/RAVQGOE6nCeX6Tp1rqBOKleQElWhgb1PGHvbIvH1TCE1A
    - http://purl.org/np/RA556Vv9lmc7jqKZkRV_5CP8Xz4GZaVbgUdIsye7tynN0
- 324 [Off-label drug indications](https://docs.google.com/spreadsheets/d/1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE/edit#gid=428566902) found in PubMed publications
  - Published in Nanopub Index http://purl.org/np/RAaZp4akBZI6FuRzIpeksyYxTArOtxqmhuv9on-YssEzA
- Drug indications added by users (mainly from the default set of DailyMed indications proposed)
