package com.houttuynia.web.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.form.ApiForm;

/**
 * @author zy
 * @description 针对表【sys_api(数据接口表)】的数据库操作Service
 * @createDate 2023-08-14 15:34:25
 */
public interface SysApiService extends IService<SysApiDO> {
    /**
     * 新增
     *
     * @param form
     */
    public void saveOrUpdate(ApiForm form);
}
