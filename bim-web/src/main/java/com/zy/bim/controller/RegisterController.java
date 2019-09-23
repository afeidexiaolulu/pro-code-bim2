package com.zy.bim.controller;


import com.zy.bim.bean.User;
import com.zy.bim.service.MessageService;
import com.zy.bim.service.UserService;
import com.zy.bim.util.Const;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpSession;
import java.util.List;


/**
 *
 * 注册的controller
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 4:16
 */
@Controller
@RequestMapping("/bim")
public class RegisterController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(RegisterController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    //查询手机是否唯一
    @PostMapping("/getUserByPhone")
    @ResponseBody
    public Object getUserByPhone(String phoneNumber){
        star();
        try {
            List<User> users =  userService.getUserByPhone(phoneNumber);
           if(users.size() != 0){
               success(false);
               message("此号码已被注册");
           }else {
               success(true);
               message("号码可以注册");
           }
        } catch (Exception e) {
            success(false);
            message(Const.TIP);
            e.printStackTrace();
            logger.error("查询手机号是否唯一异常");
        }
        return end();
    }

    //发送验证码
    @PostMapping("/sendMessage")
    @ResponseBody
    public Object sendMessage(String phoneNumber, HttpSession session) {
        star();
        try {
            messageService.sendMessage(phoneNumber, session);
            success(true);
            message("短信发送成功");
            logger.info("短信发送成功");
        } catch (Exception e) {
            success(false);
            message(Const.TIP);
            e.printStackTrace();
            logger.error("发送验证码失败");
        }
        return end();
    }


    //验证验证码是否正确 并注册
    @PostMapping("/registerUser")
    @ResponseBody
    public Object msgVerification(String authCode, User user, HttpSession session){
        star();
        try {
            //验证 验证码是否过期
            if(userService.checkAuthCodeTime(session) == false){
                success(false);
                message("验证码已过期");
                return end();
            }

            //获取验证码
            String randCode = (String) session.getAttribute(Const.RANDOM_CODE);
            //比较验证码
            if(!StringUtils.isEmpty(authCode)&&authCode.equals(randCode)){
                userService.saveUser(user);
                session.removeAttribute(Const.RANDOM_CODE);
                success(true);
                message("用户注册成功");
                logger.info("用注册成功"+user);
            }else {
                success(false);
                message(Const.AUTHCODE_ERROR);
                logger.info("验证码不正确");
            }
        }catch (Exception e){
            success(false);
            message(Const.TIP);
            e.printStackTrace();
            logger.error("系统异常"+e.getMessage());
        }
        return end();
    }


    //密码找回
    @ResponseBody
    @PostMapping("/updatePassWord")
    public Object updatePassWord(String phoneNumber,String newPassWord, String authCode, HttpSession session){
        star();
        try {
            if(userService.checkAuthCodeTime(session) == false){
                message("验证码过期");
                success(false);
                return end();
            }
            //密码更新
            Boolean updateResult =  userService.updateUserPassWord(authCode,phoneNumber,newPassWord,session);
            if(updateResult){
                session.removeAttribute(Const.RANDOM_CODE);
                success(true);
                message("用户更新密码成功");
            }else {
                success(false);
                message(Const.AUTHCODE_ERROR);
                logger.info("验证码不正确");
            }
        } catch (Exception e) {
            e.printStackTrace();
            message(Const.TIP);
            success(false);
        }
        return end();
    }

}
