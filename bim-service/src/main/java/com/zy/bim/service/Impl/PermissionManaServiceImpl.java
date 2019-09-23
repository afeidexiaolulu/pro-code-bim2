package com.zy.bim.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.bim.bean.Permission;
import com.zy.bim.bean.RoleAndPermission;
import com.zy.bim.dao.PermissionMapper;
import com.zy.bim.dao.RoleAndPermissionMapper;
import com.zy.bim.service.PermissionManaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 5:54
 */
@Service
@Transactional
public class PermissionManaServiceImpl extends ServiceImpl<RoleAndPermissionMapper, RoleAndPermission> implements PermissionManaService {

    private static Logger logger = LoggerFactory.getLogger(PermissionManaServiceImpl.class);

    @Autowired
    private RoleAndPermissionMapper roleAndPermissionMapper;

    @Autowired
    private PermissionMapper permissionMapper;

    //更新项目成员权限
    @Override
    public Integer updatePermission(RoleAndPermission pm) {
        //先删除项目成员权限
        QueryWrapper<RoleAndPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_id", pm.getRoleId());
        int delete = roleAndPermissionMapper.delete(queryWrapper);

        Integer insert = roleAndPermissionMapper.insertPermissionBatch(pm);
        if(insert != pm.getPermissionIdList().size()){
            logger.info("更新权限失败");
            throw new RuntimeException("权限更新失败");
        }

        logger.info("更新权限成功 "+pm);
        //在插入项目成员权限
        return insert;
    }


    //根据角色ID查询权限
    @Override
    public RoleAndPermission getRoleMemberPermission(String roleId) {

        List<String> permissionIds = roleAndPermissionMapper.listPermissionIdByRoleId(roleId);
        RoleAndPermission roleAndPermission = new RoleAndPermission(null,roleId,permissionIds,new Date(), new Date());
        logger.info("查询"+roleId+"拥有的角色为"+roleAndPermission);
        return roleAndPermission;
    }

    //删除角色权限
    @Override
    public void deletePermission(RoleAndPermission pm) {
        //先删除项目成员权限
        QueryWrapper<RoleAndPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_id", pm.getRoleId());
        int delete = roleAndPermissionMapper.delete(queryWrapper);
    }

    //查询所有的权限
    @Override
    public List<String> queryAllPermission() {

        return permissionMapper.queryAllPermission();
    }
}
