package com.zy.bim.controller;

import com.github.pagehelper.PageInfo;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.ProjectVO;
import com.zy.bim.bean.User;
import com.zy.bim.bean.UserVO;
import com.zy.bim.service.ProjectMemberService;
import com.zy.bim.service.UserService;
import com.zy.bim.util.Const;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author 陈坤鹏
 * @version 1.00
 * @time 2019/07/08 上午 10:32
 */
@Controller
@RequestMapping("bim/projectMember")
public class ProjectMemberController extends BaseController {

    private static Logger logger = LoggerFactory.getLogger(ProjectMemberController.class);

    @Autowired
    private ProjectMemberService projectMemberService;

    @Autowired
    private UserService userService;


    //跳转到项目成员界面
    @RequestMapping("/projectTeam")
    public String toProjectTeam(HttpServletRequest request){
        return "ProjectTeam/ProjectTeam";
    }

    //跳转到项目成员添加界面
    @RequestMapping("/addmembers")
    public String toAddmembers(HttpServletRequest request){
        return "ProjectTeam/Addmembers";
    }

    //跳转到项目成员修改界面
    @RequestMapping("/modifyRoles")
    public String toModifyRoles(HttpServletRequest request){
        return "ProjectTeam/ModifyRoles";
    }

    //分页查询此项目成员
    @RequestMapping("/findAllProjectMember")
    @ResponseBody
    public Object findAllProjectMember(HttpServletRequest request, Integer pageSize, Integer pageNo,
                                       @RequestParam(name="MembershipName",defaultValue = "") String MembershipName,
                                       @RequestParam(name="orderCondition",defaultValue = "roleName") String orderCondition,
                                       @RequestParam(name="orderMethod",defaultValue = "desc") String orderMethod,
                                       @RequestParam(name="queryRole",defaultValue = "") String queryRole){
        star();
        try {
            PageInfo<UserVO> userList = projectMemberService.findAllProjectMember(request, pageSize, pageNo, MembershipName,orderCondition,orderMethod, queryRole);
            success(true);
            data(userList);
        } catch (Exception e) {
            e.printStackTrace();
            success(false);
            message("查询项目成员失败！");
        }
        return end();
    }

    //删除项目成员
    @PostMapping("/deleteProjectMember")
    @ResponseBody
    public Object deleteProjectMember(String[] ids, HttpServletRequest request){
        star();
        try {
            projectMemberService.deleteProjectMember(ids, request);
            success(true);
        }catch (Exception e){
            success(false);
            //返回消息
            message(e.getMessage());
        }
        return end();
    }

    //添加项目成员
    @PostMapping("/addProjectMember")
    @ResponseBody
    public Object addProjectMember(String userId, String roleId, HttpServletRequest request){
        star();
        try {
            Integer result = projectMemberService.addProjectMember(userId, roleId, request);
            if(result == 0){
                success(true);
                message("添加项目成员成功");
            }
            if(result == 1){
                success(false);
                message("此用户已有相同角色");
            }
            if(result == 2){
                success(false);
                message("此用户可分配角色已满");
            }
            if(result == 3){
                success(false);
                message("只能新增项目经理角色");
            }
            if(result == 4){
                success(false);
                message("只能新增项目管理员角色");
            }
            if(result == 5){
                success(false);
                message(Const.TIP);
            }
        }catch (Exception e){
            e.printStackTrace();
            success(false);
            message(Const.TIP);
            logger.error("添加用户角色失败");
        }
        return end();
    }

    //根据用户名，手机号码，邮箱模糊查询用户
    @PostMapping("/queryUserByLike")
    @ResponseBody
    public Object queryUserByLike(@RequestParam(value = "userName" ,defaultValue = "") String userName,
                                  @RequestParam(value = "phoneNumber" ,defaultValue = "") String phoneNumber,
                                  @RequestParam(value = "email" ,defaultValue = "") String email){
        star();
        try {
            List<User> users=  userService.queryUserByLike(userName, phoneNumber, email);
            data(users);
            success(true);
        }catch (Exception e){
            e.printStackTrace();
            success(false);
            message(Const.TIP);
        }
        return end();
    }

    //根据用户名，手机号码在同时查询用户(移动端需求)
    @PostMapping("/queryUserByUesrNameAndPhoneNumber")
    @ResponseBody
    public Object queryUserByUesrNameAndPhoneNumber(@RequestParam(value = "uesrNameAndPhoneNumber" ,defaultValue = "") String uesrNameAndPhoneNumber){
        star();
        try {
            List<User> users=  userService.queryUserByUesrNameAndPhoneNumber(uesrNameAndPhoneNumber);
            data(users);
            success(true);
        }catch (Exception e){
            e.printStackTrace();
            success(false);
            message(Const.TIP);
        }
        return end();
    }


    //修改项目成员角色
    @ResponseBody
    @RequestMapping("/updateProjectMember")
    public Object updateProjectMember(String oldRoleId, String newRoleId, Integer userId, Integer Id, HttpSession session){
        star();
        try {
            //更新项目成员  接收关联表主键  暂时无用
            Integer integer = projectMemberService.updateProjectMember(oldRoleId, newRoleId, userId, Id, session);
            if(integer == 0){
                success(true);
                message("更新角色成功");
                logger.info("更新角色成功");
            }
            if(integer == 1){
                success(false);
                message("项目必须有一个管理员");
                logger.info("项目必须有一个管理员");
            }
            if(integer == 2){
                success(false);
                message("项目成员只能同时拥有项目管理员和项目经理角色");
                logger.info("角色冲突 无法修改");
            }
            if(integer == 3){
                success(false);
                message(Const.TIP);
                logger.info("系统传入的oldId不正确");
            }
            if(integer == 4){
                success(false);
                message("项目创建人角色不能修改");
                logger.info("项目创建人角色不能修改");
            }
        }catch (Exception e){
            e.printStackTrace();
            success(false);
            message(Const.TIP);
            logger.error("修改项目成员角色失败");
        }
        return end();
    }


    /**
     * 根据用户id 查询和此用户相关的项目
     *
     */
    @ResponseBody
    @RequestMapping("/getProjectByUserId")
    public Object getProjectByUserId (HttpSession session){
        User user = (User) session.getAttribute(Const.LOGIN_USER);
        star();
        try {
            if(user != null){
                Integer userId = user.getId();
                List<ProjectVO> projects = userService.getProjectByUserId(userId);
                success(true);
                data(projects);
            }else {
                success(false);
                message("用户未登陆");
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("通过用户Id获取相关项目失败，用户Id:{}",user.getId());
            success(false);
            message(Const.TIP);
        }
        return end();
    }
}
