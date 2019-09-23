package com.zy.bim.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.bim.bean.Permission;
import com.zy.bim.bean.RoleAndPermission;

import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 5:52
 */
public interface PermissionManaService extends IService<RoleAndPermission> {

    //查询项目成员的权限
    RoleAndPermission getRoleMemberPermission(String roleId);

    //更新成员权限
    Integer updatePermission(RoleAndPermission pm);

    //删除项目成员
    void deletePermission(RoleAndPermission pm);

    //查询所有的权限
    List<String> queryAllPermission();
}
