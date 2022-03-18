from fastapi import APIRouter

from app.api import login, nanopub, trapi, ner, validation

api_router = APIRouter()
api_router.include_router(ner.router, tags=["entity recognition"])
api_router.include_router(trapi.router)
api_router.include_router(nanopub.router, tags=["nanopublication"])
api_router.include_router(login.router, tags=["login"])
api_router.include_router(validation.router, tags=["validation"])
