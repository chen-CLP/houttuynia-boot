package com.houttuynia.web.system.form;

import lombok.Data;

/**
 * LoginUserForm
 *
 * @author clp
 * @date 2023-7-21 11:24
 */
@Data
public class LoginUserForm {
    /**
     * 用户名
     */
    private String userName;
    /**
     * 密码
     */
    private String password;
    /**
     * 验证码
     */
    private String verifyCode;
}
