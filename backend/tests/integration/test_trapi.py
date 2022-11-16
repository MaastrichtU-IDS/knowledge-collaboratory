import json
import os

from fastapi.testclient import TestClient
# from reasoner_validator import validate

from app.config import settings

# from src.api import start_api
from app.main import app
# from tests.conftest import validator


client = TestClient(app)


def test_post_trapi():
    """Test Translator ReasonerAPI query POST operation to get predictions"""
    print(f"Testing for TRAPI version {settings.TRAPI_VERSION_TEST} 🏷️")
    url = "/query"

    for trapi_filename in os.listdir("tests/queries"):
        with open("tests/queries/" + trapi_filename, "r") as f:
            print(f"☑️ Testing {trapi_filename}")
            reasoner_query = f.read()
            response = client.post(
                url, data=reasoner_query, headers={"Content-Type": "application/json"}
            )

            # print(response.json)
            edges = response.json()["message"]["knowledge_graph"]["edges"].items()
            # print(response)
            # print(trapi_filename)

            # validator.check_compliance_of_trapi_response(message=response.json()["message"])
            # validator_resp = validator.get_messages()
            # print(validator_resp)
            # assert (
            #     len(validator_resp["errors"]) == 0
            # )
            if trapi_filename.endswith("limit3.json"):
                assert len(edges) == 3
            elif trapi_filename.endswith("limit1.json"):
                assert len(edges) == 1
            else:
                assert len(edges) >= 5


def test_trapi_empty_response():
    reasoner_query = {
        "message": {
            "query_graph": {
                "edges": {
                    "e00": {
                        "subject": "n00",
                        "object": "n01",
                        "predicates": ["biolink:physically_interacts_with"],
                    }
                },
                "nodes": {
                    "n00": {"ids": ["CHEMBL.COMPOUND:CHEMBL112"]},
                    "n01": {"categories": ["biolink:Protein"]},
                },
            }
        }
    }

    response = client.post(
        "/query",
        data=json.dumps(reasoner_query),
        headers={"Content-Type": "application/json"},
    )

    print(response.json())
    # assert (
    #     validate(response.json()["message"], "Message", settings.TRAPI_VERSION_TEST)
    #     == None
    # )
    # validator.check_compliance_of_trapi_response(message=response.json()["message"])
    # validator_resp = validator.get_messages()
    # print(validator_resp)
    # assert (
    #     len(validator_resp["errors"]) == 0
    # )
    assert len(response.json()["message"]["results"]) == 0
