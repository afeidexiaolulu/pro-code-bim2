package com.zy.bim.controller;

import com.zy.bim.bean.Model;
import com.zy.bim.service.ModelService;
import com.zy.bim.util.MyPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

/**
 * @author 陈坤鹏
 * @version 1.00
 * @time 2019/07/04 下午 15:11
 */

@Controller
@RequestMapping("/bim/model")
public class ModelController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(RegisterController.class);

    @Autowired
    private ModelService modelService;

    //跳转到图纸界面
    @RequestMapping("/drawingList")
    public String toDrawingList(HttpServletRequest request){
        return "DrawingList/DrawingList";
    }

    //跳转到模型详情界面
    @RequestMapping("/ModelDetails")
    public String toModelDetails(HttpServletRequest request){
        return "ModelList/ModelDetails";
    }

    //跳转到模型页面
    @RequestMapping("/modelListPage")
    public String toModelListPage(){
        return "ModelList/ModelList";
    }

    //跳转到模型新增
    @RequestMapping("/newBuild")
    public String toNewBuild(){
        return "ModelList/newBuild";
    }

    //跳转到模型分享(批量)
    @RequestMapping("/shareTwo")
    public String toShareTwo(){
        return "ModelList/Share_two";
    }

    //跳转到模型分享(单个)
    @RequestMapping("/shareOne")
    public String toShareOne(){
        return "ModelList/Share_one";
    }

    //跳转到模型链接分享(单个)
    @RequestMapping("/linkOne")
    public String toLinkOne(){
        return "ModelList/link_one";
    }

    //跳转到模型链接分享(单个)
    @RequestMapping("/linkTwo")
    public String tolinkTwo(){
        return "ModelList/link_two";
    }

    /**
     * 模型列表
     * @return
     */
    @RequestMapping("/modelList")
    @ResponseBody
    public Object listModel(HttpServletRequest request){
        star();
        try {
            MyPage<Model> page = modelService.listModel(request);
            success(true);
            data(page);
            message("模型列表查询成功");
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型列表查询失败");
        }
        return end();
    }

    /**
     * 新建模型
     * @return
     */
    @RequestMapping("/modelInsert")
    @ResponseBody
    public Object modelInsert(HttpServletRequest request,@RequestParam(value= "file",required=false) MultipartFile file){
        star();
        try {
            Integer num = modelService.modelInsert(request,file);
            success(true);
            data(num);
            message("模型新建成功");
        }catch (RuntimeException e){
            e.printStackTrace();
            success(false);
            message("模型新建失败");
        }
        return end();
    }

    /**
     * 批量删除模型
     * @return
     */
    @RequestMapping("/deleteModelBatch")
    @ResponseBody
    public Object deleteModelBatch(Integer[] ids,HttpServletRequest request){
        star();
        try {
            List list2 = modelService.checkModelShareFailureState(ids);
            if(list2 == null || list2.isEmpty()){
                List list = modelService.deleteModelBatch(ids, request);
                if(list == null || list.isEmpty()){
                    success(true);
                    message("批量删除成功");
                }else{
                    String str= String.join(",", list);
                    success(false);
                    message("批量删除失败,模型名称为: "+str+" 的模型不为您创建的模型,请重新选择!");
                }
            }else {
                String str= String.join(",", list2);
                success(false);
                message("批量删除失败,模型名称为: "+str+" 的模型下还有正在分享的模型链接,请重新选择!");
            }

        } catch (Exception e) {
            message("批量删除失败");
            success(false);
            e.printStackTrace();
        }
        return end();
    }

    /**
     * 修改模型信息
     * @return
     */
    @RequestMapping("/updateModel")
    @ResponseBody
    public Object updateModel(HttpServletRequest request){
        star();
        try {
            Integer updNum = modelService.updateModel(request);
            if(updNum != 1){
                throw new RuntimeException();
            }
            success(true);
        } catch (Exception e) {
            message("更新失败");
            success(false);
            e.printStackTrace();
        }
        return end();
    }

    //查询模型名是否唯一
    @RequestMapping("/checkModelNameRepetition")
    @ResponseBody
    public Object checkModelNameRepetition(HttpServletRequest request){
        star();
        try {
            Integer num =  modelService.checkModelNameRepetition(request);
            if(num > 0){
                success(false);
                message("项目名唯一性检查成功,有重复的模型名");
            }else {
                success(true);
                message("项目名唯一性检查成功,无重复的模型名");
            }
        } catch (Exception e) {
            success(false);
            message("项目名唯一性检查失败");
            e.printStackTrace();
            logger.error("查询模型名唯一性出现异常");
        }
        return end();
    }

    //模型新建取消
    @RequestMapping("/cancelModelInsert")
    @ResponseBody
    public Object cancelModelInsert(HttpServletRequest request){
        star();
        try {
            modelService.cancelModelInsert(request);
            success(true);
            message("取消模型新建成功");
        } catch (Exception e) {
            success(false);
            message("取消模型新建失败");
            e.printStackTrace();
            logger.error("取消模型新建出现异常");
        }
        return end();
    }

    //查询轻量化模型地址
    @RequestMapping("/queryLightweightModelPath")
    @ResponseBody
    public Object queryLightweightModelPath(HttpServletRequest request){
        star();
        try {
            String lightweightModelPath = modelService.queryLightweightModelPath(request);
            data(lightweightModelPath);
            success(true);
            message("查询地址成功");
        } catch (Exception e) {
            success(false);
            message("查询地址失败");
            e.printStackTrace();
            logger.error("查询地址出现异常");
        }
        return end();
    }

    //开始模型转化
    @RequestMapping("/beginTransformation")
    @ResponseBody
    public Object beginTransformation(HttpServletRequest request) throws IOException, InterruptedException {
        star();
        Runtime rt = Runtime.getRuntime();//java的API，获得一个对象
        //Process exec = rt.exec("C:\\Users\\61093\\Desktop\\Release v7\\TestAPI.exe \"C:\\Users\\61093\\Desktop\\test\\1\\716-603-T3D-A.rvt\" \"C:\\Users\\61093\\Desktop\\test\\2\\716-603-T3D-A.esd\"");
        Process exec = rt.exec("C:\\Program Files (x86)\\Netease\\MailMaster\\Application\\mailmaster.exe");
        exec.waitFor();
        System.out.println(".............................");
        return end();
    }

    /**
     * 修改模型名称
     * @return
     */
    @RequestMapping("/updateModelName")
    @ResponseBody
    public Object updateModelName(HttpServletRequest request){
        star();
        try {
            String str = modelService.updateModelName(request);
            if("success".equals(str)){
                message("更新模型名成功");
                success(true);
            }else if ("notCreatePerson".equals(str)){
                message("您不为管理员,无法修改他人创建的模型!");
                success(false);
            }
        } catch (Exception e) {
            message("更新模型名失败");
            success(false);
            e.printStackTrace();
        }
        return end();
    }
}
