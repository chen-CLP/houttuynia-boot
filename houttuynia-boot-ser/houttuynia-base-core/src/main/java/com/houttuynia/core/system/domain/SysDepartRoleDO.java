package com.houttuynia.core.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 部门角色关联表
 * @TableName sys_depart_role
 */
@TableName(value ="sys_depart_role")
@Data
public class SysDepartRoleDO implements Serializable {
    /**
     * 
     */
    @TableId
    private String id;

    /**
     * 角色id
     */
    private String roleId;

    /**
     * 部门id
     */
    private String departId;

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