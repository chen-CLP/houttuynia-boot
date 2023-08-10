package com.houttuynia.web;

import cn.hutool.log.Log;
import com.houttuynia.web.system.mapper.SysMenuMapper;
import com.houttuynia.web.system.service.SysMenuService;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.sql.*;
import java.util.*;

@SpringBootTest
class HouttuyniaWebApplicationTest {
    @Resource
    private SysMenuService menuService;
    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private SqlSession sqlSession;

    @Resource
    private SysMenuMapper menuMapper;

    @Test
    void contextLoads() throws SQLException {
        String sqlQuery = "SELECT *  FROM sys_menu WHERE sys_menu.id != ?";
        List<Map<String, Object>> res = jdbcTemplate.execute(sqlQuery, (PreparedStatement ps) -> {
            ps.setInt(1, 1);
            try (ResultSet rs = ps.executeQuery()) {
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();
                List<String> fields = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    String fieldName = metaData.getColumnLabel(i);
                    fields.add(fieldName);
                }
                List<Map<String, Object>> results = new ArrayList<>();
                while (rs.next()) {
                    Map<String, Object> tmObj = new HashMap<>();
                    fields.forEach(itemField -> {
                        try {
                            tmObj.put(itemField, rs.getObject(itemField));
                        } catch (SQLException e) {
                            throw new RuntimeException(e);
                        }
                    });
                    results.add(tmObj);
                }
                return results;
            } catch (Exception e) {
                return null;
            }
        });
    }

    @Test
    public void testSql() {
        sqlSession.selectList("com.houttuynia.web.system.mapper.SysMenuMapper.test");
    }

    @Test
    public void testAutoXml() {
        sqlSession.selectList("com.houttuynia.web.system.mapper.SysMenuMapper1.test");
    }

}
