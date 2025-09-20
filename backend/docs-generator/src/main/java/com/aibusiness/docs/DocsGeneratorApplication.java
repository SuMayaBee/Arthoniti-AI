package com.aibusiness.docs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DocsGeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocsGeneratorApplication.class, args);
	}

}

