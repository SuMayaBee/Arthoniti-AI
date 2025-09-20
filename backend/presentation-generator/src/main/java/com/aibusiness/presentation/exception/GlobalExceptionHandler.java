package com.aibusiness.presentation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PresentationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(PresentationNotFoundException ex) {
        return new ResponseEntity<>(Map.of("detail", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        // This is a simplified error response for the unified generator
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Failed to generate presentation: " + ex.getMessage(),
                    "database_error", ex.getMessage() // In a real app, you'd sanitize this
                ));
    }
}
