package com.houttuynia.web.system.dto;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

/**
 * MenuDetailsVo
 *
 * @author clp
 * @date 2023-10-7 15:55
 */
@Data
public class MenuDetailsDto {
    /**
     * id
     */
    @TableId
    private String id;

    /**
     * 父ID
     */
    private String parentId;
    /**
     * 父名称
     */
    private String parentName;

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
     * 菜单类型
     */
    private String menuType;
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
}
