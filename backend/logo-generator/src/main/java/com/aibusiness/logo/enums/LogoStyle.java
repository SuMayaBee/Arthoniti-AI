package com.aibusiness.logo.enums;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum LogoStyle {
    CARTOON("Cartoon Logo"),
    APP("App Logo"),
    MODERN_MASCOT("Modern Mascot Logos"),
    BLACK_AND_WHITE_LINE("Black And White Line Logos"),
    MINIMALIST_ELEGANT("Minimalists and Elegant Logos"),
    VINTAGE_CUSTOM("Vintage Custom Logos"),
    MODERN_SHARP_LINED("Modern Sharp Lined Logos");

    @JsonValue
    private final String styleName;

    LogoStyle(String styleName) {
        this.styleName = styleName;
    }
}
