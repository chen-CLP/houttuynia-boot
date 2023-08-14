package com.houttuynia.web.druid;

import com.houttuynia.core.utils.SqlUtils;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.service.SysApiService;
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
import java.util.List;

@Component
public class MyBatisConfiguration implements ApplicationRunner {
    private final Logger logger = LoggerFactory.getLogger(MyBatisConfiguration.class);
    @Resource
    private SqlSession sqlSession;

    @Resource
    private SysApiService service;


    @Override
    public void run(ApplicationArguments args) throws Exception {
        Configuration configuration = sqlSession.getConfiguration();
        List<SysApiDO> apiList = service.list();
        apiList.forEach(item -> {
            String sqlXml = SqlUtils.createSQLXML(item.getId(), item.getSqlXml());
            try (Reader reader = new StringReader(sqlXml)) {
                XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(reader, configuration, sqlXml, configuration.getSqlFragments());
                xmlMapperBuilder.parse();
            } catch (Exception e) {
                logger.error("动态sql添加失败：info:{} error:{}", item, e.getMessage());
            }
        });
    }
}