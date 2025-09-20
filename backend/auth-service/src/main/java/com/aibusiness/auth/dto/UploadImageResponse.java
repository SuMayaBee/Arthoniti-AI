package com.aibusiness.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadImageResponse {
    private String message;
    private String imageUrl;
    private UserDto user;
}