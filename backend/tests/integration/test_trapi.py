import json
import os

from app.config import settings
from app.main import app
from fastapi.testclient import TestClient

from tests.conftest import check_trapi_compliance

client = TestClient(app)


def test_post_trapi():
    """Test Translator ReasonerAPI query POST operation to get predictions"""
    print(f"Testing for TRAPI version {settings.TRAPI_VERSION_TEST} 🏷️")
    url = "/query"

    for trapi_filename in os.listdir("tests/queries"):
        with open("tests/queries/" + trapi_filename) as f:
            print(f"☑️ Testing {trapi_filename}")
            reasoner_query = f.read()
            response = client.post(
                url, data=reasoner_query, headers={"Content-Type": "application/json"}
            )
            edges = response.json()["message"]["knowledge_graph"]["edges"].items()

            print(trapi_filename)
            check_trapi_compliance(response)

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
    check_trapi_compliance(response)
    assert len(response.json()["message"]["results"]) == 0
