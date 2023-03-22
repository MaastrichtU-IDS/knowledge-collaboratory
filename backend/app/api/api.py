from fastapi import APIRouter

from app.api import login, nanopub, ner, openai, trapi

api_router = APIRouter()
api_router.include_router(ner.router, tags=["entity recognition"])
api_router.include_router(openai.router, tags=["entity recognition"])
api_router.include_router(trapi.router)
api_router.include_router(nanopub.router, tags=["nanopublication"])
api_router.include_router(login.router, tags=["login"])
