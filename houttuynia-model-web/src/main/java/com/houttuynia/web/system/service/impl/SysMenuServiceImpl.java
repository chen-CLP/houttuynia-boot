package com.houttuynia.web.system.service.impl;

import cn.hutool.core.util.ArrayUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.houttuynia.core.utils.ArrayUtils;
import com.houttuynia.web.system.domain.SysMenuDO;
import com.houttuynia.web.system.form.SysMenuForm;
import com.houttuynia.web.system.service.SysMenuService;
import com.houttuynia.web.system.mapper.SysMenuMapper;
import com.houttuynia.web.system.vo.MenuVo;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.ListUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author clp
 * @description 针对表【sys_menu(菜单表)】的数据库操作Service实现
 * @createDate 2023-09-05 11:32:43
 */
@Service
public class SysMenuServiceImpl extends ServiceImpl<SysMenuMapper, SysMenuDO>
        implements SysMenuService {
    private static final String BASE_MENU_ID = "0";

    private SysMenuMapper sysMenuMapper;

    @Override
    public List<MenuVo> getMenuList() {
        List<SysMenuDO> menuDOList = this.list();
        Map<String, List<SysMenuDO>> groupList = menuDOList.stream().collect(Collectors.groupingBy(SysMenuDO::getParentId));
        return createMenList(BASE_MENU_ID, groupList);
    }

    @Override
    public void saveOrUpdate(SysMenuForm sysMenuForm) {
        SysMenuDO menuDO = this.getById(sysMenuForm.getId());
        if (Objects.isNull(menuDO)) {
            menuDO = new SysMenuDO();
            BeanUtils.copyProperties(sysMenuForm, menuDO);
            sysMenuMapper.insert(menuDO);
        } else {
            BeanUtils.copyProperties(sysMenuForm, menuDO);
            sysMenuMapper.updateById(menuDO);
        }
    }

    private List<MenuVo> createMenList(String menuId, Map<String, List<SysMenuDO>> groupList) {
        List<MenuVo> res = new ArrayList<>();
        List<SysMenuDO> childList = groupList.get(menuId);
        if (!ListUtils.isEmpty(childList)) {
            childList.forEach(item -> {
                MenuVo tm = new MenuVo();
                BeanUtils.copyProperties(item, tm);
                tm.setName(tm.getMenuName());
                tm.setParentId(menuId);
                tm.setChildren(createMenList(item.getId(), groupList));
                tm.setIsParent(ArrayUtils.isNotEmpty(tm.getChildren()));
                res.add(tm);
            });
        }
        return res;
    }


}




