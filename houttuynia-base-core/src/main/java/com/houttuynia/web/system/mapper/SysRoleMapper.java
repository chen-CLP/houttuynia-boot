package com.houttuynia.web.system.mapper;

import com.houttuynia.web.system.domain.SysRoleDO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author zy
 * @description 针对表【sys_role(角色表)】的数据库操作Mapper
 * @createDate 2023-07-20 10:59:11
 * @Entity com.houttuynia.core.system.domain.SysRole
 */
@Mapper

public interface SysRoleMapper extends BaseMapper<SysRoleDO> {

}




