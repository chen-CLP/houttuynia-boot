package com.houttuynia.web.system.controller;

import com.houttuynia.core.common.Result;
import com.houttuynia.web.system.form.LoginUserForm;
import com.houttuynia.core.utils.RandImageUtil;
import com.houttuynia.core.utils.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Login
 *
 * @author clp
 * @date 2023-7-20 13:45
 */
@Slf4j
@Controller
public class LoginController {
    @Resource
    private RedisUtil redisUtil;
    private static final String CODE_KEY = "LOGIN_CODE_KEY";
    private static final Integer LOSE_TIME = 30;

    @GetMapping({"/"})
    public String welcome(HttpServletResponse response) {
        return "redirect:/login";
    }

    /**
     * 登录界面
     *
     * @return
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    /**
     * 登录
     *
     * @param loginUserForm
     * @return
     */
    @ResponseBody
    @PostMapping("/login")
    public Result login(LoginUserForm loginUserForm) {
        return Result.ok();
    }

    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }

    /**
     * 获取验证码
     *
     * @param response
     * @param request
     */
    @GetMapping("/verification")
    public void verification(HttpServletResponse response, HttpServletRequest request) throws IOException {
        String sessionId = request.getSession().getId();
        response.setContentType("image/jpeg");
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expire", 0);
        String code = RandImageUtil.generateCode(4);
        redisUtil.set(sessionId, code, LOSE_TIME);
        log.info("{}登录验证码：{}", sessionId, request.getRequestURI(), code);
        RandImageUtil.generate(response, code);
    }
}
