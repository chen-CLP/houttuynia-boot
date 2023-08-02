package com.houttuynia.web.system.service;

import com.houttuynia.web.system.domain.SysMenuDO;
import com.baomidou.mybatisplus.extension.service.IService;
import com.houttuynia.web.system.vo.MenuVo;

import java.util.List;

/**
 * @author zy
 * @description 针对表【sys_menu(菜单表)】的数据库操作Service
 * @createDate 2023-08-02 15:50:26
 */
public interface SysMenuService extends IService<SysMenuDO> {
    List<MenuVo> getMenuList();
}
