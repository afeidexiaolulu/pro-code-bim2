package com.zy.bim.service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.bim.bean.ModelShare;
import com.zy.bim.bean.ShareInsert;
import com.zy.bim.bean.User;
import com.zy.bim.dao.FileManagerMapper;
import com.zy.bim.dao.ModelMapper;
import com.zy.bim.dao.ModelShareMapper;
import com.zy.bim.service.ModelShareService;
import com.zy.bim.util.Const;
import com.zy.bim.util.MyPage;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author 陈坤鹏
 * @data 2019-07-30 10:32
 **/
@Service
public class ModelShareServiceImpl extends ServiceImpl<ModelShareMapper, ModelShare> implements ModelShareService {

    @Autowired
    private ModelShareMapper modelShareMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileManagerMapper fileManagerMapper;

    @Override
    public MyPage<ModelShare> listModelShare(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String projectId = (String) request.getSession().getAttribute(Const.PROJECT_ID); //项目id
        String userId = user.getId().toString();    //用户id

        String type = request.getParameter("type");    //查询类型
        String modelName = request.getParameter("modelName");    //查询
        String orderField = request.getParameter("orderField");    //排序字段

        Integer pageSize = Integer.parseInt(request.getParameter("pageSize"));
        Integer pageNo = Integer.parseInt(request.getParameter("pageNo"));

        Page<ModelShare> modelSharePage = new Page<>(pageNo, pageSize);
        QueryWrapper<ModelShare> modelShareQueryWrapper = new QueryWrapper<>();

        modelShareQueryWrapper.eq("parent_id",projectId);
        if(StringUtils.isNotEmpty(modelName)){
            modelShareQueryWrapper.like("model_name",modelName);
        }
        //如果排序字段为model_name的话,按gbk字符集排序,不为model_name的话,按数据库字符集排序
        if("desc".equals(type)){
            if("modelName".equals(orderField)){
                modelShareQueryWrapper.orderByDesc("convert(model_name USING gbk)");
            }else if("shareStatu".equals(orderField)){
                modelShareQueryWrapper.orderByDesc("share_statu");
            }else if("createTime".equals(orderField)){
                modelShareQueryWrapper.orderByDesc("create_time");
            }else if("shareDay".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("share_day");
            }else if("createPersonName".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("convert(create_person_name USING gbk)");
            }else if("endSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("end_sharing_time");
            }else if("startSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("start_sharing_time");
            }
        }else if("asc".equals(type)){
            if("modelName".equals(orderField)){
                modelShareQueryWrapper.orderByAsc("convert(model_name USING gbk)");
            }else if("shareStatu".equals(orderField)){
                modelShareQueryWrapper.orderByAsc("share_statu");
            }else if("createTime".equals(orderField)){
                modelShareQueryWrapper.orderByAsc("create_time");
            }else if("shareDay".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("share_day");
            }else if("createPersonName".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("convert(create_person_name USING gbk)");
            }else if("endSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("end_sharing_time");
            }else if("startSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("start_sharing_time");
            }
        }
        //分页查询
        modelShareMapper.selectPage(modelSharePage,modelShareQueryWrapper);

        MyPage<ModelShare> myPage = new MyPage<>();
        myPage.setDatas(modelSharePage.getRecords());
        myPage.setPageno((int)modelSharePage.getCurrent());
        myPage.setPagesize((int)modelSharePage.getSize());
        myPage.setTotalsize((int)modelSharePage.getTotal());

        return myPage;
    }

    @Override
    public Map<Object,Object> insertModelShare(HttpServletRequest request) throws ParseException {
        ModelShare modelShare = new ModelShare();
        Map<Object,Object> map = new HashMap<>();

        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
        String userName = user.getUserName();   //用户姓名
        Integer parentId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id
        Integer modelId = Integer.parseInt(request.getParameter("modelId"));
        String userId = user.getId().toString();    //用户id
        //获取需要开放的天数
        Integer shareDay = Integer.parseInt(request.getParameter("shareDay"));
        String modelName = request.getParameter("modelName");
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        long shareMilliseconds = shareDay*1000*60*60*24;
        long dateLong = date.getTime();
        long endSharingTimeLong = shareMilliseconds+dateLong;
        Date endSharingTime = new Date();
        //计算后的天数赋值
        endSharingTime.setTime(endSharingTimeLong);


        modelShare.setCreatePerson(userId);
        modelShare.setCreateTime(date);
        modelShare.setParentId(parentId);
        modelShare.setModelName(modelName);
        modelShare.setShareStatu("true");
        modelShare.setStartSharingTime(date);
        modelShare.setEndSharingTime(endSharingTime);
        modelShare.setShareDay(shareDay);
        modelShare.setModelId(modelId);
        modelShare.setCreatePersonName(userName);

        if(shareDay == 36500){
            Date foreverDate = sdf.parse("2999-12-30 23:59:59");
            modelShare.setEndSharingTime(foreverDate);
        }

        //插入
        int insert = modelShareMapper.insert(modelShare);
        System.out.println(modelShare.getId());

        map.put("id",modelShare.getId());
        map.put("shareDay",shareDay);
        map.put("modelName",modelName);

        return map;
    }

    @Override
    public List<Map<Object,Object>> insertModelShareBatch(HttpServletRequest request) throws ParseException {

        //json转换为list
        String modelShareBatch = "[" + request.getParameter("modelShareBatch") + "]";   //获取json数组
        List<ShareInsert> list = new ArrayList<ShareInsert>();
        list = JSONObject.parseArray(modelShareBatch, ShareInsert.class);
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
        String userName = user.getUserName();   //用户姓名
        Integer parentId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id
        String userId = user.getId().toString();

        List<Map<Object,Object>> list2 = new ArrayList<Map<Object,Object>>();

        for (ShareInsert shareInsert : list) {
            Map<Object,Object> map = new HashMap<>();
            ModelShare modelShare = new ModelShare();

            Integer modelId = shareInsert.getModelId();
            //获取需要开放的天数
            Integer shareDay = shareInsert.getShareDay();
            String modelName = shareInsert.getModelName();
            Date date = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long shareMilliseconds = shareDay*1000*60*60*24;
            long dateLong = date.getTime();
            long endSharingTimeLong = shareMilliseconds+dateLong;
            Date endSharingTime = new Date();
            //计算后的天数赋值
            endSharingTime.setTime(endSharingTimeLong);


            modelShare.setCreatePerson(userId);
            modelShare.setCreateTime(date);
            modelShare.setParentId(parentId);
            modelShare.setModelName(modelName);
            modelShare.setShareStatu("true");
            modelShare.setStartSharingTime(date);
            modelShare.setEndSharingTime(endSharingTime);
            modelShare.setShareDay(shareDay);
            modelShare.setModelId(modelId);
            modelShare.setCreatePersonName(userName);

            if(shareDay == 36500){
                Date foreverDate = sdf.parse("2999-12-30 23:59:59");
                modelShare.setEndSharingTime(foreverDate);
            }

            //插入
            int insert = modelShareMapper.insert(modelShare);
            System.out.println(modelShare.getId());
            map.put("id",modelShare.getId());
            map.put("shareDay",shareDay);
            map.put("modelName",modelName);
            list2.add(map);
        }
        return list2;
    }

    @Override
    public String queryLightweightModelPathByModelShareId(HttpServletRequest request) {
        //json转换为list
        String modelShareId = request.getParameter("modelShareId");   //获取模型分享id
        Integer modelId = Integer.parseInt(modelShareMapper.queryModelIdNameById(modelShareId));
        String modelImg = modelMapper.queryModelImg(modelId);
        String filePath = fileManagerMapper.getFilePathById(modelImg);
        int begin = filePath.lastIndexOf("\\")+1;
        int end = filePath.lastIndexOf(".");
        String filePath2 = filePath.substring(begin,end)+"ToTransformation";
        return filePath2;
    }

    @Override
    public String checkShareStatu(HttpServletRequest request) {
        String modelShareId = request.getParameter("modelShareId");   //获取模型分享id
        String flag = modelShareMapper.checkShareStatu(modelShareId);
        return flag;
    }

    @Override
    public MyPage<ModelShare> myModelShareList(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String projectId = (String) request.getSession().getAttribute(Const.PROJECT_ID); //项目id
        String userId = user.getId().toString();    //用户id

        String type = request.getParameter("type");    //查询类型
        String modelName = request.getParameter("modelName");    //查询
        String orderField = request.getParameter("orderField");    //排序字段

        Integer pageSize = Integer.parseInt(request.getParameter("pageSize"));
        Integer pageNo = Integer.parseInt(request.getParameter("pageNo"));

        Page<ModelShare> modelSharePage = new Page<>(pageNo, pageSize);
        QueryWrapper<ModelShare> modelShareQueryWrapper = new QueryWrapper<>();

        //限制链接创建人为当前登录用户
        modelShareQueryWrapper.eq("create_person",userId);

        if(StringUtils.isNotEmpty(modelName)){
            modelShareQueryWrapper.like("model_name",modelName);
        }
        //如果排序字段为model_name的话,按gbk字符集排序,不为model_name的话,按数据库字符集排序
        if("desc".equals(type)){
            if("modelName".equals(orderField)){
                modelShareQueryWrapper.orderByDesc("convert(model_name USING gbk)");
            }else if("shareStatu".equals(orderField)){
                modelShareQueryWrapper.orderByDesc("share_statu");
            }else if("createTime".equals(orderField)){
                modelShareQueryWrapper.orderByDesc("create_time");
            }else if("shareDay".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("share_day");
            }else if("createPersonName".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("convert(create_person_name USING gbk)");
            }else if("endSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("end_sharing_time");
            }else if("startSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByDesc("start_sharing_time");
            }
        }else if("asc".equals(type)){
            if("modelName".equals(orderField)){
                modelShareQueryWrapper.orderByAsc("convert(model_name USING gbk)");
            }else if("shareStatu".equals(orderField)){
                modelShareQueryWrapper.orderByAsc("share_statu");
            }else if("createTime".equals(orderField)){
                modelShareQueryWrapper.orderByAsc("create_time");
            }else if("shareDay".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("share_day");
            }else if("createPersonName".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("convert(create_person_name USING gbk)");
            }else if("endSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("end_sharing_time");
            }else if("startSharingTime".equals(orderField)) {
                modelShareQueryWrapper.orderByAsc("start_sharing_time");
            }
        }
        //分页查询
        modelShareMapper.selectPage(modelSharePage,modelShareQueryWrapper);

        MyPage<ModelShare> myPage = new MyPage<>();
        myPage.setDatas(modelSharePage.getRecords());
        myPage.setPageno((int)modelSharePage.getCurrent());
        myPage.setPagesize((int)modelSharePage.getSize());
        myPage.setTotalsize((int)modelSharePage.getTotal());

        List<ModelShare> datas = myPage.getDatas();
        for (ModelShare data : datas) {
            Integer parentId = data.getParentId();
            //根据parentId查询项目名称
            String projectName = modelShareMapper.queryProjectNameById(parentId);
            data.setProjectName(projectName);
        }

        return myPage;
    }


    @Override
    public String modelShareStatuChange(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
        String userId = user.getId().toString();
        Integer modelShareId = Integer.parseInt(request.getParameter("modelShareId"));

        //查询创建人
        String createPerson = modelShareMapper.queryCreatePersonById(modelShareId);
        if(!userId.equals(createPerson)){
            return "您不为此链接创建人,无法修改";
        }else{
            //查询分享状态和分享到期时间
            Map modelShareStatuAndEndSharingTime = modelShareMapper.queryModelShareStatuAndEndSharingTime(modelShareId);
            String shareStatu = (String)modelShareStatuAndEndSharingTime.get("share_statu");
            Date endSharingTime = (Date)modelShareStatuAndEndSharingTime.get("end_sharing_time");
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("modelShareId",modelShareId);
            //为开放的话就直接能关
            if("true".equals(shareStatu)){
                params.put("shareStatu","false");
                Integer updNum = modelShareMapper.modelShareStatuChange(params);
                return "链接更新成功";
            }else{
                //验证链接时间到期与否
                long endSharingTimeLong = endSharingTime.getTime();
                long nowTimeLong = new Date().getTime();
                if(endSharingTimeLong > nowTimeLong){
                    params.put("shareStatu","true");
                    Integer updNum = modelShareMapper.modelShareStatuChange(params);
                    return "链接更新成功";
                }else{
                    return "链接已到期,无法开启";
                }
            }
        }
    }

    @Override
    public String modelEndShareTimeChange(HttpServletRequest request) throws ParseException {

        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
        String userId = user.getId().toString();

        Integer modelShareId = Integer.parseInt(request.getParameter("modelShareId"));
        Integer shareDay = Integer.parseInt(request.getParameter("shareDay"));

        String createPerson = modelShareMapper.queryCreatePersonById(modelShareId);
        if(!userId.equals(createPerson)){
            return "您不为此链接创建人,无法修改";
        }else{
            Date date = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            long shareMilliseconds = shareDay*1000*60*60*24;
            long dateLong = date.getTime();
            long endSharingTimeLong = shareMilliseconds+dateLong;
            Date endSharingTime = new Date();
            endSharingTime.setTime(endSharingTimeLong);

            Map<String, Object> params = new HashMap<String, Object>();
            params.put("modelShareId",modelShareId);
            params.put("startSharingTime",date);
            params.put("endSharingTime",endSharingTime);
            params.put("shareDay",shareDay);
            params.put("shareStatu","true");
            params.put("updatePerson",userId);
            params.put("updateTime",date);

            if(shareDay == 36500){
                Date foreverDate = sdf.parse("2999-12-30 23:59:59");
                params.put("endSharingTime",foreverDate);
            }

            Integer updNum = modelShareMapper.modelEndShareTimeChange(params);

            return "更新成功"+updNum+"条";
        }
    }

    @Override
    public Integer closeShareStatu() {
        return modelShareMapper.closeShareStatu();
    }

    @Override
    public List deleteModelShareBatch(Integer[] ids,HttpServletRequest request) {

        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
        String userId = user.getId().toString();
        List<Integer> list = new ArrayList<>();
        List<String> list2 = new ArrayList<>();
        for (Integer id : ids) {
            String createPerson = modelShareMapper.queryCreatePersonById(id);
            if(userId.equals(createPerson)){
                list.add(id);
            }else {
                String modelShareName = modelShareMapper.queryModelShareNameById(id);
                list2.add(modelShareName);
            }
        }
        if(list2 == null || list2.isEmpty()){
            Integer num = modelShareMapper.deleteBatchIds(list);
            return list2;
        }else{
            return list2;
        }

    }

    @Override
    public List checkModelShareRepetition(Integer[] ids,HttpServletRequest request) {
        Integer parentId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id
        List<Integer> list = new ArrayList<>();
        List<String> list2 = new ArrayList<>();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("parentId",parentId);
        for (Integer id : ids) {
            params.put("modelId",id);
            Integer num = modelShareMapper.checkModelShareRepetition(params);
            if(num <= 0){
                list.add(id);
            }else {
                String modelName = modelMapper.queryModelNameById(id);
                list2.add(modelName);
            }
        }
        return list2;
    }
}
