package com.zy.bim.service;

import com.zy.bim.bean.Permission;
import com.zy.bim.bean.Project;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/5 0005 下午 2:23
 */
public interface PermissionCheckService {

    //选项项目 将项目放到session中并将项目返回
    Project userSelectProject(String projectId, HttpSession session);

    //选择项目权限
    List<String> userSelectPermission(HttpSession session, String projectId);
}
