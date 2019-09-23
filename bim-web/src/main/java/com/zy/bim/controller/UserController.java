package com.zy.bim.controller;

import com.zy.bim.bean.UserVO;
import com.zy.bim.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @program: pro-code-bim
 * @description: 用户模块
 * @author: LinChong
 * @create: 2019-09-03 14:31
 **/
@Controller
@RequestMapping("/bim/api/user")
public class UserController extends BaseController{
    private Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    /**
     * 查询同一项目成员
     * @param request
     * @return
     */
    @RequestMapping("selectUserByProject")
    @ResponseBody
    public Object selectUserByProject(HttpServletRequest request){
        star();
        data(userService.selectUserByProject(request));
        success(true);
        return end();
    }
}
