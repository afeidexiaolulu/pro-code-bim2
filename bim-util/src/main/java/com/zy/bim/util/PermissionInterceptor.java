package com.zy.bim.util;

import com.zy.bim.bean.Permission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/23 0023 下午 2:06
 */
@Component
public class PermissionInterceptor extends HandlerInterceptorAdapter {

    private static Logger logger = LoggerFactory.getLogger(PermissionInterceptor.class);

    //进入controller前进行拦截
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("权限拦截器正在进行拦截");
        HttpSession session = request.getSession();
        //取出所有的权限
        List<String> permissionsStrs = (List<String>) session.getAttribute(Const.ALLPERMISSION);
        String requestURI = request.getRequestURI();
        //只拦截权限的url
        if(permissionsStrs.contains(requestURI)){
            //取出用户已有的权限,放到一个list集合中
            List<Permission> permissions = (List<Permission>) session.getAttribute(Const.PERMISSIONHAVED);

            ArrayList<String> permissionHavedList = new ArrayList<>();

            //如果用户本身有特殊权限
            if(permissions != null && permissions.size()>0){
                for (Permission permission : permissions) {
                    permissionHavedList.add(permission.getPermissionUrl());
                }
                //如果有权限放行
                if(permissionHavedList.contains(requestURI)){
                    return true;
                }else {
                    return false;
                }
            }else{
                //如果用户本身没有特殊权限
                return false;
            }
        }else {
            //不需要权限的放行
            return true;
        }
    }
}
