package com.houttuynia.web.security.config;

//import com.houttuynia.core.security.filter.JwtAuthenticationTokenFilter;

import com.houttuynia.core.utils.RedisUtil;
import com.houttuynia.web.security.filter.JwtTokenFilter;
import com.houttuynia.web.security.filter.LoginFilter;
import com.houttuynia.web.security.handler.LoginFailHandler;
import com.houttuynia.web.security.handler.LoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.annotation.Resource;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Resource
    private IgnoreUrlsConfig ignoreUrlsConfig;

    @Resource
    private RedisUtil redisUtil;

    @Resource
    private LoginFailHandler loginFailHandler;

    @Resource
    private LoginSuccessHandler loginSuccessFailHandler;
    @Resource
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Security配置
     *
     * @param httpSecurity
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry = httpSecurity
                .authorizeRequests();
        httpSecurity.userDetailsService(userDetailsService);
        //关闭跨域保护
        httpSecurity.cors().disable();
        httpSecurity.csrf().disable();
        //放行iframe
        httpSecurity.headers().frameOptions().sameOrigin();
        //关闭通过session获取SecurityContext
        //httpSecurity.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        //放行所有请求方式
        registry.antMatchers(HttpMethod.OPTIONS).permitAll();
        //不需要保护的资源路径允许访问
        for (String url : ignoreUrlsConfig.getUrls()) {
            registry.antMatchers(url).permitAll();
        }
        httpSecurity.authorizeRequests().anyRequest().authenticated();
        httpSecurity.formLogin().loginPage("/login");
        httpSecurity.logout().logoutUrl("/logout").logoutSuccessUrl("/login");
        //添加过滤器
        httpSecurity.addFilterAt(loginFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    @Bean
    LoginFilter loginFilter() throws Exception {
        LoginFilter loginFilter = new LoginFilter();
        loginFilter.setFilterProcessesUrl("/doLogin");
        loginFilter.setRedisUtil(redisUtil);
        loginFilter.setAuthenticationManager(authenticationManager());
        loginFilter.setAuthenticationFailureHandler(loginFailHandler);
        loginFilter.setAuthenticationSuccessHandler(loginSuccessFailHandler);
        return loginFilter;
    }
}
