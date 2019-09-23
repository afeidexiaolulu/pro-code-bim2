package com.zy.bim.service;



import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;
import com.zy.bim.bean.UserRoleProject;
import com.zy.bim.bean.UserVO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


public interface ProjectMemberService extends IService<UserRoleProject>{

    PageInfo<UserVO> findAllProjectMember(HttpServletRequest request, Integer pageSize, Integer pageNo, String MembershipName,String orderCon, String orderMethod, String queryRole);

    //删除项目成员
    void deleteProjectMember(String[] ids, HttpServletRequest request);

    //添加项目成员
    Integer addProjectMember(String userId, String roleId, HttpServletRequest request);

    //更新项目成员角色
    Integer updateProjectMember(String oldRoleId, String newRoleId, Integer userId, Integer id, HttpSession session);
}
