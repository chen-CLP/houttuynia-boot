package com.houttuynia.web.system.controller;

import com.houttuynia.web.system.domain.SysMenuDO;
import com.houttuynia.web.system.service.SysMenuService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.annotation.Resource;

/**
 * DynamicController
 *
 * @author clp
 * @date 2023-10-9 16:44
 */
@Controller
@RequestMapping("dynamic")
public class SysDynamicController {

    @Resource
    private SysMenuService sysMenuService;

    @GetMapping("/index/{menuId}")
    public String index(@PathVariable String menuId, Model model) {
        SysMenuDO menuInfo = sysMenuService.getById(menuId);
        model.addAttribute("menuInfo", menuInfo);
        return "pages/dynamic/index";
    }
}
