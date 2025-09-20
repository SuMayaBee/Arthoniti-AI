package com.aibusiness.namegenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessGenerationListResponse {
    private List<BusinessGenerationResponse> generations;
    private long total;
}