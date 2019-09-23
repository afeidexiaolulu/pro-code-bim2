package com.zy.bim.dao;

import com.zy.bim.bean.Problem;
import com.zy.bim.bean.ProblemImgFile;
import com.zy.bim.bean.Project;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author 王文强
 * @title: ProblemMapper
 * @emal 17600817572@163.com
 * @date 2019/7/6 000618:26
 */
@Component
public interface ProblemMapper {
    void create(Problem problem);

    void update(Problem problem);

    List<Problem> findAll(Map map);

    Problem findOne(Problem problem);

    /**
     * 删除问题
     * @param ids
     */
    void delete(Integer[] ids);

    List<Problem> findProblem(Integer[] ids);

    Project findOneProject(String projectId);

    String findProblemImg(Integer id);

    /**
     * 根据问题id删除图片
     * @param ids
     */
    void deleteImg(Integer[] ids);

    /**
     * 根据主键删除图纸
     * @param id
     */
    void deleteOneImg(Integer id);

    void createImg(List<ProblemImgFile> problemImgFile);

    String findOneProble(Problem problem);
}
