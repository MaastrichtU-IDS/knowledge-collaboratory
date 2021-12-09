import os
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from reasoner_pydantic import Query, Message
from typing import Optional, List, Dict, Any

from app.config import settings

class TRAPI(FastAPI):
    """Translator Reasoner API - wrapper for FastAPI."""

    required_tags = [
        {"name": "trapi"},
        {"name": "nanopublication"},
        {"name": "login"},
        {"name": "translator"},
        {"name": "reasoner"},
    ]

    def __init__(
        self,
        *args,
        # contact: Optional[Dict[str, Any]] = None,
        **kwargs,
    ):
        super().__init__(
            *args,
            root_path_in_servers=False,
            **kwargs,
        )

        self.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def openapi(self) -> Dict[str, Any]:
        """Build custom OpenAPI schema."""
        if self.openapi_schema:
            return self.openapi_schema

        tags = self.required_tags
        if self.openapi_tags:
            tags += self.openapi_tags
    
        openapi_schema = get_openapi(
            title=settings.PROJECT_NAME, 
            version='1.0.0',
            openapi_version='3.0.1',
            description=f"""Knowledge Collaboratory API, to publish [Nanopublications](http://nanopub.org/wordpress/) and query the Nanopublications network using [Translator Reasoner API](https://github.com/NCATSTranslator/ReasonerAPI) queries (TRAPI).

To login, click on the **Authorize 🔓️** button, and use the 2nd option: **OpenIdConnect (OAuth2, implicit)**

You can access the web application at [{settings.FRONTEND_URL}]({settings.FRONTEND_URL})

[![Test production API](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/run-tests-prod.yml/badge.svg)](https://github.com/MaastrichtU-IDS/knowledge-collaboratory/actions/workflows/run-tests-prod.yml)

This service is supported by the [NIH NCATS Biomedical Data Translator project](https://ncats.nih.gov/translator/about)""",
            # terms_of_service = "https://github.com/MaastrichtU-IDS/knowledge-collaboratory/blob/main/LICENSE",
            # license_info = {
            #     "name": "MIT license",
            #     "url": "https://github.com/MaastrichtU-IDS/knowledge-collaboratory/blob/main/LICENSE"
            # },
            routes=self.routes,
            tags=tags,
        )

        if os.getenv('LETSENCRYPT_HOST'):
            # Retrieving URL used for nginx reverse proxy
            openapi_schema["servers"] = [
                {
                    "url": 'https://' + os.getenv('LETSENCRYPT_HOST'),
                    "description": 'Production Knowledge Collaboratory API',
                    "x-maturity": 'production',
                    "x-location": 'IDS'
                }
            ]

        openapi_schema["info"]["x-translator"] = {
            "component": 'KP',
            "team": "Clinical Data Provider",
            "biolink-version": "1.8.2",
            "infores": 'infores:knowledge-collaboratory',
            "externalDocs": {
                "description": "The values for component and team are restricted according to this external JSON schema. See schema and examples at url",
                "url": "https://github.com/NCATSTranslator/translator_extensions/blob/production/x-translator/",
            },
        }
        openapi_schema["info"]["x-trapi"] = {
            "version": "1.2.0",
            "operations": [
                "lookup",
            ],
            "externalDocs": {
                "description": "The values for version are restricted according to the regex in this external JSON schema. See schema and examples at url",
                "url": "https://github.com/NCATSTranslator/translator_extensions/blob/production/x-trapi/",
            },
        }

        openapi_schema["info"]["contact"] = {
            "name": "Vincent Emonet",
            "email": "vincent.emonet@maastrichtuniversity.nl",
            # "x-id": "vemonet",
            "x-role": "responsible developer",
        }
        openapi_schema["info"]["termsOfService"] = 'https://raw.githubusercontent.com/MaastrichtU-IDS/translator-openpredict/master/LICENSE'
        openapi_schema["info"]["license"] = {
            "name": "MIT license",
            "url": "https://opensource.org/licenses/MIT",
        }
        
        # From fastapi:
        openapi_schema["info"]["x-logo"] = {
            # "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
            "url": "https://raw.githubusercontent.com/MaastrichtU-IDS/dsri-documentation/master/website/static/img/um_logo.png"
        }

        self.openapi_schema = openapi_schema
        return self.openapi_schema


TRAPI_EXAMPLE = {
  "message": {
    "query_graph": {
      "edges": {
        "e01": {
          "object": "n1",
          "predicates": [
            "biolink:treats"
          ],
          "subject": "n0"
        }
      },
      "nodes": {
        "n0": {
          "categories": [
            "biolink:Drug",
            "biolink:ChemicalSubstance"
          ],
          "ids": [
            "DRUGBANK:DB00394",
            "CHEBI:75725"
          ]
        },
        "n1": {
          "categories": [
            "biolink:Disease"
          ]
        }
      }
    }
  },
  "query_options": {
    "n_results": 30
  }
}