package com.aibusiness.logo.exception;

import com.aibusiness.logo.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LogoNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleLogoNotFoundException(LogoNotFoundException ex) {
        return new ResponseEntity<>(Map.of("detail", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> handleValidationException(ValidationException ex) {
        // This structure matches the 422 error response in the documentation
        var errorDetail = Map.of(
                "loc", new String[]{"body", ex.getFieldName()},
                "msg", ex.getMessage(),
                "type", "value_error"
        );
        return new ResponseEntity<>(Map.of("detail", new Object[]{errorDetail}), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // Generic handler for AI generation failures or other unexpected errors
        return new ResponseEntity<>(Map.of("detail", "Failed to process request: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
