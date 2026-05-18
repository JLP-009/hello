from fastapi import APIRouter
from strategies.templates import STRATEGY_TEMPLATES

router = APIRouter()

@router.get("/templates")
def templates():
    return STRATEGY_TEMPLATES
