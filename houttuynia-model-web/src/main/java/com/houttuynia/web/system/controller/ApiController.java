package com.houttuynia.web.system.controller;

import cn.hutool.core.util.ArrayUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.api.R;
import com.houttuynia.core.common.Result;
import com.houttuynia.core.utils.ArrayUtils;
import com.houttuynia.core.utils.SqlUtils;
import com.houttuynia.web.mybatis.MyBatisXmlReload;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.form.ApiForm;
import com.houttuynia.web.system.service.SysApiService;
import com.houttuynia.web.system.vo.ApiBaseVo;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

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
    @Resource
    private SqlSession sqlSession;
    /**
     * url前缀
     */
    private final static String BASE_URL_PRE = "system/api/xml/";

    @Resource
    private MyBatisXmlReload xmlReload;

    @GetMapping("list")

    public String list(Model model) {
        List<SysApiDO> apiDOList = apiService.list();
        model.addAttribute("list", apiDOList);
        return "pages/system/api/list";
    }

    /**
     * 获取唯一的id
     *
     * @return
     */
    @GetMapping("getId")
    @ResponseBody
    public Result getId() {
        ApiBaseVo apiBaseVo = new ApiBaseVo();
        apiBaseVo.setId(UUID.randomUUID().toString());
        apiBaseVo.setApiUrl(BASE_URL_PRE + apiBaseVo.getId());
        return Result.ok().data(apiBaseVo);
    }

    @PostMapping("saveOrUpdate")
    @ResponseBody
    public Result saveOrUpdate(@RequestBody ApiForm form) {
        apiService.saveOrUpdate(form);
        return Result.ok();
    }

    /**
     * 动态接口访问
     *
     * @param id
     * @return
     */
    @GetMapping("xml/{id}")
    @ResponseBody
    public Result get(@PathVariable String id, @RequestParam Map<String, Object> param) {
        String nameSpace = SqlUtils.getSelectPath(id);
        return Result.ok().data(sqlSession.selectList(nameSpace, param));
    }
}

