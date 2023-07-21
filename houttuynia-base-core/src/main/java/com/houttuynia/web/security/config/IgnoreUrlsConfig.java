package com.houttuynia.web.security.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * SpringSecurity白名单资源路径配置
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "config.security.ignored")
public class IgnoreUrlsConfig {

    private List<String> urls = new ArrayList<>();

}
