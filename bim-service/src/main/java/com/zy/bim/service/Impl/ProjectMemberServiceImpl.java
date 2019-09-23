package com.zy.bim.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.User;
import com.zy.bim.bean.UserRoleProject;
import com.zy.bim.bean.UserVO;
import com.zy.bim.dao.ProjectMapper;
import com.zy.bim.dao.UserMapper;
import com.zy.bim.dao.UserRoleProjectMapper;
import com.zy.bim.service.ProjectMemberService;
import com.zy.bim.util.Const;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ProjectMemberServiceImpl extends ServiceImpl<UserRoleProjectMapper, UserRoleProject> implements ProjectMemberService {

    private static Logger logger = LoggerFactory.getLogger(ProjectMemberServiceImpl.class);

    @Autowired
    private UserRoleProjectMapper userRoleProjectMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ProjectMapper projectMapper;


    //返回所有的项目成员
    @Override
    public PageInfo<UserVO> findAllProjectMember(HttpServletRequest request, Integer pageSize, Integer pageNo, String MembershipName, String orderCon, String orderMethod, String queryRole ) {
        //查询出用户所选项目的id
        HttpSession session = request.getSession();

        String projectId = (String) session.getAttribute(Const.PROJECT_ID);

        //查询项目下的所有成员
        List<String> userIds = userRoleProjectMapper.findAllProjectMember(projectId);



        if(userIds.size() != 0){
            PageHelper.startPage(pageNo,pageSize);
            List<UserVO> userVOS = userMapper.userUserVO(userIds, MembershipName, orderCon, orderMethod, queryRole, projectId);

            PageInfo<UserVO> userVOPageInfo = new PageInfo<>(userVOS,5);
            return userVOPageInfo;
        }else {
            return new PageInfo<>() ;
        }
    }

    //删除项目成员
    @Override
    public void deleteProjectMember(String[] ids, HttpServletRequest request) {
        if(ids.length == 0  && ids == null){
            throw new RuntimeException("请选择用户后再进行删除！");
        }
        HttpSession session = request.getSession();
        String projectId = (String) session.getAttribute(Const.PROJECT_ID);
        //查询此项目的创建人，并查询创建人在项目中担任几个角色
        List<UserRoleProject> userRoleProjectList = userRoleProjectMapper.selectCreatePersonByProjectId(projectId);
        //如果创建人担任一个角色并删除id中包含此创建人在表中的id
        if(userRoleProjectList.size() == 1 && Arrays.asList(ids).contains(userRoleProjectList.get(0).getId().toString())){
            logger.debug("项目创建人只包含一个角色不能删除");
            throw new RuntimeException("项目创建人不能被删除！");
        }
        //如果创建人包含两个角色
        if(userRoleProjectList.size() == 2){
            //查询出角色为项目管理员的表数据id
            String tableId = "";
            for (UserRoleProject userRoleProject : userRoleProjectList) {
                 if(userRoleProject.getRoleId().equals("1")) {
                     tableId = userRoleProject.getId().toString();
                 }
            }
            //判断表数据id是否在删除的队列中 如果在  返回异常
            if (Arrays.asList(ids).contains(tableId)){
               logger.debug("项目创建人只包含两个角色，删除的角色包含项目管理员");
               throw new RuntimeException("项目创建人的项目管理员角色不能被删除！");
            }
        }
        //调试时写死数据
        //String projectId = "1";
        int delete = userRoleProjectMapper.deleteProjectMember(ids, projectId);
        logger.info("删除的关联表id为：{}，项目id为：{}",ids,projectId);
        if(delete != ids.length){
            logger.error("删除用户失败");
            throw new RuntimeException("删除用户失败");
        }
    }

    //添加项目成员
    @Override
    public Integer addProjectMember(String userId, String roleId ,HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute(Const.LOGIN_USER);
        String projectId = (String) session.getAttribute(Const.PROJECT_ID);
        //一个用户只能在同一个项目中不能担任同一个角色
        QueryWrapper<UserRoleProject> wrapper = new QueryWrapper<>();
        wrapper.eq("project_id",projectId);
        wrapper.eq("user_id",userId);
        wrapper.eq("role_id",roleId);
        //统计是否同一用户，同一项目下已有此角色
        Integer integer = userRoleProjectMapper.selectCount(wrapper);
        if(integer == 1){
            return 1; //已有用户已有相同角色
        }

        QueryWrapper<UserRoleProject> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.eq("project_id", projectId);
        List<UserRoleProject> userRoleProjects = userRoleProjectMapper.selectList(queryWrapper);
        //此用户在此项目中没有任何角色  插入
        if(userRoleProjects.size() == 0){
            UserRoleProject userRoleProject = new UserRoleProject(null, userId, roleId, projectId, new Date(), null, user.getId().toString(), null);
            //插入到数据库中
            int insert = userRoleProjectMapper.insert(userRoleProject);
            if(insert != 1){
                throw new RuntimeException();
            }
            return 0;//添加成功
        }else if(userRoleProjects.size() == 1) {
            //如果是项目管理员只有一个角色  可以新加项目经理
            if (userRoleProjects.get(0).getRoleId().equals("1")) {
                if (roleId.equals("2")) {
                    UserRoleProject userRoleProject = new UserRoleProject(null, userId, roleId, projectId, new Date(), null, user.getId().toString(), null);
                    //插入到数据库中
                    int insert = userRoleProjectMapper.insert(userRoleProject);
                    if (insert != 1) {
                        throw new RuntimeException();
                    }
                    return 0; //添加成功
                } else {
                    return 3;       //只能添加经理角色
                }
            }

            if (userRoleProjects.get(0).getRoleId().equals("2")) {
                if (roleId.equals("1")) {
                    UserRoleProject userRoleProject = new UserRoleProject(null, userId, roleId, projectId, new Date(), null, user.getId().toString(), null);
                    //插入到数据库中
                    int insert = userRoleProjectMapper.insert(userRoleProject);
                    if (insert != 1) {
                        throw new RuntimeException();
                    }
                    return 0; //添加成功
                } else {
                    return 4;       //只能添加项目管理员角色
                }
            }
        }else {
            return 2;   //可分配角色已满
        }
        return 5;
    }


    //更新项目成员角色
    @Override
    public Integer updateProjectMember(String oldRoleId, String newRoleId, Integer userId, Integer Id, HttpSession session) {
        String projectId = (String) session.getAttribute(Const.PROJECT_ID);
        User user = (User) session.getAttribute(Const.LOGIN_USER);
        //新旧角色一样，直接返回
        if(oldRoleId.equals(newRoleId)){
            return 0;//更新成功
        }
        //查询此项目的项目创建人
        QueryWrapper<Project> wrapper1 = new QueryWrapper<>();
        wrapper1.eq("id",projectId);
        Project project = projectMapper.selectOne(wrapper1);
        //获取创建人Id
        String createPersonId = "";
        if(project != null){
            createPersonId = project.getCreatePerson();
        }
        //如果要改的老角色为项目管理员且为项目创建人
        if(oldRoleId.equals("项目管理员") && String.valueOf(userId).equals(createPersonId)){
            return 4;
        }
        //如果要改的老角色为项目管理员且不为项目创建人
        if(oldRoleId.equals("项目管理员")) {
            //查询此项目有几个项目管理员
            QueryWrapper<UserRoleProject> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("project_id",projectId);
            queryWrapper.eq("role_id",1);
            List<UserRoleProject> userRoleProjects = userRoleProjectMapper.selectList(queryWrapper);
            //如果只有一个项目管理员
            if(userRoleProjects.size() == 1){
                return 1; //项目必须有一个管理员
            }
            //如果已有项目经理角色，不让改
            QueryWrapper<UserRoleProject> wrapper = new QueryWrapper<>();
            wrapper.eq("project_id", projectId);
            wrapper.eq("user_id", userId);
            wrapper.eq("role_id",2);
            List<UserRoleProject> userRoleProjects1 = userRoleProjectMapper.selectList(wrapper);
            if(userRoleProjects1.size() != 0){
                return 2; //角色冲突 修改失败
            }
            //可以修改
            UserRoleProject userRoleProject = new UserRoleProject();
            if(newRoleId.equals("项目经理")){
                userRoleProject.setRoleId("2");
            }
            if(newRoleId.equals("项目成员")){
                userRoleProject.setRoleId("3");

            }
            userRoleProject.setUpdatePerson(user.getId().toString());
            userRoleProject.setUpdateTime(new Date());
            UpdateWrapper<UserRoleProject> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("project_id",projectId);
            updateWrapper.eq("user_id",userId);
            updateWrapper.eq("role_id",1);
            //更新
            userRoleProjectMapper.update(userRoleProject,updateWrapper);
            return 0;//修改成功
        }
        //如果要改的老角色为项目经理
        if(oldRoleId.equals("项目经理")){
            //已有项目管理员权限 不可以更改
            QueryWrapper<UserRoleProject> wrapper = new QueryWrapper<>();
            wrapper.eq("project_id", projectId);
            wrapper.eq("user_id", userId);
            wrapper.eq("role_id",1);
            List<UserRoleProject> userRoleProjects2 = userRoleProjectMapper.selectList(wrapper);
            if(userRoleProjects2.size() != 0){
                return 2; //角色冲突 修改失败
            }
            //可以修改
            UserRoleProject userRoleProject = new UserRoleProject();
            if(newRoleId.equals("项目管理员")){
                userRoleProject.setRoleId("1");
                userRoleProject.setUpdatePerson(user.getId().toString());
            }
            if(newRoleId.equals("项目成员")){
                userRoleProject.setRoleId("3");
                userRoleProject.setUpdatePerson(user.getId().toString());
            }
            userRoleProject.setUpdateTime(new Date());
            UpdateWrapper<UserRoleProject> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("project_id",projectId);
            updateWrapper.eq("user_id",userId);
            updateWrapper.eq("role_id",2);
            //更新
            userRoleProjectMapper.update(userRoleProject,updateWrapper);
            return 0;  //修改成功
        }
        //如果要改的老角色为项目成员
        if(oldRoleId.equals("项目成员")){
            //可以随意改
            UserRoleProject userRoleProject = new UserRoleProject();
            if(newRoleId.equals("项目管理员")){
                userRoleProject.setRoleId("1");
            }
            if(newRoleId.equals("项目经理")){
                userRoleProject.setRoleId("2");

            }
            userRoleProject.setUpdateTime(new Date());
            userRoleProject.setUpdatePerson(user.getId().toString());
            UpdateWrapper<UserRoleProject> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("project_id",projectId);
            updateWrapper.eq("user_id",userId);
            updateWrapper.eq("role_id",3);
            //更新
            userRoleProjectMapper.update(userRoleProject,updateWrapper);
            return 0;  //修改成功
        }
        return 3;
    }
}
