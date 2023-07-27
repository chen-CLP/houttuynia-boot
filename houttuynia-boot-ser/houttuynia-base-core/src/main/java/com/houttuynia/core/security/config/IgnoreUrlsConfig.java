package com.houttuynia.core.security.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * SpringSecurity白名单资源路径配置
 */
@Component
@ConfigurationProperties(prefix = "config.security.ignored")
@Data
public class IgnoreUrlsConfig {
    private List<String> urls = new ArrayList<>();

}
