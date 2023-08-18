package com.houttuynia.web;

import com.houttuynia.core.utils.SocketUtil;
import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
@Slf4j
@SpringBootApplication(scanBasePackages = "com.houttuynia.*")
@EnableConfigurationProperties
@ConfigurationPropertiesScan
@ServletComponentScan
@MapperScan("com.houttuynia.**.mapper")
public class HouttuyniaWebApplication implements ApplicationRunner {
    @Value("${server.port:8080}")
    private Integer webPort;

    public static void main(String[] args) {
        SpringApplication.run(HouttuyniaWebApplication.class, args);
    }

    /**
     * 当启用dev配置时，如果配置端口被占用，会在8000～10000端口中随机选一个端口出来使用
     * @return
     */
    @Bean
    @ConditionalOnExpression(value = "#{'dev'.equals(environment.getProperty('spring.profiles.active'))}")
    public TomcatConnectorCustomizer customServerPortTomcatConnectorCustomizer() {
        // 开发环境时，首先判断8080d端口是否可用；若可用则直接使用，否则选择一个可用的端口号启动
        int port = SocketUtil.findAvailableTcpPort(8000, 10000, webPort);
        if (port != webPort) {
            log.info("默认端口号{}被占用，随机启用新端口号: {}", webPort, port);
            webPort = port;
        }
        return connector -> connector.setPort(port);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

    }
}
