package com.houttuynia.web.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfigurer implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // Set the allowed origin (or use "*") for all origins
                .allowedMethods("*") // Set the allowed HTTP methods
                .allowedHeaders("*") // Set the allowed headers (or use specific headers)
                .allowCredentials(true)
                .exposedHeaders("")
                .maxAge(3600L);
    }
}
