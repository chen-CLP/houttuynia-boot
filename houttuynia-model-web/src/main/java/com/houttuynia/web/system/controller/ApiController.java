package com.houttuynia.web.system.controller;

import cn.hutool.core.util.ArrayUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.houttuynia.core.common.Result;
import com.houttuynia.core.utils.ArrayUtils;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.form.ApiForm;
import com.houttuynia.web.system.service.SysApiService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * ApiController
 *
 * @author clp
 * @date 2023-8-4 15:34
 */
@RequestMapping("system/api")
@Controller
public class ApiController {
    @Resource
    private SysApiService apiService;

    @GetMapping("list")
    public String list() {
        return "pages/system/api/list";
    }

    @PostMapping("add")
    @ResponseBody
    public Result add(@RequestBody ApiForm form) {
        SysApiDO apiDO = new SysApiDO();
        QueryWrapper<SysApiDO> queryWrapper = new QueryWrapper<>();
        if (ArrayUtils.isNotEmpty(apiService.list(queryWrapper))) {
            return Result.error("该接口地址已存在");
        }
        BeanUtils.copyProperties(form, apiDO);
        apiService.save(apiDO);
        return Result.ok();
    }
}

