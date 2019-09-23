package com.zy.bim.controller;


import com.zy.bim.bean.Project;
import com.zy.bim.service.PermissionCheckService;
import com.zy.bim.util.Const;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.util.List;


/**
 * 检查用户是否已选择项目，根据用户已选项目查询权限
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/5 0005 下午 1:58
 */

@Controller
@RequestMapping("/bim")
public class PermissionCheckController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(PermissionCheckController.class);

    @Autowired
    private PermissionCheckService permissionCheckService;

    /**
     * 用户选择项目id 放入session中
     */
    @PostMapping("/userSelectProject")
    @ResponseBody
    public Object userSelectProject(String projectId, HttpSession session){
        star();
        try{
            Project project = permissionCheckService.userSelectProject(projectId, session);
            success(true);
            message("选择项目id成功");
            //将选择项目返回
            data(project);
            logger.info("选择项目成功，选择项目为：{}",project);
        }catch (Exception e){
            e.printStackTrace();
            logger.error("选择项目id失败。");
            success(false);
            message("选择项目id失败");
        }
        return end();
    }

    //用户根据项目id将权限查出
    @GetMapping("/userGetPermission")
    @ResponseBody
    public Object userSelectPermission(HttpSession session){
        star();
        try {
            //先判断是否已选择项目
            String projectId =(String) session.getAttribute(Const.PROJECT_ID);
            if(projectId == null){
                success(false);
                message("请先选择项目。");
            }else{
                List<String> permissions = permissionCheckService.userSelectPermission(session, projectId);
                logger.info("用户拥有权限为{}", permissions);
                success(true);
                data(permissions);
            }
        }catch (Exception e){
            e.printStackTrace();
            logger.error("用户查询权限失败。");
            success(false);
            message(e.getMessage());
        }
        return end();
    }
}
