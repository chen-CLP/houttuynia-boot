package com.houttuynia.web;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = "com.houttuynia.*")
@EnableConfigurationProperties
@ConfigurationPropertiesScan
@ServletComponentScan
@MapperScan("com.houttuynia.**.mapper")
public class HouttuyniaWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(HouttuyniaWebApplication.class, args);
    }

}
