package com.houttuynia.web.common;


import com.houttuynia.web.common.constant.CommonConstant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;

/**
 * 接口返回数据格式
 *
 */
@Data
public class Result implements Serializable {
    private static final long serialVersionUID = 1L;
    /**
     * 成功标志
     */
    private boolean success = true;
    /**
     * 返回处理消息
     */
    private String message = "";
    /**
     * 返回代码
     */
    private Integer code = 0;
    /**
     * 返回数据对象 data
     */
    private Object data;
    /**
     * 时间戳
     */
    private long timestamp = System.currentTimeMillis();

    @JsonIgnore
    private String onlTable;

    public Result() {
    }

    /**
     * 兼容VUE3版token失效不跳转登录页面
     *
     * @param code
     * @param message
     */
    public Result(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    /**
     * @param code
     * @param message
     * @param data
     */
    public Result(Integer code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * @param code
     * @return
     */
    public Result code(Integer code) {
        this.code = code;
        return this;
    }

    /**
     * @param message
     * @return
     */
    public Result message(String message) {
        this.message = message;
        return this;
    }

    /**
     * @param data
     * @return
     */
    public Result data(Object data) {
        this.data = data;
        return this;
    }

    /**
     * @return
     */
    public static Result ok() {
        Result r = new Result();
        r.setSuccess(true);
        r.setCode(CommonConstant.SC_OK_200);
        return r;
    }

    public static Result ok(String msg) {
        Result r = new Result();
        r.setSuccess(true);
        r.setCode(CommonConstant.SC_OK_200);
        r.setMessage(msg);
        return r;
    }

    public static Result ok(String msg, Object data) {
        Result r = new Result();
        r.setSuccess(true);
        r.setMessage(msg);
        r.setCode(CommonConstant.SC_OK_200);
        r.setData(data);
        return r;
    }

    public static Result error(String msg) {
        return error(CommonConstant.SC_INTERNAL_SERVER_ERROR_500, msg);
    }

    public static Result error(int code, String msg) {
        Result r = new Result();
        r.setCode(code);
        r.setMessage(msg);
        r.setSuccess(false);
        return r;
    }

    public Result error500(String message) {
        this.message = message;
        this.code = CommonConstant.SC_INTERNAL_SERVER_ERROR_500;
        this.success = false;
        return this;
    }

    /**
     * 无权限访问返回结果
     */
    public static Result noauth(String msg) {
        return error(CommonConstant.SC_JEECG_NO_AUTHZ, msg);
    }


}