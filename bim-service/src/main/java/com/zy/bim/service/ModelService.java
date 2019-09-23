package com.zy.bim.service;

import com.zy.bim.bean.Model;
import com.zy.bim.util.MyPage;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author 陈坤鹏
 * @version 1.00
 * @time 2019/07/04 下午 15:11
 */

public interface ModelService {

    //模型列表分页查询
    MyPage<Model> listModel(HttpServletRequest request);

    //模型新增
    Integer modelInsert(HttpServletRequest request, MultipartFile file);

    //批量删除模型
    List deleteModelBatch(Integer[] ids, HttpServletRequest request);

    //模型图更新
    Integer updateModel(HttpServletRequest request);

    //查询模型名是否唯一
    Integer checkModelNameRepetition(HttpServletRequest request);

    //取消模型新建
    void cancelModelInsert(HttpServletRequest request);

    //查询轻量化模型地址
    String queryLightweightModelPath(HttpServletRequest request);

    //查询模型下是否有未关闭的链接
    List checkModelShareFailureState(Integer[] ids);

    //删除文件夹文件
    boolean deleteFolder(String sPath);

    //修改模型名称
    String updateModelName(HttpServletRequest request);
}
