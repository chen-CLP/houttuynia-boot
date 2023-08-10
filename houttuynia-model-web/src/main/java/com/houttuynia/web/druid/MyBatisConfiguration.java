package com.houttuynia.web.druid;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.*;

@Component
public class MyBatisConfiguration implements ApplicationRunner {
    private final Logger logger = LoggerFactory.getLogger(MyBatisConfiguration.class);
    @Resource
    private SqlSession sqlSession;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Configuration configuration = sqlSession.getConfiguration();
        String dynamicMapperXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<!DOCTYPE mapper\n" +
                "        PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\"\n" +
                "        \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">\n" +
                "<mapper namespace=\"com.houttuynia.web.system.mapper.SysMenuMapper1\">\n" +
                "    <select id=\"test\" resultType=\"com.houttuynia.web.system.vo.MenuVo\">\n" +
                "        SELECT *\n" +
                "        FROM sys_menu\n" +
                "    </select>\n" +
                "</mapper>\n";
        try (Reader reader = new StringReader(dynamicMapperXml)) {
            XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(reader, configuration, dynamicMapperXml, configuration.getSqlFragments());
            xmlMapperBuilder.parse();
        } catch (Exception e) {
        }
    }
}