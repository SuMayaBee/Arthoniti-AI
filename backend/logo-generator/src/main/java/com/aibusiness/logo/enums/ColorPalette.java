package com.aibusiness.logo.enums;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ColorPalette {
    NEON_POP("Neon Pop", "#FF0000, #00FF00, #D500FF, #FF00FF, #F6FF00"),
    DEEP_DUSK("Deep Dusk", "#112266, #3A176A, #782AB6, #B51FA7, #F70072"),
    SUNSET_SORBET("Sunset Sorbet", "#FF2350, #FF5D2A, #FF9945, #FFB347, #FFE156"),
    EMERALD_CITY("Emerald City", "#016A53, #019267, #01B087, #00C9A7, #16D5C7"),
    COFFEE_TONES("Coffee Tones", "#6A4E42, #7E5C4C, #9C6D59, #B08B74, #CDC1B5"),
    PURPLE_PARADE("Purple Parade", "#5C258D, #763AA6, #A25BCF, #C569E6, #E159F8");

    @JsonValue
    private final String paletteName;
    private final String colors;

    ColorPalette(String paletteName, String colors) {
        this.paletteName = paletteName;
        this.colors = colors;
    }
}
