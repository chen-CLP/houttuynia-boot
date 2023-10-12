package com.houttuynia.web.system.controller;

import com.houttuynia.core.common.Result;
import com.houttuynia.web.system.form.SysMenuForm;
import com.houttuynia.web.system.service.SysMenuService;
import com.houttuynia.web.system.dto.MenuDetailsDto;
import com.houttuynia.web.system.vo.MenuVo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

/**
 * MenuController
 *
 * @author clp
 * @date 2023-7-21 16:41
 */
@RequestMapping("/system/menu")
@Controller
public class SysMenuController {
    @Resource
    private SysMenuService sysMenuService;

    @GetMapping("/list")
    public String list(Model model) {
        List<MenuVo> menuList = sysMenuService.getMenuList();
        model.addAttribute("menuList", menuList);
        return "pages/system/menu/list";
    }

    @GetMapping("/add")
    public String add() {
        return "pages/system/menu/add";
    }

    @PostMapping("/save-or-update")
    @ResponseBody
    public Result saveOrUpdate(@RequestBody SysMenuForm sysMenuForm) {
        sysMenuService.saveOrUpdate(sysMenuForm);
        return Result.ok();
    }

    @DeleteMapping("/delete-batch")
    @ResponseBody
    public Result deleteBatch(@RequestBody List<String> ids) {
        sysMenuService.removeByIds(ids);
        return Result.ok();
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable String id, Model model) {
        MenuDetailsDto detailsDto = sysMenuService.getDtoById(id);
        model.addAttribute("menuDetails", detailsDto);
        return "pages/system/menu/edit";
    }
}
