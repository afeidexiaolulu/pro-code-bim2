package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.Problem;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.ProjectVO;
import com.zy.bim.bean.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Mapper
@Component
public interface ProjectMapper extends BaseMapper<Project> {
    int addproject(Project project);

    void addprojectRole(Project project);

    void addprojectManager(Project project);

    void updateProject(Project project);

    List<Map> findUser(String userName);

    List<Project> findAllproject(Map map);

    Project projectDetail(String projectId);

    List<User> projectAllUser(String projectId);

    List<Problem> projectProblem(String projectId);

    Map findRole(Map map);

    List<String> findRroblem(Map map);


    String findProblemImgList(List<String> list);

    List<Map<String, String>> findModelList(Map map);

    void deleteProjectAll(String id);

    void deleteFileattachment(List<String> list);

    void deleteModelFileattachment(List<Map<String, String>> maplist);

    //根据用户id查询用户相关项目
    List<ProjectVO> getProjectByUserId(Integer userId);

    //根据用户id查找用户姓名
    String getCreatePersonNameById(String createPersonId);
}
