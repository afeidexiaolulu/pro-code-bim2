package com.zy.bim.dao;

import com.zy.bim.bean.ProblemImgFile;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface ProblemImgFileMapper {

    void createProbleImg(@Param("list") List<ProblemImgFile> list, @Param("id") Integer id);

    List<ProblemImgFile> findImgOne(Integer id);

    String findImgOneImg(String id);
}
