import os

from reasoner_validator import TRAPIResponseValidator
import requests


validator = TRAPIResponseValidator(
    trapi_version=settings.TRAPI_VERSION,

    # If omit or set the Biolink Model version parameter to None,
    # then the current Biolink Model Toolkit default release applies
    biolink_version=settings.BIOLINK_VERSION,

    # 'sources' are set to trigger checking of expected edge knowledge source provenance
    sources={
            # "ara_source": "infores:molepro",
            # "kp_source": "infores:knowledge-collaboratory",
            # "kp_source_type": "primary"
    },
    # Optional flag: if omitted or set to 'None', we let the system decide the
    # default validation strictness by validation context unless we override it here
    strict_validation=None
)

def check_trapi_compliance(response):
    validator.check_compliance_of_trapi_response(response.json()["message"])
    # validator.check_compliance_of_trapi_response(response.json())
    validator_resp = validator.get_messages()
    print("⚠️ REASONER VALIDATOR WARNINGS:")
    print(validator_resp["warnings"])
    if len(validator_resp["errors"]) == 0:
        print("✅ NO REASONER VALIDATOR ERRORS")
    else:
        print("🧨 REASONER VALIDATOR ERRORS")
        print(validator_resp["errors"])
    assert (
        len(validator_resp["errors"]) == 0
    )


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
