package com.aibusiness.docs.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DocumentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(DocumentNotFoundException ex) {
        return new ResponseEntity<>(Map.of("detail", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> Map.of(
                        "loc", List.of("body", fieldError.getField()),
                        "msg", fieldError.getDefaultMessage(),
                        "type", "value_error.missing"
                ))
                .collect(Collectors.toList());
        return new ResponseEntity<>(Map.of("detail", errors), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleGeneric(RuntimeException ex) {
        // This will catch AI generation failures, storage issues, etc.
        return new ResponseEntity<>(Map.of("detail", "An internal error occurred: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
