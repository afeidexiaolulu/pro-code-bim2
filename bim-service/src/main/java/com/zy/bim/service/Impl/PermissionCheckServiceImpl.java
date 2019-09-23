package com.zy.bim.service.Impl;


import com.zy.bim.bean.Permission;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.User;
import com.zy.bim.dao.PermissionMapper;
import com.zy.bim.dao.ProjectMapper;
import com.zy.bim.service.PermissionCheckService;
import com.zy.bim.util.Const;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/5 0005 下午 2:24
 */
@Service
@Transactional
public class PermissionCheckServiceImpl implements PermissionCheckService {

    @Autowired
    private PermissionMapper permissionMapper;

    @Autowired
    private ProjectMapper projectMapper;

    /**
     * 将用户选择的项目放到session中
     */
    @Override
    public Project userSelectProject(String projectId, HttpSession session) {
        //查询项目将项目返回
        Project project = projectMapper.selectById(projectId);
        //将项目id存在session中
        session.setAttribute(Const.PROJECT_ID, projectId);
        //将project返回
        return project;
    }


    /**
     * 取得项目权限
     */
    @Override
    public List<String> userSelectPermission(HttpSession session, String projectId) {
        //从session中取出用户
        User user = (User) session.getAttribute(Const.LOGIN_USER);
        //从session中取出所选项目
        List<Permission> permissionList = permissionMapper.selectPermissionHaved(user.getId(),projectId);
        //将用户权限放入session中
        session.setAttribute(Const.PERMISSIONHAVED,permissionList);
        ArrayList<String> permissions = new ArrayList<>();
        for (Permission permission : permissionList) {
            permissions.add(permission.getPermission());
        }
        return permissions;
    }
}
