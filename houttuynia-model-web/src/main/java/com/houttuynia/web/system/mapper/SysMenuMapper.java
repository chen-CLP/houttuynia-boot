package com.houttuynia.web.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.houttuynia.web.system.domain.SysMenuDO;
import com.houttuynia.web.system.dto.MenuDetailsDto;
import org.apache.ibatis.annotations.Param;

/**
 * @author zy
 * @description 针对表【sys_menu(菜单表)】的数据库操作Mapper
 * @createDate 2023-09-05 11:32:43
 * @Entity generator.domain.SysMenuDO
 */
public interface SysMenuMapper extends BaseMapper<SysMenuDO> {
    /**
     * 根据id获取菜单信息
     *
     * @param id
     * @return
     */
    MenuDetailsDto getDtoById(@Param("id") String id);
}




