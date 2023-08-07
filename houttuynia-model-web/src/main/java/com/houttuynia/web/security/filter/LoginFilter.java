package com.houttuynia.web.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.houttuynia.core.utils.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * LoginFilter
 *
 * @author clp
 * @date 2023-7-31 11:04
 */
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private RedisUtil redisUtil;

    public RedisUtil getRedisUtil() {
        return redisUtil;
    }

    public void setRedisUtil(RedisUtil redisUtil) {
        this.redisUtil = redisUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        System.out.println(request.getRequestURI());
        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method is not supported: " + request.getMethod());
        }
        Map<String, Object> userInfo = null;
        try {
            userInfo = new ObjectMapper().readValue(request.getInputStream(), Map.class);
        } catch (Exception e) {
            log.error("错误信息：{}", e);
            throw new AuthenticationServiceException("请输入登录信息");
        }
        if (Objects.nonNull(userInfo)) {
            String sessionId = request.getSession().getId();
            String oldCode = (String) redisUtil.get(sessionId);
            String verifyCode = (String) userInfo.get("verifyCode");
            if (Objects.isNull(oldCode) || !Objects.equals(oldCode, verifyCode)) {
//                throw new AuthenticationServiceException("验证码错误");
            }
            String userName = (String) userInfo.get("userName");
            String password = (String) userInfo.get("password");
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userName, password);
            super.setDetails(request, authenticationToken);
            return this.getAuthenticationManager().authenticate(authenticationToken);
        }
        return super.attemptAuthentication(request, response);
    }
}
