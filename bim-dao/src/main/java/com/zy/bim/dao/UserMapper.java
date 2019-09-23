package com.zy.bim.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.User;
import com.zy.bim.bean.UserVO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 2:30
 */
@Component
public interface UserMapper extends BaseMapper<User> {

    //根据用户名，邮箱，手机号码模糊查询用户
    List<User> queryUserByLike(@Param("userName") String userName, @Param("phoneNumber") String phoneNumber, @Param("email") String email);


    List<UserVO> userUserVO(@Param("userIds") List<String> userIds, @Param("membershipName") String membershipName, @Param("orderCon") String orderCon, @Param("orderMethod") String orderMethod, @Param("queryRole") String queryRole, @Param("projectId") String projectId);

    //根据手机号,寻找用户
    @Select("SELECT * FROM t_user where account_number = #{mobile}")
    User getUserByPhoneNumber(String mobile);

    /**
     * 查询同一项目成员
     * @return
     */
    List<UserVO> queryUserByProject(@Param("projectId")Integer projectId);

    //根据用户名，邮箱，手机号码模糊查询用户
    List<User> queryUserByUesrNameAndPhoneNumber(@Param("uesrNameAndPhoneNumber")String uesrNameAndPhoneNumber);
}
