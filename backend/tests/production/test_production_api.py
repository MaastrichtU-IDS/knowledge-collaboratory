import os

import requests

from tests.conftest import check_trapi_compliance


def test_post_trapi(pytestconfig):
    """Test Translator ReasonerAPI query POST operation to get predictions"""
    print(f'🧪 Testing API: {pytestconfig.getoption("server")}')
    headers = {"Content-type": "application/json"}

    for trapi_filename in os.listdir("tests/queries"):
        with open("tests/queries/" + trapi_filename) as f:
            trapi_query = f.read()
        print(trapi_query)
        response = requests.post(
            pytestconfig.getoption("server") + "/query", data=trapi_query, headers=headers
        )
        print("TRAPI results", response.json())
        edges = response.json()["message"]["knowledge_graph"]["edges"].items()

        # Validating attributes bug, the JSON schema only accepts subject, predicate, object. Which does not make sense
        # assert validate(trapi_results['message'], "Message", settings.TRAPI_VERSION_TEST) == None

        check_trapi_compliance(response)

        if trapi_filename.endswith("limit1.json"):
            assert len(edges) == 1
        else:
            assert len(edges) >= 2

        # assert edges[0]['object'] == 'https://identifiers.org/MONDO:0001158'
