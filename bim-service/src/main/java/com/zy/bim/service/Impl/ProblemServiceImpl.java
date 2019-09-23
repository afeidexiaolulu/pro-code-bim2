package com.zy.bim.service.Impl;

import com.zy.bim.bean.Problem;
import com.zy.bim.bean.ProblemImgFile;
import com.zy.bim.bean.Project;
import com.zy.bim.dao.ProblemImgFileMapper;
import com.zy.bim.dao.ProblemMapper;
import com.zy.bim.service.ProblemService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author 王文强
 * @title: ProblemServiceImpl
 * @emal 17600817572@163.com
 * @date 2019/7/6 000618:24
 */
@Service
@Transactional
public class ProblemServiceImpl implements ProblemService{
    @Autowired
    ProblemMapper problemMapper;
    @Autowired
    ProblemImgFileMapper problemImgFileMapper;
    @Override
    public synchronized Integer create(Problem problem, List<ProblemImgFile> list) {

        String id=problemMapper.findOneProble(problem);
        if (null!=id&& StringUtils.isNotBlank(id)){
            problem.setId(Integer.valueOf(id));
            if (list!=null&&!list.isEmpty()){
                problemImgFileMapper.createProbleImg(list,problem.getId());
            }
            return Integer.valueOf(id);
        }else{
            problemMapper.create(problem);
            if (list!=null&&!list.isEmpty()){
                problemImgFileMapper.createProbleImg(list,problem.getId());
            }
            return problem.getId();
        }
    }

    @Override
    public void update(Problem problem) {
        problemMapper.update(problem);
    }

    @Override
    public List<Problem> findAll(Map map) {
        return problemMapper.findAll(map);
    }

    @Override
    public Problem findOne(Problem problem) {
        return problemMapper.findOne(problem);
    }

    @Override
    public void delete(Integer[] ids) {
        //删除问题
        problemMapper.delete(ids);
        //删除图片
        problemMapper.deleteImg(ids);
    }

    @Override
    public List<Problem> findProblem(Integer[] ids) {
        return problemMapper.findProblem(ids);
    }

    @Override
    public Project findOneProject(String projectId) {
        return problemMapper.findOneProject(projectId);
    }

    @Override
    public  List<ProblemImgFile> findImgOne(Integer id) {
        return problemImgFileMapper.findImgOne(id);
    }

    @Override
    public String findProblemImg(Integer id) {
        return problemMapper.findProblemImg(id);
    }

    @Override
    public void deleteOneImg(String id) {
        problemMapper.deleteOneImg(Integer.valueOf(id));
    }

    @Override
    public void createImg(List<ProblemImgFile> problemImgFile) {
        problemMapper.createImg(problemImgFile);
    }

    @Override
    public String findImgOneImg(String id) {
       return problemImgFileMapper.findImgOneImg(id);
    }


}
