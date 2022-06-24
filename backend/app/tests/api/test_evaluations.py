# from typing import Dict
import json

import pytest

# from app.tests.conftest import client
from app.config import settings

# from httpx import AsyncClient
from fastapi.testclient import TestClient

# from app.api.evaluations import create_evaluation

# https://fastapi.tiangolo.com/advanced/async-tests/

# pytestmark = pytest.mark.anyio

# def test_evaluation_get(test_client) -> None:
#     r = test_client.get(f"{settings.API_PATH}/evaluations")
#     results = r.json()
#     # assert len(results[0]['assessments']) > 2
#     assert r.status_code == 200

## Celery seems to not work in GitHub Actions workflow
# def test_evaluation_create(test_client) -> None:
#     eval_data = {
#         "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
#         "collection": "fair-metrics"
#     }

#     r = test_client.post(f"{settings.API_PATH}/evaluations",
#         data=json.dumps(eval_data),
#         headers={"Accept": "application/json"}
#     )
#     results = r.json()
#     assert r.status_code == 200
#     assert len(results['results']) > 2
