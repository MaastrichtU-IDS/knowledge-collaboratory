import logging
import os
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


def configure_otel(app):
    # open telemetry https://github.com/ranking-agent/aragorn/blob/main/src/otel_config.py#L4
    # https://ncatstranslator.github.io/TranslatorTechnicalDocumentation/deployment-guide/monitoring/
    # https://github.com/TranslatorSRI/Jaeger-demo
    if not os.environ.get('NO_JAEGER'):
        logging.info("starting up jaeger telemetry")
        import warnings
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry import trace
        from opentelemetry.exporter.jaeger.thrift import JaegerExporter
        from opentelemetry.sdk.resources import SERVICE_NAME as telemetery_service_name_key, Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor

        service_name = os.environ.get('OTEL_SERVICE_NAME', 'OPENPREDICT')
        # httpx connections need to be open a little longer by the otel decorators
        # but some libs display warnings of resource being unclosed.
        # these supresses such warnings.
        logging.captureWarnings(capture=True)
        warnings.filterwarnings("ignore",category=ResourceWarning)
        trace.set_tracer_provider(
            TracerProvider(
                resource=Resource.create({telemetery_service_name_key: service_name})
            )
        )
        jaeger_host = os.environ.get('JAEGER_HOST', 'jaeger-otel-agent.sri')
        jaeger_port = int(os.environ.get('JAEGER_PORT', '6831'))
        jaeger_exporter = JaegerExporter(
            agent_host_name=jaeger_host,
            agent_port=jaeger_port,
        )
        trace.get_tracer_provider().add_span_processor(
            BatchSpanProcessor(jaeger_exporter)
        )
        trace.get_tracer(__name__)
        FastAPIInstrumentor.instrument_app(app, excluded_urls="docs,openapi.json")
        HTTPXClientInstrumentor().instrument()

# Configure open telemetry if enabled
configure_otel(app)
