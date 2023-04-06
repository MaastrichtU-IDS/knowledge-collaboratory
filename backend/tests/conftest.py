# from typing import Dict, Generator

from app.config import settings
from reasoner_validator import TRAPIResponseValidator

# from app.main import app
# from app.config import settings

# client = TestClient(app)


# @pytest.fixture(scope="session")
# def test_client():
#     from app.main import app
#     with TestClient(app) as test_client:
#         yield test_client

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
