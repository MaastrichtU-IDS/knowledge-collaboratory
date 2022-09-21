from typing import Optional

from pydantic import BaseModel, Field


class User(BaseModel):
    id: str
    sub: str = Field(...)
    name: Optional[str] = None
    family_name: Optional[str] = None
    given_name: Optional[str] = None
    # assessments: List[str] = []
