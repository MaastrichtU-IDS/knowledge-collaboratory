from fastapi.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api.api import api_router
from app.config import settings
from app.trapi.openapi import TRAPI

# app = FastAPI(
app = TRAPI(
    swagger_ui_init_oauth={
        # https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/
        # "usePkceWithAuthorizationCodeGrant": True,
        "clientId": settings.ORCID_CLIENT_ID,
        "scopes": "/authenticate",
        "appName": "Knowledge Collaboratory",
    },
)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(api_router, prefix=settings.API_PATH)

# app.add_event_handler("startup", connect_db)
# app.add_event_handler("shutdown", close_db)

# Set all CORS enabled origins
# if settings.BACKEND_CORS_ORIGINS:
app.add_middleware(
    CORSMiddleware,
    # allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", include_in_schema=False)
def health_check():
    """Health check for Translator elastic load balancer"""
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def redirect_root_to_docs():
    """Redirect the route / to /docs"""
    return RedirectResponse(url="/docs")
