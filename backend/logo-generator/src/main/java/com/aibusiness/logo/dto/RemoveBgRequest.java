package com.aibusiness.logo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RemoveBgRequest {
    @JsonProperty("logo_id")
    private Long logoId;
}