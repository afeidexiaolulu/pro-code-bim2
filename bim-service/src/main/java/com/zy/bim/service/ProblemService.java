package com.zy.bim.service;

import com.zy.bim.bean.Problem;
import com.zy.bim.bean.ProblemImgFile;
import com.zy.bim.bean.Project;

import java.util.List;
import java.util.Map;

public interface ProblemService {
    Integer create(Problem problem, List<ProblemImgFile> list);

    void update(Problem problem);

    List<Problem> findAll(Map map);

    Problem findOne(Problem problem);

    void delete(Integer[] ids);

    List<Problem> findProblem(Integer[] ids);

    Project findOneProject(String projectId);

    List<ProblemImgFile> findImgOne(Integer id);

    String findProblemImg(Integer id);

    void deleteOneImg(String id);

    void createImg(List<ProblemImgFile> problemImgFile);

    String findImgOneImg(String id);
}
