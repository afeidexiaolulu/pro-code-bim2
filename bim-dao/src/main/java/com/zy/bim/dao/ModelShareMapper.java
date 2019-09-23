package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.ModelShare;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author 陈坤鹏
 * @data 2019-07-30 10:34
 **/
@Component
public interface ModelShareMapper extends BaseMapper<ModelShare> {
    //查询模型分享表的模型的分享状态及分享结束时间
    Map queryModelShareStatuAndEndSharingTime(Integer modelShareId);
    //更新模型状态
    Integer modelShareStatuChange(Map<String, Object> params);
    //更新模型分享时间
    Integer modelEndShareTimeChange(Map<String, Object> params);
    //根据当前时间改变到期链接分享状态
    Integer closeShareStatu();
    //检查模型分享是否重复
    Integer checkModelShareRepetition(Map<String, Object> params);
    //根据id查询创建人
    String queryCreatePersonById(Integer modelShareId);
    //根据id查询模型分享名称
    String queryModelShareNameById(Integer id);
    //根据id查询模型id
    String queryModelIdNameById(String modelShareId);
    //检查分享状态
    String checkShareStatu(String modelShareId);
    //根据模型id删除模型分享表数据
    Integer deleteBatchByModelId(List<Integer> list);
    //根据项目id查询项目名称
    String queryProjectNameById(Integer parentId);
}
