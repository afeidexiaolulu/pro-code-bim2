package com.zy.bim.service.Impl;


import com.zy.bim.bean.Problem;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.User;
import com.zy.bim.dao.ProjectMapper;
import com.zy.bim.service.ProjectService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sun.rmi.runtime.Log;

import java.util.List;
import java.util.Map;


/**
 * @author 王文强
 * @title: PermissionServiceImpl
 * @emal 17600817572@163.com
 * @date 2019/7/4 00049:38
 */

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private  static Logger log= LoggerFactory.getLogger(ProjectServiceImpl.class);

    @Autowired
    private ProjectMapper projectDao;
    @Override
    public void addproject(Project project) {

            //插入项目
            projectDao.addproject(project);
            //插入管理员信息
            projectDao.addprojectRole(project);
            //插入项目经理信息
            if (null!= project.getProjectManager()&&StringUtils.isNotBlank(project.getProjectManager())) {
                projectDao.addprojectManager(project);
            }
    }

    @Override
    public void updateProject(Project project) {
        projectDao.updateProject(project);
    }

    @Override
    public List<Map> findUser(String userName) {
     return    projectDao.findUser(userName);
    }

    @Override
    public List<Project> findAllproject(Map map) {
        return projectDao.findAllproject(map);
    }

    @Override
    public Project projectDetail(String projectId) {
        return projectDao.projectDetail(projectId);
    }

    @Override
    public List<User> projectAllUser(String projectId) {
        return projectDao.projectAllUser(projectId);
    }

    @Override
    public List<Problem> projectProblem(String projectId) {
        return projectDao.projectProblem(projectId);
    }

    @Override
    public Map findRole(Map map) {
        return projectDao.findRole(map);
    }

    @Override
    public List<String> findProblem(Map map) {
        return projectDao.findRroblem(map);
    }

    @Override
    public String findProblemImg(List<String> list) {
        return projectDao.findProblemImgList(list);
    }

    @Override
    public List<Map<String, String>> findModelList(Map map) {
        return projectDao.findModelList(map);
    }

    @Override
    public void deleteProjectAll(Map map, List<String> list, List<Map<String, String>> maplist) {

            projectDao.deleteProjectAll(map.get("ProjectId").toString());
            if (null!=list&&!list.isEmpty()){
                //删除问题
                projectDao.deleteFileattachment(list);
            }
            if (null!=maplist&&!maplist.isEmpty()){
                //删除模型数据
                projectDao.deleteModelFileattachment(maplist);
            }
    }

    @Override
    public String getCreatePersonNameById(String createPersonId) {
        return projectDao.getCreatePersonNameById(createPersonId);
    }
}
