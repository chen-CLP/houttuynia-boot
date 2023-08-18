package com.houttuynia.web.mybatis;

import com.houttuynia.core.utils.SqlUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.parsing.XNode;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Component;

import java.io.Reader;
import java.io.StringReader;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

/**
 * MyBatisXmlReload
 * 重新加载mbatis的xml文件
 *
 * @author clp
 * @date 2023-8-18 16:02
 */
@Component
@Slf4j
public class MyBatisXmlReload {
    /**
     * 对多数据源操作
     */
    private List<SqlSessionFactory> sqlSessionFactoryList;

    MyBatisXmlReload(List<SqlSessionFactory> sqlSessionFactoryList) {
        this.sqlSessionFactoryList = sqlSessionFactoryList;
    }

    /**
     * 移除内存中的xml
     *
     * @param spaceId
     */
    public void removeXmlByNameSpaceId(String spaceId) {
        this.sqlSessionFactoryList.forEach(item -> {
            try {
                Configuration configuration = item.getConfiguration();
                Map<String, ResultMap> resultMaps = (Map<String, ResultMap>) getFieldValue(configuration, configuration.getClass(), "resultMaps");
                Map<String, XNode> sqlFragmentsMaps = (Map<String, XNode>) getFieldValue(configuration, configuration.getClass(), "sqlFragments");
                Map<String, MappedStatement> mappedStatementMaps = (Map<String, MappedStatement>) getFieldValue(configuration, configuration.getClass(), "mappedStatements");
                resultMaps.remove(spaceId);
                sqlFragmentsMaps.remove(spaceId);
                mappedStatementMaps.remove(spaceId);
            } catch (Exception e) {
                log.error("移除xml失败：{} 错误：{}", spaceId, e);
            }
        });
    }

    /**
     * 加载xml文件
     *
     * @param xml
     */
    public void addXml(String xml) {
        this.sqlSessionFactoryList.forEach(item -> {
            Configuration configuration = item.getConfiguration();
            try (Reader reader = new StringReader(xml)) {
                XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(reader, configuration, xml, configuration.getSqlFragments());
                xmlMapperBuilder.parse();
            } catch (Exception e) {
                log.error("动态sql添加失败：info:{} error:{}", item, e.getMessage());
            }
        });
    }

    /**
     * 重新加载
     *
     * @param id
     * @param sqlXml
     */
    public void reload(String id, String sqlXml) {
        this.removeXmlByNameSpaceId(id);
        this.addXml(sqlXml);
    }

    /**
     * 通过反思获取目标的字段信息
     *
     * @param targetConfiguration
     * @param aClass
     * @param filed
     * @return
     * @throws NoSuchFieldException
     * @throws IllegalAccessException
     */
    private static Object getFieldValue(Configuration targetConfiguration, Class<?> aClass,
                                        String filed) throws NoSuchFieldException, IllegalAccessException {
        Field resultMapsField = aClass.getDeclaredField(filed);
        resultMapsField.setAccessible(true);
        return resultMapsField.get(targetConfiguration);
    }


}
