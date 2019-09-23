package com.zy.bim.controller;

import com.zy.bim.util.SignUtil;
import com.zy.bim.util.WeChatMediaDloadImgUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @author 陈坤鹏
 * @version 1.00
 * @time 2019/09/11 下午 15:11
 * 移动端跳转controller
 */

@Controller
@RequestMapping("/bim/webApp")
public class WebAppController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(RegisterController.class);

    //跳转到移动端项目列表
    @RequestMapping("/index")
    public String toWebAppIndex(){
        return "WebApp/examples/projectHome/index";
    }
    //跳转到项目详情
    @RequestMapping("/projectDetails")
    public String toProjectDetails(){
        return "WebApp/examples/projectHome/details";
    }
    //跳转到添加项目
    @RequestMapping("/addProject")
    public String toAddProject(){
        return "WebApp/examples/projectHome/addProject";
    }
    //跳转到添加问题
    @RequestMapping("/addQuestion")
    public String toAddQuestion(){
        return "WebApp/examples/projectHome/addQuestion";
    }
    //跳转到权限管理
    @RequestMapping("/power")
    public String toPower(){
        return "WebApp/examples/projectAuthority/power";
    }
    //跳转到个人主页
    @RequestMapping("/individual")
    public String toIndividual(){
        return "WebApp/examples/projectIndividual/individual";
    }
    //跳转到增值服务页面
    @RequestMapping("/services")
    public String toServices(){
        return "WebApp/examples/projectServices/services";
    }
    //跳转到bim模型详情
    @RequestMapping("/modelDetails")
    public String toModelDetails(){
        return "WebApp/examples/projectHome/ModelDetails";
    }
    /**
     * 微信配置接口
     */
    @RequestMapping("/jssdk")
    @ResponseBody
    public Map<String,String> JSSDK_config(@RequestParam(value = "url", required = true) String url) {
        try {
            Map<String, String> configMap = SignUtil.sign(url);
            return configMap;
        } catch (Exception e) {
            return null;
        }
    }
    //录音转码
    @RequestMapping("/recordingTranscoding")
    @ResponseBody
    public Object recordingTranscoding(HttpServletRequest request){
        star();
        try {
            String mediaId = request.getParameter("mediaId");
            String mediaPath = WeChatMediaDloadImgUtil.getInputStream(mediaId);
            data(mediaPath);
            success(true);
            message("转码成功");
        }catch (Exception e){
            success(false);
            message("转码失败");
            e.printStackTrace();
            logger.error("转码出现异常");
        }
        return end();
    }
}
