package com.zy.bim.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.bim.bean.Model;
import com.zy.bim.bean.User;
import com.zy.bim.dao.FileManagerMapper;
import com.zy.bim.dao.ModelMapper;
import com.zy.bim.dao.ModelShareMapper;
import com.zy.bim.service.ModelService;
import com.zy.bim.service.TransformationService;
import com.zy.bim.util.Const;
import com.zy.bim.util.MyPage;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.*;

@Service
public class ModelServiceImpl extends ServiceImpl<ModelMapper, Model> implements ModelService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileManagerMapper fileManagerMapper;

    @Autowired
    private ModelShareMapper modelShareMapper;

    @Autowired
    private TransformationService transformationService;

    @Value("${filePath.transformationFilePath}")
    public String transformationFilePath;

    @Override
    public MyPage<Model> listModel(HttpServletRequest request) {

        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String projectId = (String) request.getSession().getAttribute(Const.PROJECT_ID); //项目id
        String userId = user.getId().toString();    //用户id

        String type = request.getParameter("type");    //查询类型
        String modelName = request.getParameter("modelName");    //查询
        String orderField = request.getParameter("orderField");    //排序字段

        Integer pageSize = Integer.parseInt(request.getParameter("pageSize"));
        Integer pageNo = Integer.parseInt(request.getParameter("pageNo"));


        Page<Model> modelPage = new Page<>(pageNo, pageSize);
        QueryWrapper<Model> modelQueryWrapper = new QueryWrapper<>();
        //拼接查询条件
        modelQueryWrapper.eq("parent_id",projectId).and(wrapper -> wrapper.eq("is_open", "是").or().eq("create_person", userId));

        if(StringUtils.isNotEmpty(modelName)){
            modelQueryWrapper.like("model_name",modelName);
        }

        if("desc".equals(type)){
            //如果排序字段为model_name的话,按gbk字符集排序,不为model_name的话,按数据库字符集排序
            if("modelName".equals(orderField)){
                modelQueryWrapper.orderByDesc("convert(model_name USING gbk)");
            }else if("modelSize".equals(orderField)){
                modelQueryWrapper.orderByDesc("model_size");
            }else if("createTime".equals(orderField)){
                modelQueryWrapper.orderByDesc("create_time");
            }else if("isOpen".equals(orderField)) {
                modelQueryWrapper.orderByDesc("is_open");
            }else if("createPersonName".equals(orderField)) {
                modelQueryWrapper.orderByDesc("convert(create_person_name USING gbk)");
            }
        }else if("asc".equals(type)){
            if("modelName".equals(orderField)){
                modelQueryWrapper.orderByAsc("convert(model_name USING gbk)");
            }else if("modelSize".equals(orderField)){
                modelQueryWrapper.orderByAsc("model_size");
            }else if("createTime".equals(orderField)){
                modelQueryWrapper.orderByAsc("create_time");
            }else if("isOpen".equals(orderField)) {
                modelQueryWrapper.orderByAsc("is_open");
            }else if("createPersonName".equals(orderField)) {
                modelQueryWrapper.orderByAsc("convert(create_person_name USING gbk)");
            }
        }
        //分页查询
        modelMapper.selectPage(modelPage,modelQueryWrapper);

        MyPage<Model> myPage = new MyPage<>();
        myPage.setDatas(modelPage.getRecords());
        myPage.setPageno((int)modelPage.getCurrent());
        myPage.setPagesize((int)modelPage.getSize());
        myPage.setTotalsize((int)modelPage.getTotal());

        return myPage;
    }

    @Override
    public Integer modelInsert(HttpServletRequest request, MultipartFile file) {

        Model model = new Model();
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
        String userId = user.getId().toString(); //获取当前登录的session用户
        String userName = user.getUserName();   //获取当前登录的session用户
        Integer parentId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id

        String modelName = request.getParameter("modelName");   //获取模型名
        String toolType = request.getParameter("toolType"); //获取模型工具
        String isOpen = request.getParameter("isOpen"); //获取是否公开
        String remark = request.getParameter("remark"); //获取备注
        String modelSize = request.getParameter("modelSize"); //获取模型大小
        String modelImg = request.getParameter("modelImg"); //获取模型图储存地址主键
        model.setParentId(parentId);    //注入项目id
        model.setModelName(modelName);  //注入模型名
        model.setModelSize(modelSize);  //注入模型大小
        model.setToolType(toolType);    //注入模型工具
        model.setIsOpen(isOpen);    //注入是否公开
        model.setRemark(remark);    //注入备注
        model.setCreateTime(new Date());    //创建时间
        model.setCreatePerson(userId); //创建人
        model.setCurrentVersion("v1.01");
        model.setModelImg(modelImg);
        model.setCreatePersonName(userName);
        Integer num = modelMapper.insert(model);

        //根据附件id查找文件地址
        String inputFile = fileManagerMapper.getFilePathById(modelImg);
        //消息队列发送请求
        String s = transformationService.beginTransformation(model.getId().toString(), inputFile, "6");

        return num;
    }

    @Override
    public List deleteModelBatch(Integer[] ids,HttpServletRequest request) {

        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户

        String userId = user.getId().toString(); //获取当前登录的session用户
        Integer projectId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id

        List<String> list2 = new ArrayList<>();

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId",userId);
        params.put("projectId",projectId);
        //查询是否为项目管理员
        Integer num = modelMapper.checkProjectManager(params);

        if(num > 0 ){
            List<Integer> list = new ArrayList<>();
            for (Integer id : ids) {
                list.add(id);
            }
            deltefile(list);
            Integer delNum = modelMapper.deleteBatchIds(list);
            Integer delNum2 = modelShareMapper.deleteBatchByModelId(list);
            return list2;
        }else{
            List<Integer> list = new ArrayList<>();
            for (Integer id : ids) {
                //检查该模型创建人是否为当前用户
                String createPerson = modelMapper.checkModelCreatePerson(id);
                if(userId.equals(createPerson)){
                    list.add(id);
                }else{
                    String modelName = modelMapper.queryModelNameById(id);
                    list2.add(modelName);
                }
            }
            if(list2 == null || list2.isEmpty()){
                deltefile(list);
                Integer delNum = modelMapper.deleteBatchIds(list);
                Integer delNum2 = modelShareMapper.deleteBatchByModelId(list);
                return list2;
            }else{
                return list2;
            }
        }
    }

    @Override
    public Integer updateModel(HttpServletRequest request) {
        String newModelImgId = request.getParameter("newModelImgId");
        String modelId = request.getParameter("modelId");
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("modelId",modelId);
        params.put("newModelImgId",newModelImgId);
        int updNum = modelMapper.updateImgByFileId(params);
        return updNum;
    }

    @Override
    public Integer checkModelNameRepetition(HttpServletRequest request) {
        String modelName = request.getParameter("modelName");   //获取模型名
        Integer parentId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("modelName",modelName);
        params.put("parentId",parentId);
        if(StringUtils.isNotEmpty(modelName) && modelName != ""){
            Integer num = modelMapper.checkModelNameRepetition(params);
            return num;
        }else {
            return 0;
        }

    }

    @Override
    public void cancelModelInsert(HttpServletRequest request) {
        String modelImg = request.getParameter("modelImg");   //获取模型储存地址主键
        String filePath = fileManagerMapper.getFilePathById(modelImg);
        File file = new File(filePath);
        //验证文件是否存在,并且不为文件夹
        try{
            if(file.exists() && file.isFile()) {
                //删除文件
                if(file.delete()){
                    System.out.println(file.getName() + " 文件已被删除！");
                    Integer delNum = fileManagerMapper.deleteFileAttachmentById(modelImg);
                }else{
                    System.out.println("文件删除失败！");
                }
            }else {
                System.out.println("文件不存在!");
            }
        }catch(Exception e){
            e.printStackTrace();
        }

    }

    @Override
    public String queryLightweightModelPath(HttpServletRequest request) {
        Integer modelId = Integer.parseInt(request.getParameter("modelId"));
        String modelImg = modelMapper.queryModelImg(modelId);
        String filePath = fileManagerMapper.getFilePathById(modelImg);
        int begin = filePath.lastIndexOf("\\")+1;
        int end = filePath.lastIndexOf(".");
        String filePath2 = filePath.substring(begin,end)+"ToTransformation";
        return filePath2;
    }

    @Override
    public List checkModelShareFailureState(Integer[] ids) {
        List<String> list = new ArrayList<>();
        for (Integer id : ids) {
            //检查该模型下有没有正在分享的链接
            Integer num = modelMapper.checkModelShareFailureState(id);
            if(num > 0){
                String modelName = modelMapper.queryModelNameById(id);
                list.add(modelName);
            }
        }
        return list;
    }

    //根据模型id查询模型位置,并删除
    public void deltefile(List<Integer> list) {
        for (Integer modelId : list) {
            //查询模型地址
            String modelImg = modelMapper.queryModelImg(modelId);
            String filePath = fileManagerMapper.getFilePathById(modelImg);
            File file = new File(filePath);
            //验证文件是否存在,并且不为文件夹
            try{
                if(file.exists() && file.isFile()) {
                    //删除文件
                    if(file.delete()){
                        System.out.println(file.getName() + " 文件已被删除！");
                        //删除文件表里的数据
                        Integer delNum = fileManagerMapper.deleteFileAttachmentById(modelImg);
                    }else{
                        System.out.println("文件删除失败！");
                    }
                }else {
                    System.out.println("文件不存在!");
                }
            }catch(Exception e){
                e.printStackTrace();
            }
            int begin = filePath.lastIndexOf("\\")+1;
            int end = filePath.lastIndexOf(".");
            String filePath2 = transformationFilePath+"/"+filePath.substring(begin,end)+"ToTransformation";
            //删除文件夹
            deleteFolder(filePath2);
        }
    }

    /**
     *  根据路径删除指定的目录，无论存在与否
     *@param sPath  要删除的目录path
     *@return 删除成功返回 true，否则返回 false。
     */
    @Override
    public boolean deleteFolder(String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 判断目录或文件是否存在
        if (!file.exists()) {  // 不存在返回 false
            return flag;
        } else {
            // 判断是否为文件
            if (file.isFile()) {  // 为文件时调用删除文件方法
                return deleteFile(sPath);
            } else {  // 为目录时调用删除目录方法
                return deleteDirectory(sPath);
            }
        }
    }

    @Override
    public String updateModelName(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户

        String userId = user.getId().toString(); //获取当前登录的session用户
        Integer projectId = Integer.parseInt((String) request.getSession().getAttribute(Const.PROJECT_ID)); //获取当前选中的项目id

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userId",userId);
        params.put("projectId",projectId);
        //查询是否为项目管理员
        Integer num = modelMapper.checkProjectManager(params);
        String modelId = request.getParameter("modelId");   //模型id
        String newModelName = request.getParameter("newModelName"); //新模型名称
        Map<String, Object> params2 = new HashMap<String, Object>();
        params2.put("modelId",modelId);
        params2.put("newModelName",newModelName);

        if(num > 0 ){
            Integer upNum = modelMapper.updateModelName(params2);
            return "success";
        }else{
            //检查该模型创建人是否为当前用户
            String createPerson = modelMapper.checkModelCreatePerson(Integer.parseInt(modelId));
            if(userId.equals(createPerson)){
                Integer upNum = modelMapper.updateModelName(params2);
                return "success";
            }else {
                return "notCreatePerson";
            }
        }
    }

    /**
     * 删除单个文件
     * @param   sPath 被删除文件path
     * @return 删除成功返回true，否则返回false
     */
    public boolean deleteFile(String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }
    /**
     * 删除目录以及目录下的文件
     * @param   sPath 被删除目录的路径
     * @return  目录删除成功返回true，否则返回false
     */
    public boolean deleteDirectory(String sPath) {
        //如果sPath不以文件分隔符结尾，自动添加文件分隔符
        if (!sPath.endsWith(File.separator)) {
            sPath = sPath + File.separator;
        }
        File dirFile = new File(sPath);
        //如果dir对应的文件不存在，或者不是一个目录，则退出
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        boolean flag = true;
        //删除文件夹下的所有文件(包括子目录)
        File[] files = dirFile.listFiles();
        for (int i = 0; i < files.length; i++) {
            //删除子文件
            if (files[i].isFile()) {
                flag = deleteFile(files[i].getAbsolutePath());
                if (!flag) break;
            } //删除子目录
            else {
                flag = deleteDirectory(files[i].getAbsolutePath());
                if (!flag) break;
            }
        }
        if (!flag) return false;
        //删除当前目录
        if (dirFile.delete()) {
            return true;
        } else {
            return false;
        }
    }

}
