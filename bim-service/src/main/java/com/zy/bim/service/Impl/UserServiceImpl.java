package com.zy.bim.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.ProjectVO;
import com.zy.bim.bean.User;
import com.zy.bim.bean.UserVO;
import com.zy.bim.dao.ProjectMapper;
import com.zy.bim.dao.UserMapper;
import com.zy.bim.service.UserService;
import com.zy.bim.util.Const;
import com.zy.bim.util.MD5Utils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.formula.functions.Now;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 2:32
 */


@Service
@Transactional
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ProjectMapper projectMapper;

    //根据用户名查询
    @Override
    public User doLogin(String accountNumber, String passWord) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("account_number", accountNumber);
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            //用户为注册
            throw new RuntimeException(Const.LOGIN_LOGINACCT_ERROR);
        } else {
            //对password进行加密
            passWord = MD5Utils.digestPassWord(accountNumber, passWord);
            if (passWord.equals(user.getPassWord())) {
                return user;
            } else {
                throw new RuntimeException(Const.LOGIN_LOGINACCT_ERROR);
            }
        }
    }

    //增加用户
    @Override
    public Integer saveUser(User user) {
        //密码加密
        String digestPassWord = MD5Utils.digestPassWord(user.getPhoneNumber(),user.getPassWord());
        user.setPassWord(digestPassWord);
        user.setCreateTime(new Date());
        user.setAccountNumber(user.getPhoneNumber());  //账号和手机号码保持一致
        user.setType("normal");
        Integer insert = userMapper.insert(user);
        if(insert != 1){
            throw new RuntimeException("注册用户失败");
        }
        return insert;
    }

    //根据用户名查询用户
    @Override
    public User getUserByName(String userName) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_name", userName);
        User user = userMapper.selectOne(queryWrapper);
        return user;
    }

    //根据用户名，手机号，邮箱模糊查询用户
    @Override
    public List<User> queryUserByLike(String userName, String phoneNumber, String email) {
        List<User> userList = userMapper.queryUserByLike(userName, phoneNumber, email);
        return userList;
    }

    //通过手机查用户
    @Override
    public List<User> getUserByPhone(String phoneNumber) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("phone_number", phoneNumber);
        List<User> userList = userMapper.selectList(queryWrapper);
        return userList;
    }


    /**
     * 验证码是否过期
     * @param session
     * @return
     */
    @Override
    public Boolean checkAuthCodeTime(HttpSession session) {
        Long codeCreatTime = (Long) session.getAttribute(Const.CODE_TIME);
        //过期
        if((codeCreatTime != null) && (System.currentTimeMillis() - codeCreatTime)>1000*60*30){
            session.removeAttribute(Const.RANDOM_CODE);
            //验证码过期  后面直接不走 返回结果即可
            return false;
        }else {
            return true;
        }
    }


    /**
     * 更新密码
     * @param phoneNumber
     * @param newPassWord
     */
    @Override
    public void updateUserPassWord(String phoneNumber, String newPassWord) {
        User user = new User();
        user.setPassWord(MD5Utils.digestPassWord(phoneNumber, newPassWord));
        //更新
        UpdateWrapper<User> wrapper = new UpdateWrapper<>();
        wrapper.eq("phone_number", phoneNumber);
        userMapper.update(user, wrapper);
    }


    /**
     *
     * 更新密码方法重载
     * @param phoneNumber
     * @param newPassWord
     * @param session
     * @return
     */
    @Override
    public Boolean updateUserPassWord(String authCode, String phoneNumber, String newPassWord, HttpSession session) {
        //获取验证码
        String randCode = (String) session.getAttribute(Const.RANDOM_CODE);
        //比较验证码
        if(!StringUtils.isEmpty(authCode)&&authCode.equals(randCode)){
            updateUserPassWord(phoneNumber, newPassWord);
            session.removeAttribute(Const.RANDOM_CODE);
            return true;
        }else {
            return false;
        }
    }

    /**
     * 根据用户id获取用户相关项目
     * @param userId
     * @return
     */
    @Override
    public List<ProjectVO> getProjectByUserId(Integer userId) {
        List<ProjectVO> projectList = projectMapper.getProjectByUserId(userId);

        return projectList;
    }

    //根据手机号查询用户
    @Override
    public User getUserByPhoneNumber(String mobile) {
        return userMapper.getUserByPhoneNumber(mobile);
    }

    /**
     *  查询同一项目成员
     * @param request 项目id
     * @return
     */
    @Override
    public List<UserVO> selectUserByProject(HttpServletRequest request) {
        String projectId = (String) request.getSession().getAttribute(Const.PROJECT_ID); //项目id
        if(StringUtils.isNotEmpty(projectId)){
            return userMapper.queryUserByProject(Integer.parseInt(projectId));
        }
        return null;
    }

    @Override
    public List<User> queryUserByUesrNameAndPhoneNumber(String uesrNameAndPhoneNumber) {
        List<User> userList = userMapper.queryUserByUesrNameAndPhoneNumber(uesrNameAndPhoneNumber);
        return userList;
    }

    @Override
    public void updateIconAndDepartment(User user) {
        userMapper.updateById(user);
    }
}
