package com.houttuynia.web.security.details;

import com.houttuynia.web.system.domain.SysUserDO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * LoginUserDetail
 *
 * @author clp
 * @date 2023-7-24 14:04
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserDetail implements UserDetails {
    private SysUserDO sysUserDO;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return sysUserDO.getUserPassword();
    }

    @Override
    public String getUsername() {
        return sysUserDO.getUserName();
    }

    /**
     * 是否过期
     *
     * @return
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 是否锁定
     *
     * @return
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
