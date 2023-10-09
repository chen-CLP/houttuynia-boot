package com.houttuynia.web.system.service;

import com.houttuynia.web.system.domain.SysMenuDO;
import com.baomidou.mybatisplus.extension.service.IService;
import com.houttuynia.web.system.dto.MenuDetailsDto;
import com.houttuynia.web.system.form.SysMenuForm;
import com.houttuynia.web.system.vo.MenuVo;

import java.util.List;

/**
 * @author clp
 * @description 针对表【sys_menu(菜单表)】的数据库操作Service
 * @createDate 2023-08-02 15:50:26
 */
public interface SysMenuService extends IService<SysMenuDO> {
    /**
     * 获取菜单列表
     *
     * @return
     */
    List<MenuVo> getMenuList();

    /**
     * 更新或者新增
     *
     * @param sysMenuForm
     */
    void saveOrUpdate(SysMenuForm sysMenuForm);

    /**
     * 根据id获取信息
     *
     * @param id
     * @return
     */
    MenuDetailsDto getDtoById(String id);
}
