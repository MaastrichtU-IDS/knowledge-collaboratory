from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from reasoner_pydantic import Query

from app.trapi.openapi import TRAPI_EXAMPLE
from app.trapi.reasonerapi_parser import get_metakg_from_nanopubs, reasonerapi_to_sparql

# from typing import Optional, Dict


router = APIRouter()


@router.post(
    "/query",
    name="Query the Nanopublication network with TRAPI",
    description="""Execute a Translator Reasoner API query against the Knowledge Collaboratory.
The following `query_options` are available:
```json
  "query_options": {
    "n_results": 30,
    "in_index": "http://purl.org/np/RAaZp4akBZI6FuRzIpeksyYxTArOtxqmhuv9on-YssEzA"
  }
```
""",
    response_model=Query,
    tags=["trapi"],
    # tags=["reasoner"],
)
def post_reasoner_query(
    request_body: Query = Body(..., example=TRAPI_EXAMPLE)
) -> Query:
    """Get associations for a given ReasonerAPI query.

    :param request_body: The ReasonerStdAPI query in JSON
    :return: Results as a ReasonerStdAPI Message
    """
    query_graph = request_body.message.query_graph.dict(exclude_none=True)
    print(query_graph)
    if len(query_graph["edges"]) == 0:
        return (
            {
                "status": 400,
                "title": "Bad Request",
                "detail": "No edges",
                "type": "about:blank",
            },
            400,
        )
    if len(query_graph["edges"]) > 1:
        return (
            {
                "status": 501,
                "title": "Not Implemented",
                "detail": "Multi-edges queries not yet implemented",
                "type": "about:blank",
            },
            501,
        )

    reasonerapi_response = reasonerapi_to_sparql(request_body.dict(exclude_none=True))
    # reasonerapi_response = request_body

    return JSONResponse(reasonerapi_response) or ("Not found", 404)


@router.get(
    "/meta_knowledge_graph",
    name="Get the meta knowledge graph of the Nanopublication network",
    description="Get the meta knowledge graph",
    response_model=dict,
    tags=["trapi"],
)
def get_meta_knowledge_graph() -> dict:
    """Get predicates and entities provided by the API

    :return: JSON with biolink entities
    """
    return get_metakg_from_nanopubs()
