import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    API_PATH: str = ""
    BASE_URI: str = "https://w3id.org/collaboratory"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    DEV_MODE: bool = False

    # Those defaults are used by GitHub Actions for testing
    # The settings used by Docker deployment are in the .env file
    PROJECT_NAME: str = 'Knowledge Collaboratory API'
    KEYSTORE_PATH: str = "/data/nanopub-keystore"
    NER_MODELS_PATH: str = "/data/ner-models"

    # SERVER_NAME: str = 'localhost'
    # SERVER_HOST: AnyHttpUrl = 'http://localhost'

    FRONTEND_URL: str = 'http://localhost:19006'
    OAUTH_REDIRECT_FRONTEND: str = 'http://localhost:19006'

    ORCID_CLIENT_ID: Optional[str]
    ORCID_CLIENT_SECRET: Optional[str]
    OAUTH_REDIRECT_URI: str = 'http://localhost/api/auth'

    # MONGODB_URL: str = f'mongodb://root:oursecretkey@mongodb:27017/'

    # CONTEXT = 'https://raw.githubusercontent.com/MaastrichtU-IDS/knowledge-collaboratory/main/context.jsonld'
    

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)


    # SENTRY_DSN: Optional[HttpUrl] = None

    # @validator("SENTRY_DSN", pre=True)
    # def sentry_dsn_can_be_blank(cls, v: str) -> Optional[str]:
    #     if len(v) == 0:
    #         return None
    #     return v


    class Config:
        case_sensitive = True


settings = Settings()
