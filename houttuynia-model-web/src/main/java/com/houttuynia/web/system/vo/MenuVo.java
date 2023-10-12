package com.houttuynia.web.system.vo;

import lombok.Data;

import java.util.List;

/**
 * MenuVo
 *
 * @author clp
 * @date 2023-8-2 16:14
 */
@Data
public class MenuVo {
    private String id;
    /**
     * 请求路径
     */
    private String menuUrl;
    /**
     * 菜单类型
     */
    private String menuType;
    /**
     * 名称
     */
    private String name;
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
     * 描述
     */
    private String description;
    /**
     * 是否为父亲节点
     */
    private Boolean isParent;
    /**
     * 父亲节点
     */
    private String parentId;
    /**
     * 孩子
     */
    List<MenuVo> children;
}
