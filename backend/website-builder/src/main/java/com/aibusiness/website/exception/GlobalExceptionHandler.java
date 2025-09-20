package com.aibusiness.website.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ProjectNotFoundException ex) {
        return new ResponseEntity<>(Map.of("detail", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleGeneric(RuntimeException ex) {
        // Broad handler for AI errors, deployment errors, etc.
        return new ResponseEntity<>(Map.of("detail", ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
