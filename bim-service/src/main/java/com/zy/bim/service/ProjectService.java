package com.zy.bim.service;

import com.zy.bim.bean.Problem;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.User;

import java.util.List;
import java.util.Map;

public interface ProjectService {

    void addproject(Project project);

    void updateProject(Project project);

    List<Map> findUser(String userName);

    List<Project> findAllproject(Map map);

    Project projectDetail(String projectId);

    List<User> projectAllUser(String projectId);

    List<Problem> projectProblem(String projectId);

    /**
     * 根据项目id 和用户id 查询用户是否为当前用户的项目管理员
     * @param map
     * @return
     */
    Map findRole(Map map);

    List<String> findProblem(Map map);

    String findProblemImg(List<String> list);

    List<Map<String, String>> findModelList(Map map);

    void deleteProjectAll(Map map, List<String> list, List<Map<String, String>> maplist);

    String getCreatePersonNameById(String createPersonId);
}
