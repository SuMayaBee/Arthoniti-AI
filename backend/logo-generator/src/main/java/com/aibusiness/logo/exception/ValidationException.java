package com.aibusiness.logo.exception;
import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {
    private final String fieldName;
    public ValidationException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
    }
}
