package com.zy.bim.controller;

import com.zy.bim.bean.ModelShare;
import com.zy.bim.service.ModelShareService;
import com.zy.bim.util.MyPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * @author 陈坤鹏
 * @data 2019-07-29 16:19
 **/

@Controller
@RequestMapping("/bim/modelShare")
public class ModelShareController extends BaseController{

    @Autowired
    private ModelShareService modelShareService;

    //跳转到模型链接分享页面
    @RequestMapping("/modelSharing")
    public String tomodelSharing(){
        return "ModelSharing/ModelSharing";
    }

    //跳转到模型分享时间修改
    @RequestMapping("/validPeriod")
    public String toValidPeriod(){
        return "ModelSharing/validPeriod";
    }

    //跳转到公共的模型分享页面
    @RequestMapping("/modelLightWeightShare")
    public String toModelLightWeightShare(){
        return "ModelSharing/modelLightWeightShare";
    }

    /**
     * 模型分享列表
     * @return
     */
    @RequestMapping("/modelShareList")
    @ResponseBody
    public Object listModelShare(HttpServletRequest request){
        star();
        try {
            MyPage<ModelShare> page = modelShareService.listModelShare(request);
            success(true);
            data(page);
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型分享列表获取失败");
        }
        return end();
    }

    /**
     * 模型分享新增
     * @return
     */
    @RequestMapping("/insertModelShare")
    @ResponseBody
    public Object insertModelShare(HttpServletRequest request){
        star();
        try {
            Map<Object,Object> map = modelShareService.insertModelShare(request);
            success(true);
            data(map);
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型分享列表新增失败");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return end();
    }

    /**
     * 模型分享新增批量
     * @return
     */
    @RequestMapping("/insertModelShareBatch")
    @ResponseBody
    public Object insertModelShareBatch(HttpServletRequest request){
        star();
        try {
            List<Map<Object,Object>> list = modelShareService.insertModelShareBatch(request);
            success(true);
            data(list);
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型分享列表新增失败");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return end();
    }

    /**
     * 模型分享状态更改
     * @return
     */
    @RequestMapping("/modelShareStatuChange")
    @ResponseBody
    public Object modelShareStatuChange(HttpServletRequest request){
        star();
        try {
            String num = modelShareService.modelShareStatuChange(request);
            success(true);
            message(num);
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型分享状态更改失败");
        }
        return end();
    }

    /**
     * 模型分享时间更改
     * @return
     */
    @RequestMapping("/modelEndShareTimeChange")
    @ResponseBody
    public Object modelEndShareTimeChange(HttpServletRequest request){
        star();
        try {
            String num = modelShareService.modelEndShareTimeChange(request);
            success(true);
            message(num);
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型结束时间更改失败");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return end();
    }

    /**
     * 模型分享批量删除
     * @return
     */
    @RequestMapping("/deleteModelShareBatch")
    @ResponseBody
    public Object deleteModelShareBatch(Integer[] ids,HttpServletRequest request){
        star();
        try {
            List list = modelShareService.deleteModelShareBatch(ids,request);
            if(list == null || list.isEmpty()){
                success(true);
                message("模型分享批量删除成功");
            }else{
                String str= String.join(",", list);
                success(false);
                message("文件名称为: " + str + " 的分享链接不为您创建,请重新选择!");
            }
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型分享批量删除失败");
        }
        return end();
    }

    /**
     * 检查模型分享是否重复
     * @return
     */
    @RequestMapping("/checkModelShareRepetition")
    @ResponseBody
    public Object checkModelShareRepetition(Integer[] ids,HttpServletRequest request){
        star();
        try {
            List list = modelShareService.checkModelShareRepetition(ids,request);
            if(list == null || list.isEmpty()){
                success(true);
                message("模型分享检查没有重复");
            }else{
                String str= String.join(",", list);
                success(false);
                message("模型名称为: " + str + " 的模型已分享过,请重新选择分享模型!");
            }
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型分享是否重复检查失败");
        }
        return end();
    }

    //查询轻量化模型地址
    @RequestMapping("/queryLightweightModelPathByModelShareId")
    @ResponseBody
    public Object queryLightweightModelPath(HttpServletRequest request){
        star();
        try {
            String lightweightModelPath = modelShareService.queryLightweightModelPathByModelShareId(request);
            String flag = modelShareService.checkShareStatu(request);
            if("true".equals(flag)){
                data(lightweightModelPath);
                success(true);
                message("查询地址成功");
            }else{
                data("该链接已关闭分享");
                success(false);
                message("查询地址成功");
            }

        } catch (Exception e) {
            data("查询地址失败或者模型已不存在");
            success(false);
            message("查询地址失败");
            e.printStackTrace();
        }
        return end();
    }

    /**
     * 模型分享列表(我的所有分享)
     * @return
     */
    @RequestMapping("/myModelShareList")
    @ResponseBody
    public Object myModelShareList(HttpServletRequest request){
        star();
        try {
            MyPage<ModelShare> page = modelShareService.myModelShareList(request);
            success(true);
            data(page);
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("我的模型分享列表获取失败");
        }
        return end();
    }

}
