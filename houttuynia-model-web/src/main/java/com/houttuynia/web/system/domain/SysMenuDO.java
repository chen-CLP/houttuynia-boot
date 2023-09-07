package com.houttuynia.web.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 菜单表
 * @TableName sys_menu
 */
@TableName(value ="sys_menu")
@Data
public class SysMenuDO implements Serializable {
    /**
     * 
     */
    @TableId
    private String id;

    /**
     * 父ID
     */
    private String parentId;

    /**
     * 链接地址
     */
    private String menuUrl;

    /**
     * 名称icon
     */
    private String menuName;

    /**
     * 顺序
     */
    private Integer menuNum;

    /**
     * 菜单图标
     */
    private String menuIcon;

    /**
     * 打开方式
     */
    private Integer openType;

    /**
     * 按钮配置
     */
    private String buttonConf;

    /**
     * 查询配置
     */
    private String queryConf;

    /**
     * 菜单显示字段配置
     */
    private String fieldConf;

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