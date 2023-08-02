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
    /**
     * 请求路径
     */
    private String menuUrl;

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
     * 孩子
     */
    List<MenuVo> children;
}
