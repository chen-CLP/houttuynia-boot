package com.houttuynia.core.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.houttuynia.core.security.details.LoginUserDetail;
import com.houttuynia.core.system.domain.SysUserDO;
import com.houttuynia.core.system.mapper.SysUserMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Objects;

/**
 * UserDetailsServiceImpl
 *
 * @author clp
 * @date 2023-7-24 14:12
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Resource
    private SysUserMapper sysUserMapper;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        QueryWrapper<SysUserDO> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(SysUserDO::getUserName, userName);
        SysUserDO userDO = sysUserMapper.selectOne(queryWrapper);
        if (Objects.isNull(userDO)) {

        }
        return new LoginUserDetail(userDO);
    }
}
