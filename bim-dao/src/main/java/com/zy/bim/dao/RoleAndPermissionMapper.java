package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.RoleAndPermission;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 5:55
 */
@Component
public interface RoleAndPermissionMapper extends BaseMapper<RoleAndPermission> {

    //根据角色id查询出角色具有的权限集合
    List<String> listPermissionIdByRoleId(String roleId);

    //向中间表插入数据
    Integer insertPermissionBatch(RoleAndPermission pm);
}
