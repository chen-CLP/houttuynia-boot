package com.houttuynia.web.system.form;

import lombok.Data;

/**
 * ApiForm
 *
 * @author clp
 * @date 2023-8-14 15:38
 */
@Data
public class ApiForm {
    /**
     * id
     */
    private String id;
    /**
     * 接口名称
     */
    private String apiName;

    /**
     * 接口URL
     */
    private String apiUrl;

    /**
     * 接口描述
     */
    private String apiDesc;

    /**
     * SQL查询配置
     */
    private String sqlXml;

    /**
     * 参数字段信息
     */
    private String fieldInfo;
}
