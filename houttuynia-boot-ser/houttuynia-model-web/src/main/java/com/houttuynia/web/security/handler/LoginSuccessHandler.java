package com.houttuynia.web.security.handler;

import cn.hutool.json.JSONUtil;
import com.houttuynia.core.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * LoginSuccessFailHandler
 * 登录失败处理器
 *
 * @author clp
 * @date 2023-7-31 15:02
 */
@Slf4j
@Component
public class LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        log.info("登录成功：{}", request);
        Result result = Result.ok("登录成功");
        response.setStatus(200);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().append(JSONUtil.toJsonStr(result));
    }
}
