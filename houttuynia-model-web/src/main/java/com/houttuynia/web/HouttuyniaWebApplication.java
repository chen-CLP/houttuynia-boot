package com.houttuynia.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@EnableConfigurationProperties
@ConfigurationPropertiesScan
@ServletComponentScan
public class HouttuyniaWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(HouttuyniaWebApplication.class, args);
    }

}
