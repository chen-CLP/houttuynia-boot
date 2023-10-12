package com.houttuynia.web.system.form;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.Objects;

/**
 * SysMenuForm
 *
 * @author clp
 * @date 2023-9-5 14:04
 */
@Data
public class SysMenuForm {
    private String id;

    public String getParentId() {
        if (StringUtils.hasLength(parentId)) {
            return parentId;
        } else {
            return "0";
        }
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

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
     * 菜单图标
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
