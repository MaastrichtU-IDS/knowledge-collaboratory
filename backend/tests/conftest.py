# from typing import Dict, Generator

from app.config import settings


def pytest_addoption(parser):
    parser.addoption("--server", action="store", default='https://api.collaboratory.semanticscience.org')

# @pytest.fixture(scope="session")
# def test_client():
#     from app.main import app
#     with TestClient(app) as test_client:
#         yield test_client

