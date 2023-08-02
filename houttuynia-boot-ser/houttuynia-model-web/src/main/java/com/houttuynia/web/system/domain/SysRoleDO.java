package com.houttuynia.web.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 角色表
 * @TableName sys_role
 */
@TableName(value ="sys_role")
@Data
public class SysRoleDO implements Serializable {
    /**
     * 
     */
    @TableId
    private String id;

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 角色编码
角色编码
     */
    private String roleCode;

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