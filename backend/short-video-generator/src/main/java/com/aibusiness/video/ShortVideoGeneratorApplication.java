package com.aibusiness.video;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableDiscoveryClient
@EnableAsync // Enable support for asynchronous methods
public class ShortVideoGeneratorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShortVideoGeneratorApplication.class, args);
    }

}
