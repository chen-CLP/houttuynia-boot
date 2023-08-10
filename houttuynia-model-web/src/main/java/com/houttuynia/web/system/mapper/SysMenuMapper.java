package com.houttuynia.web.system.mapper;

import com.houttuynia.web.system.domain.SysMenuDO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.houttuynia.web.system.vo.MenuVo;

import java.util.List;

/**
 * @author zy
 * @description 针对表【sys_menu(菜单表)】的数据库操作Mapper
 * @createDate 2023-08-02 15:50:26
 * @Entity com.houttuynia.web.system.domain.SysMenuDO
 */
public interface SysMenuMapper extends BaseMapper<SysMenuDO> {

    List<MenuVo> test();
}




