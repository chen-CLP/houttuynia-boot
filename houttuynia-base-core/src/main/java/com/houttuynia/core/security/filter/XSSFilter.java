//package com.houttuynia.core.security.filter;
//
//import com.alibaba.fastjson.JSONObject;
//import com.kayak.cloud.zuul.util.ModifiedHttpServletRequest;
//import com.netflix.zuul.ZuulFilter;
//import com.netflix.zuul.context.RequestContext;
//import com.netflix.zuul.exception.ZuulException;
//import org.apache.commons.lang3.StringEscapeUtils;
//import org.springframework.stereotype.Component;
//
//import javax.servlet.http.HttpServletRequest;
//import java.util.Enumeration;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
///**
// * [这个过滤器是为了解决xss攻击的]
// *
// * @author : [${Harlan.Hwang}]
// * @version : [v1.0]
// * @createTime : [2023/7/3 09:44]
// */
//@Component
//public class XSSFilter extends ZuulFilter {
//
//
//    // 防止sql注入正则
//    private static final String SQL_INJECTION_REGEX = "(?i).*\\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( +INTO)?|MERGE|SELECT|UPDATE|UNION( +ALL)?)\\b.*";
//
//    // 防脚本注入正则
//    private static final String SCRIPT_INJECTION_REGEX = ".*[<>\'\"].*";
//
//    // 放行路径
//    String passPath = ".*JmReport.*";
//
//    @Override
//    public String filterType() {
//        return "pre";
//    }
//
//    @Override
//    public int filterOrder() {
//        return 1;
//    }
//
//    @Override
//    public boolean shouldFilter() {
//        RequestContext context = RequestContext.getCurrentContext();
//        String requestPath = context.getRequest().getRequestURI();
//        Pattern pattern = Pattern.compile(passPath, Pattern.CASE_INSENSITIVE);
//        boolean flag = matchesPattern(requestPath, pattern);
//
//        return !flag;
//    }
//
//    @Override
//    public Object run() throws ZuulException {
//        RequestContext context = RequestContext.getCurrentContext();
//        HttpServletRequest request = context.getRequest();
//        String requestURI = request.getRequestURI();
//        JSONObject json = new JSONObject();
//        boolean limiFlag = false;
//        boolean scripFlag  = false;
//        Map<String, String[]> scripMap = new HashMap<>();
//        Enumeration<String> parameterNames = request.getParameterNames();
//        while (parameterNames.hasMoreElements()) {
//            String paramName = parameterNames.nextElement();
//            String paramValue = request.getParameter(paramName);
//            if (Pattern.matches(SCRIPT_INJECTION_REGEX,paramValue)){
//               scripFlag = true;
//               scripMap.put(paramName,new String[]{ StringEscapeUtils.escapeHtml4(paramValue)});
//
//            }
//            if (requestURI.toLowerCase().endsWith("comn-query.json")&&"limit".equalsIgnoreCase(paramValue)&&"0".equalsIgnoreCase(paramValue)){
//                limiFlag = true;
//            }
//            if ("_$URI".equalsIgnoreCase(paramName)){
//                continue;
//            }
//            if (!isSafeInput(paramValue)){
//               // 参数验证不通过，进行相应处理
//                json.put("success",false);
//                json.put("returnmsg","illegal request parameters!");
//               context.setSendZuulResponse(false);
//               context.setResponseStatusCode(400);
//               context.setResponseBody(json.toString());
//               return null;
//
//           };
//        }
//        if (limiFlag){
//            // 修改参数
//            Map<String, String[]> parameterMap = request.getParameterMap();
//            parameterMap.replace("limit",new String[]{"10"});
//            ModifiedHttpServletRequest modifiedRequest = new ModifiedHttpServletRequest(request, parameterMap);
//            context.setRequest(modifiedRequest);
//        }
//        if (scripFlag){
//            Map<String, String[]> parameterMap = request.getParameterMap();
//            parameterMap.putAll(scripMap);
//            ModifiedHttpServletRequest modifiedRequest = new ModifiedHttpServletRequest(request, parameterMap);
//            context.setRequest(modifiedRequest);
//        }
//        return null;
//    }
//
//    public static boolean isSafeInput(String input) {
//        return !Pattern.matches(SQL_INJECTION_REGEX, input);
//    }
//
//    private static boolean matchesPattern(String input, Pattern pattern) {
//        Matcher matcher = pattern.matcher(input);
//        return matcher.matches();
//    }
//}
