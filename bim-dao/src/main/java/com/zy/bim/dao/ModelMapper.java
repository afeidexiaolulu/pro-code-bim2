package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.Model;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author 陈坤鹏
 * @version 1.00
 * @time 2019/07/04 下午 15:11
 */

@Component
public interface ModelMapper extends BaseMapper<Model> {

    Integer updateImgByFileId(Map<String, Object> params);

    Integer checkModelNameRepetition(Map<String, Object> params);

    Integer checkProjectManager(Map<String, Object> params);

    String checkModelCreatePerson(Integer id);

    String queryModelImg(Integer modelId);

    String queryModelNameById(Integer id);

    Integer checkModelShareFailureState(Integer id);

    Integer updateModelName(Map<String, Object> params2);
}
