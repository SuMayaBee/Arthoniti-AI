package com.aibusiness.auth.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String imageUrl;
}