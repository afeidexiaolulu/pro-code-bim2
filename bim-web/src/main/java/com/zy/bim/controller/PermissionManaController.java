package com.zy.bim.controller;

import com.zy.bim.bean.RoleAndPermission;
import com.zy.bim.bean.User;
import com.zy.bim.service.PermissionManaService;
import com.zy.bim.util.Const;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;

/**
 *
 * 此控制器为权限管理的控制器
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 5:49
 */
@Controller
@RequestMapping("/bim")
public class PermissionManaController extends BaseController {

    private static Logger logger = LoggerFactory.getLogger(PermissionManaController.class);

    @Autowired
    private PermissionManaService permissionManaService;

    //跳转到权限管理页面
    @RequestMapping("/authorityManagement")
    public String toModelListPage(){
        return "AuthorityManagement/AuthorityManagement";
    }

    //查询项目经理和普通成员的权限
    @RequestMapping("/getRoleAndPermission")
    @ResponseBody
    public Object getRoleAndPermission(){
        star();
        try {
            //查询各角色拥有的权限
            //项目经理的
            RoleAndPermission pM = permissionManaService.getRoleMemberPermission("2");
            //普通成员的
            RoleAndPermission projectManager = permissionManaService.getRoleMemberPermission("3");
            ArrayList<RoleAndPermission> roleAndPermissions = new ArrayList<>();
            roleAndPermissions.add(pM);
            roleAndPermissions.add(projectManager);
            logger.info("查询个角色拥有的权限成功");
            success(true);
            data(roleAndPermissions);
        }catch (Exception e){
            e.printStackTrace();
            logger.error("查询个角色拥有的权限失败");
            success(false);
            message(Const.TIP);
        }
        return end();
    }

    //权限更改 管理员id,管理员权限ids, 成员id, 成员权限ids
    @PostMapping("/updateRoleAndPermission")
    @ResponseBody
    public Object updateRoleAndPermission(String pid, String[] ppids, String mid, String[] mpids, HttpSession session) {
        star();
        try {
            User user = (User) session.getAttribute(Const.LOGIN_USER);
            //如果没有登录
            if(user == null){
                success(false);
                message("权限不足！");
                return end();
            }
            //如果已登录不为超管
            if(user!= null && !user.getType().equals("superAdmin")){
                success(false);
                message("权限不足！");
            }else {

                RoleAndPermission Pm = new RoleAndPermission();
                if(ppids != null && ppids.length != 0){
                    ArrayList<String> arrayList = new ArrayList<>(ppids.length);
                    Collections.addAll(arrayList, ppids);
                    Pm.setRoleId(pid);
                    Pm.setPermissionIdList(arrayList);
                    Pm.setUpdateTime(new Date());
                    permissionManaService.updatePermission(Pm);
                }

                RoleAndPermission projectMember = new RoleAndPermission();
                if(mpids != null && mpids.length != 0){
                    ArrayList<String> arrayList1 = new ArrayList<>(mpids.length);
                    Collections.addAll(arrayList1, mpids);
                    projectMember.setRoleId(mid);
                    projectMember.setPermissionIdList(arrayList1);
                    projectMember.setUpdateTime(new Date());
                    permissionManaService.updatePermission(projectMember);
                }
                //长度为0
                if(ppids == null){
                    //删除项目经理所有的权限
                    Pm.setRoleId(pid);
                    Pm.setCreateTime(new Date());
                    permissionManaService.deletePermission(Pm);

                }
                //长度为0
                if(mpids == null){
                    //删除项目成员所有的权限
                    projectMember.setRoleId(mid);
                    projectMember.setCreateTime(new Date());
                    permissionManaService.deletePermission(projectMember);
                }
                success(true);
            }
        } catch (Exception e) {
            logger.error("更新权限失败");
            e.printStackTrace();
            success(false);
            message(Const.TIP);
        }
        return end();
    }
}
