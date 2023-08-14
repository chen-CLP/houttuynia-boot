package com.houttuynia.web.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据接口表
 * @TableName sys_api
 */
@TableName(value ="sys_api")
@Data
public class SysApiDO implements Serializable {
    /**
     * 
     */
    @TableId
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

    /**
     * 
     */
    private Date createTime;

    /**
     * 
     */
    private Date updateTime;

    /**
     * 
     */
    private String createBy;

    /**
     * 
     */
    private String updateBy;

    /**
     * 逻辑删除标识
     */
    private Integer delFlag;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}