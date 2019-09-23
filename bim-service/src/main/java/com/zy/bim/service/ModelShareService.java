package com.zy.bim.service;

import com.zy.bim.bean.ModelShare;
import com.zy.bim.util.MyPage;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * @author 陈坤鹏
 * @data 2019-07-30 10:31
 **/
public interface ModelShareService {
    //模型分享列表分页查询
    MyPage<ModelShare> listModelShare(HttpServletRequest request);

    //模型分享插入
    Map<Object,Object> insertModelShare(HttpServletRequest request) throws ParseException;

    //模型分享状态改变
    String modelShareStatuChange(HttpServletRequest request);

    //模型分享时间改变
    String modelEndShareTimeChange(HttpServletRequest request) throws ParseException;

    //关闭超时的模型分享链接
    Integer closeShareStatu();

    //模型分享删除
    List deleteModelShareBatch(Integer[] ids,HttpServletRequest request);

    //检查模型分享是否重复
    List checkModelShareRepetition(Integer[] ids, HttpServletRequest request);

    //模型分享批量插入
    List<Map<Object, Object>> insertModelShareBatch(HttpServletRequest request) throws ParseException;

    //根据模型分享id查询模型地址id查询模型地址
    String queryLightweightModelPathByModelShareId(HttpServletRequest request);

    //检查分享状态
    String checkShareStatu(HttpServletRequest request);

    //我的模型分享列表分页查询
    MyPage<ModelShare> myModelShareList(HttpServletRequest request);
}
