package com.houttuynia.core.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * 部门表
 *
 * @TableName sys_depart
 */
@TableName(value = "sys_depart")
@Data
public class SysDepartDO implements Serializable {
    /**
     *
     */
    @TableId
    private String id;

    /**
     * 部门ID
     */
    private Long parentId;

    /**
     * 部门名称
     */
    private String departName;

    /**
     * 部门编码
     */
    private String departCode;

    /**
     * 描述
     */
    private String description;

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
    private Long createBy;

    /**
     *
     */
    private Long updateBy;

    /**
     * 逻辑删除标识
     */
    private Integer delFlag;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}