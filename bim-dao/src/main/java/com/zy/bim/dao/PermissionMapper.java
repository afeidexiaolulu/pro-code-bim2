package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.Permission;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/5 0005 下午 3:01
 */
@Component
public interface PermissionMapper extends BaseMapper<Permission> {
    //查询权限
    List<Permission> selectPermissionHaved(@Param("userId") Integer userId, @Param("projectId") String projectId);

    //查询所有权限url
    List<String> queryAllPermission();
}
