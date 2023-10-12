package com.houttuynia.web.system.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.houttuynia.core.common.Result;
import com.houttuynia.core.utils.SqlUtils;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.form.ApiForm;
import com.houttuynia.web.system.service.SysApiService;
import com.houttuynia.web.system.vo.ApiBaseVo;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
public class SysApiController {
    @Resource
    private SysApiService apiService;
    @Resource
    private SqlSession sqlSession;
    /**
     * url前缀
     */
    private final static String BASE_URL_PRE = "system/api/xml/";

    @GetMapping("list")
    public String list(Model model) {
        List<SysApiDO> apiDOList = apiService.list();
        model.addAttribute("list", apiDOList);
        return "pages/system/api/list";
    }

    @GetMapping("model")
    public String model(Model model) {
        List<SysApiDO> apiDOList = apiService.list();
        model.addAttribute("list", apiDOList);
        return "pages/system/api/model";
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

    @PostMapping("save-or-update")
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
        Integer num = Integer.valueOf((String) param.get("page"));
        Integer limit = Integer.valueOf((String) param.get("limit"));
        if (Objects.nonNull(num) && Objects.nonNull(limit)) {
            PageHelper.startPage(num, limit);
            List<Object> list = sqlSession.selectList(nameSpace, param);
            PageInfo pageInfo = new PageInfo(list);
            return Result.ok().data(pageInfo);
        }
        return Result.ok().data(sqlSession.selectList(nameSpace, param));
    }

    /**
     * 删除接口
     *
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    @ResponseBody
    public Result delete(@PathVariable String id) {
        apiService.removeById(id);
        return Result.ok();
    }
}

