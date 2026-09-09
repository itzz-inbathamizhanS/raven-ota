"""Custom exceptions and FastAPI exception handlers."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class RavenException(Exception):
    """Base exception for RAVEN-OTA."""

    def __init__(self, detail: str, status_code: int = 500):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class NotFoundError(RavenException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            detail=f"{resource} '{resource_id}' not found",
            status_code=404,
        )


class ValidationError(RavenException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=422)


def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers on the FastAPI app."""

    @app.exception_handler(RavenException)
    async def raven_exception_handler(request: Request, exc: RavenException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"},
        )
