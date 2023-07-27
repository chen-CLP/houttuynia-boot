package com.houttuynia.core.system.mapper;

import com.houttuynia.core.system.domain.SysUserDO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author zy
 * @description 针对表【sys_user(用户信息表)】的数据库操作Mapper
 * @createDate 2023-07-24 14:07:20
 * @Entity system.domain.SysUser
 */
@Mapper
public interface SysUserMapper extends BaseMapper<SysUserDO> {

}




