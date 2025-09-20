package com.aibusiness.presentation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PresentationGeneratorApplication {
    public static void main(String[] args) {
        SpringApplication.run(PresentationGeneratorApplication.class, args);
    }
}

