package com.houttuynia.core.utils;

/**
 * SqlUtils
 *
 * @author clp
 * @date 2023-8-14 16:29
 */
public final class SqlUtils {
    /**
     * 头部信息
     */
    private final static String XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<!DOCTYPE mapper  PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\" \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">";

    private final static String NAME_SPACE_PRE = "com.houttuynia.api.t";
    /**
     * 查询id
     */
    private final static String SELECT_ID = "select";

    /**
     * 构造动态xml
     *
     * @param id
     * @param sqlXml
     * @return
     */
    public static String createSQLXML(String id, String sqlXml) {
        String Xml = XML_HEADER +
                "<mapper namespace=\"" + NAME_SPACE_PRE + id + "\">\n" +
                "    <select id=\"" + SELECT_ID + "\" parameterType=\"map\" resultType=\"map\">\n" +
                sqlXml +
                "    </select>\n" +
                "</mapper>\n";
        return Xml;
    }

    /**
     * 获取查询path
     *
     * @param id
     * @return
     */
    public static String getSelectPath(String id) {
        return NAME_SPACE_PRE + id + "." + SELECT_ID;
    }
}
