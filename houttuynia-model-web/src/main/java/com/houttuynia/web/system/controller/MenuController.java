package com.houttuynia.web.system.controller;

import com.houttuynia.web.system.domain.SysMenuDO;
import com.houttuynia.web.system.service.SysMenuService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.List;

/**
 * MenuController
 *
 * @author clp
 * @date 2023-7-21 16:41
 */
@RequestMapping("/system/menu")
@Controller
public class MenuController {
    @Resource
    private SysMenuService menuService;

    @GetMapping("/list")
    public String list(Model model) {
        List<SysMenuDO> menuList = menuService.list();
        model.addAttribute("menuList", menuList);
        return "pages/system/menu/list";
    }
}
