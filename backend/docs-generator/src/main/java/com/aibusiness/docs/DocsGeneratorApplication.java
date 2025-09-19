package com.aibusiness.docs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients // Must be enabled to use the LogoServiceClient
public class DocsGeneratorApplication {

    public static void main(String[] args) {
        SpringApplication.run(DocsGeneratorApplication.class, args);
    }

}
