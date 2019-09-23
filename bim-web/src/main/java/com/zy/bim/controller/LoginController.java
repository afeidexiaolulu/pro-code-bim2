package com.zy.bim.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.zy.bim.bean.AccessToken;
import com.zy.bim.bean.User;
import com.zy.bim.service.PermissionManaService;
import com.zy.bim.service.UserService;
import com.zy.bim.util.Const;
import com.zy.bim.util.HttpClientUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 2:29
 */

@Controller
@RequestMapping("/bim")
@Slf4j
public class LoginController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PermissionManaService permissionManaService;


    //跳转到登录页面
    @RequestMapping("/login")
    public String toLogin(){
        return "login";
    }

    //跳转到主页页面
    @RequestMapping("/index")
    public String toIndex(){

        return "index";
    }


    @PostMapping("/doLogin")
    @ResponseBody
    public Object doLogin(String accountNumber, String passWord, HttpSession session){
        star();
        try {
            User user = userService.doLogin(accountNumber, passWord);
            //将用户存入session
            session.setAttribute(Const.LOGIN_USER,user);
            //查询所有的权限放入session中
            List<String> permissionsStr = permissionManaService.queryAllPermission();
            session.setAttribute(Const.ALLPERMISSION,permissionsStr);
            success(true);
            //返回用户类型
            message(user.getType());
            //返回用户名
            HashMap<String, String> userNameMap = new HashMap<>();
            userNameMap.put("userName",user.getUserName());
            userNameMap.put("phoneNumber",user.getPhoneNumber());
            userNameMap.put("icon",user.getIcon());
            data(userNameMap);
            logger.info(accountNumber+"登录成功，用户信息插入session中");
        }catch (Exception e){
            e.printStackTrace();
            logger.error(accountNumber+"登录失败"+e.getMessage());
            success(false);
            message("密码或账号错误");
        }
        return end();
    }


    //退出
    @ResponseBody
    @RequestMapping("/loginOut")
    public Object loginOut(HttpSession session){
        star();
        //销毁session
        if(session != null){
            User user = (User) session.getAttribute(Const.LOGIN_USER);
            logger.info(user.getUserName()+"退出登录");
            //移除登录用户
            session.removeAttribute(Const.LOGIN_USER);
            session.invalidate();
            success(true);
        }else {
            success(false);
        }
        return end();
    }

    /**
     * 进入微信回调函数，返回code
     * @param code
     * @param
     */
    @RequestMapping("/weixintDoLogin")
    public String weixintest(String code, HttpSession session){
        //携带code请求userId
        String userIdUrl = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token="+ AccessToken.bimAccessToken +"&code="+code;
        String userResult = HttpClientUtil.doGet(userIdUrl);
        JSONObject jsonObject = JSON.parseObject(userResult);
        String userId = jsonObject.getString("UserId");
        //通过userId获取User详细信息
        String addressUrl = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token="+ AccessToken.addressBookAccessToken+"&userid="+userId;
        String addressResult = HttpClientUtil.doGet(addressUrl);
        JSONObject object = JSON.parseObject(addressResult);
        String mobile = object.getString("mobile");
        log.info("查询出的手机号码为{}",mobile);
        //根据查询出的手机号码从用户数据库中查询
        User user = userService.getUserByPhoneNumber(mobile);
        //如果查询到
        if(user != null){
            //更新用户头像及部门
            String avatar = object.getString("avatar"); //微信头像
            if(StringUtils.isNotEmpty(avatar)){
                user.setIcon(avatar);
            }
            String departmentIdStr = object.getString("department"); //微信部门id
            if(StringUtils.isNotEmpty(departmentIdStr)){
                //截串
                int begin = departmentIdStr.lastIndexOf("[")+1;
                int end = departmentIdStr.length()-1;
                String departmentId = departmentIdStr.substring(begin,end);

                //根据部门id获取部门名称
                String deptUrl = "https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token="+ AccessToken.addressBookAccessToken +"&id="+departmentId;
                String deptResult = HttpClientUtil.doGet(deptUrl);
                JSONObject deptJsonObject = JSON.parseObject(deptResult);
                String departmentInfo = deptJsonObject.getString("department");

                List<Map> deptnfoJsonObject = JSON.parseArray(departmentInfo, Map.class);
                Map map = new HashMap();
                for (int i = 0; i < deptnfoJsonObject.size(); i++) {
                    map = deptnfoJsonObject.get(i);
                }
                String departmentName = (String)map.get("name");
                user.setDepartment(departmentName);
            }
            userService.updateIconAndDepartment(user);
            //将用户id放入session中并进行页面跳转
            session.setAttribute(Const.LOGIN_USER,user);
            return "redirect:/bim/webApp/index";
        }else {
            //没有跳转到注册页面，进行注册
            return "redirect:/bim/webApp/zhuche";
        }
    }

    /**
     * 查询当前登录用户信息
     */
    @PostMapping("/queryUserInfo")
    @ResponseBody
    public Object queryUserInfo(HttpServletRequest request, HttpServletResponse response){
        star();
        try {
            User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
            HashMap<String, String> userNameMap = new HashMap<>();
            userNameMap.put("userName",user.getUserName()); //返回用户名
            userNameMap.put("phoneNumber",user.getPhoneNumber());   //返回用户电话
            userNameMap.put("icon",user.getIcon()); //返回用户头像
            userNameMap.put("department",user.getDepartment()); //返回用户部门
            //返回用户类型
            message(user.getType());
            data(userNameMap);
        }catch (Exception e){
            e.printStackTrace();
            success(false);
            message("查询失败");
        }
        return end();
    }

}
