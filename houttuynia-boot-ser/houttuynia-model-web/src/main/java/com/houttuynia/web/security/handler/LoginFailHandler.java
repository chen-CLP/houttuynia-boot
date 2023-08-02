package com.houttuynia.web.security.handler;

import cn.hutool.json.JSONUtil;
import com.houttuynia.core.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * LoginFialHandler
 *
 * @author clp
 * @date 2023-7-31 15:01
 */
@Slf4j
@Component
public class LoginFailHandler extends SimpleUrlAuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        log.info("登录失败：{}", request);
        Result result = Result.error("登录失败");
        response.setStatus(500);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().append(JSONUtil.toJsonStr(result));
    }
}
