import pytest
from fastapi.testclient import TestClient
import os
import json
# from reasoner_validator import validate
# from src.api import start_api
from src.main import app


VALIDATE_TRAPI_VERSION="1.2.0"


# # os.chdir('../..')
# # Create and start Flask from openapi.yml before running tests
# flask_app = connexion.FlaskApp(__name__)
# flask_app.add_api('../../src/openapi.yml')
# # flask_app = start_api(8808, server_url, debug)
# @pytest.fixture(scope='module')
# def client():
#     with flask_app.app.test_client() as c:
#         yield c

client = TestClient(app)


def test_post_trapi():
    """Test Translator ReasonerAPI query POST operation to get predictions"""
    url = '/query'

    for trapi_filename in os.listdir('tests/queries'):
        with open('tests/queries/' + trapi_filename,'r') as f:
            reasoner_query = f.read()
            response = client.post(url, 
                                    data=reasoner_query, 
                                    headers={"Content-Type": "application/json"})

            # print(response.json)
            edges = response.json()['message']['knowledge_graph']['edges'].items()
            # print(response)
            print(trapi_filename)
            # assert validate(response.json['message'], "Message", VALIDATE_TRAPI_VERSION) == None
            if trapi_filename.endswith('limit3.json'):
                assert len(edges) == 3
            elif trapi_filename.endswith('limit1.json'):
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
                        "predicates": ["biolink:physically_interacts_with"]
                    }
                },
                "nodes": {
                    "n00": {
                        "ids": ["CHEMBL.COMPOUND:CHEMBL112"]
                    },
                    "n01": {
                        "categories": ["biolink:Protein"]
                    }
                }
            }
        }
    }

    response = client.post('/query',
        data=json.dumps(reasoner_query),
        headers={"Content-Type": "application/json"})

    print(response.json())
    # assert validate(response.json['message'], "Message", VALIDATE_TRAPI_VERSION) == None
    assert len(response.json()['message']['results']) == 0
