package com.aibusiness.namegenerator.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessGenerationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFoundException(BusinessGenerationNotFoundException ex) {
        return new ResponseEntity<>(Map.of("detail", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<Map<String, Object>> details = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            details.add(Map.of("loc", List.of("body", fieldName), "msg", errorMessage, "type", "value_error"));
        });
        return new ResponseEntity<>(Map.of("detail", details), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleGenericException(RuntimeException ex) {
        // Catches errors from the AI service or other unexpected issues
        return new ResponseEntity<>(Map.of("detail", "Failed to generate business names: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
