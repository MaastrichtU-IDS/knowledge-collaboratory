import os

import requests

from tests.conftest import check_trapi_compliance

PROD_API_URL = "https://api.collaboratory.semanticscience.org"
# PROD_API_URL = 'http://localhost:8808'


def test_post_trapi():
    """Test Translator ReasonerAPI query POST operation to get predictions"""
    headers = {"Content-type": "application/json"}

    for trapi_filename in os.listdir("tests/queries"):
        # for trapi_test in tests_list:
        # trapi_filename = 'tests/queries/trapi_' + trapi_test['class'] + '_limit' + str(trapi_test['limit']) + '.json'
        with open("tests/queries/" + trapi_filename) as f:
            trapi_query = f.read()
        print(PROD_API_URL)
        print(trapi_query)
        response = requests.post(
            PROD_API_URL + "/query", data=trapi_query, headers=headers
        )
        print("TRAPI results")
        print(response.json())
        edges = response.json()["message"]["knowledge_graph"]["edges"].items()

        # Validating attributes bug, the JSON schema only accepts subject, predicate, object. Which does not make sense
        # assert validate(trapi_results['message'], "Message", settings.TRAPI_VERSION_TEST) == None

        check_trapi_compliance(response)

        if trapi_filename.endswith("limit1.json"):
            assert len(edges) == 1
        else:
            assert len(edges) >= 2

        # assert edges[0]['object'] == 'https://identifiers.org/MONDO:0001158'
