package com.houttuynia.web.mybatis;

import com.houttuynia.core.utils.SqlUtils;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.service.SysApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

@Component
public class MyBatisConfiguration implements ApplicationRunner {
    private final Logger logger = LoggerFactory.getLogger(MyBatisConfiguration.class);
    @Resource
    private SysApiService service;
    @Resource
    private MyBatisXmlReload xmlReload;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<SysApiDO> apiList = service.list();
        apiList.forEach(item -> {
            String sqlXml = SqlUtils.createSQLXML(item.getId(), item.getSqlXml());
            xmlReload.addXml(sqlXml);
        });
    }
}