package com.zy.bim.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.ProjectVO;
import com.zy.bim.bean.User;
import com.zy.bim.bean.UserVO;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 2:30
 */
public interface UserService extends IService<User> {
    //登录
    User doLogin(String accountNumber, String passWord);

    //插入
    Integer saveUser(User user);

    //根据用户名查询用户
    User getUserByName(String userName);

    //根据用户名，邮箱，手机号码模糊查询用户
    List<User> queryUserByLike(String userName, String phoneNumber, String email);

    //通过手机查用户
    List<User> getUserByPhone(String phoneNumber);

    //验证验证码是否过期
    Boolean checkAuthCodeTime(HttpSession session);

    //更新密码
    void updateUserPassWord(String phoneNumber, String newPassWord);

    //更新密码
    Boolean updateUserPassWord(String authCode, String phoneNumber, String newPassWord, HttpSession session);

    //通过用户id获取用户相关项目
    List<ProjectVO> getProjectByUserId(Integer userId);

    //通过用户电话号码查找用户
    User getUserByPhoneNumber(String mobile);

    /**
     * 查询同一项目成员
     * @param request 入参
     * @return
     */
    List<UserVO> selectUserByProject(HttpServletRequest request);

    //根据用户名，手机号码在同时查询用户(移动端需求)
    List<User> queryUserByUesrNameAndPhoneNumber(String uesrNameAndPhoneNumber);

    //根据用户id更新用户头像及部门信息
    void updateIconAndDepartment(User user);
}
