package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.UserRoleProject;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/5 0005 下午 2:53
 */
@Component
public interface UserRoleProjectMapper extends BaseMapper<UserRoleProject> {

    List<String> findAllProjectMember(@Param("projectId") String projectId);

    int deleteProjectMember(@Param("ids") String[] ids, @Param("projectId") String projectId);

    UserRoleProject findRoleId(@Param("userId") String userId, @Param("projectId")String projectId);

    @Select("SELECT tu.id, tu.user_id, tu.role_id FROM t_user_role_project tu WHERE tu.user_id = (SELECT tp.create_person FROM t_project tp WHERE tp.id = #{projectId})")
    List<UserRoleProject> selectCreatePersonByProjectId(String projectId);
}
