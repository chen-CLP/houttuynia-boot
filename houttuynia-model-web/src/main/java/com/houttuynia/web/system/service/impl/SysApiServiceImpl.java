package com.houttuynia.web.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.houttuynia.core.common.Result;
import com.houttuynia.core.utils.ArrayUtils;
import com.houttuynia.core.utils.SqlUtils;
import com.houttuynia.web.mybatis.MyBatisXmlReload;
import com.houttuynia.web.system.domain.SysApiDO;
import com.houttuynia.web.system.form.ApiForm;
import com.houttuynia.web.system.mapper.SysApiMapper;
import com.houttuynia.web.system.service.SysApiService;
import com.sun.org.apache.xml.internal.security.exceptions.AlgorithmAlreadyRegisteredException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Objects;

/**
 * @author zy
 * @description 针对表【sys_api(数据接口表)】的数据库操作Service实现
 * @createDate 2023-08-14 15:34:25
 */
@Service
public class SysApiServiceImpl extends ServiceImpl<SysApiMapper, SysApiDO>
        implements SysApiService {

    @Resource
    private MyBatisXmlReload xmlReload;

    @Override
    public void saveOrUpdate(ApiForm form) {
        SysApiDO apiDO = this.getById(form.getId());
        String strSQL = form.getSqlXml();
        strSQL.replaceAll("\n", " ");
        strSQL.replaceAll("\r", " ");
        strSQL.replaceAll("\t", " ");
        String sqlXml = SqlUtils.createSQLXML(form.getId(), form.getSqlXml());
        if (Objects.isNull(apiDO)) {
            apiDO = new SysApiDO();
            BeanUtils.copyProperties(form, apiDO);
            this.save(apiDO);
            xmlReload.addXml(sqlXml);
        } else {
            BeanUtils.copyProperties(form, apiDO);
            this.updateById(apiDO);
            xmlReload.reload(SqlUtils.getSelectPath(form.getId()), sqlXml);
        }
    }
}




