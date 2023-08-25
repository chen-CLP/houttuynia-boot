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
     * 名称
     */
    private String name;
    /**
     * 名称icon
     */
    private String menuName;

    /**
     * 菜单图标
     */
    private String menuIcon;

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
