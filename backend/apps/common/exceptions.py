from rest_framework.views import exception_handler
from rest_framework import status
from .utils import api_response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        return api_response(
            success=False,
            data=None,
            error=response.data,
            status=response.status_code
        )
    
    return api_response(
        success=False,
        data=None,
        error={"message": str(exc)},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
