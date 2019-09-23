package com.zy.bim.controller;

import com.zy.bim.bean.MessageVo;
import com.zy.bim.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @program: pro-code-bim
 * @description: 问题模块
 * @author: LinChong
 * @create: 2019-09-03 14:43
 **/
@Controller
@RequestMapping("/bim/api/message")
public class MessageController extends BaseController{
    private Logger logger= LoggerFactory.getLogger(MessageController.class);
    @Autowired
    private MessageService messageService;

    /**
     * 新增发送问题
     * @param request
     * @return
     */
    @RequestMapping("insert")
    @ResponseBody
    public Object insert(HttpServletRequest request){
        star();
        messageService.insert(request);
        success(true);
        return end();
    }

    /**
     * 查询用户接收的问题列表
     * @param request
     * @return
     */
    @RequestMapping("selectMessagePage")
    @ResponseBody
    public Object selectMessagePage(HttpServletRequest request){
        star();
        String currentPage = request.getParameter("currentPage");
        String pageSize = request.getParameter("pageSize");
        if(StringUtils.isEmpty(currentPage) || StringUtils.isEmpty(pageSize)){
            message("参数错误");
            return end();
        }
        List<MessageVo> list =messageService.selectMessagePage(request);
        data(list);
        success(true);
        return end();
    }

    /**
     * 回复问题
     * @param request
     * @return
     */
    @RequestMapping("addMessageInfo")
    @ResponseBody
    public Object addMessageInfo(HttpServletRequest request){
        star();
        messageService.updateMessageInfo(request);
        success(true);
        return end();
    }

    /**
     *  查询问题数量
     * @param request
     * @return
     */
    @RequestMapping("getReadNum")
    @ResponseBody
    public Object getReadNum(HttpServletRequest request){
        star();
        data(messageService.getReadNum(request));
        success(true);
        return end();
    }

    /**
     * 查询问题回复列表
     * @param request
     * @return
     */
    @RequestMapping("selectMessageInfoList")
    @ResponseBody
    public Object selectMessageInfoList(HttpServletRequest request){
        star();
        data(messageService.selectMessageInfoList(request));
        success(true);
        return end();
    }

    /**
     * 结束问题
     * @param request
     * @return
     */
    @RequestMapping("updateMessageEnd")
    @ResponseBody
    public Object updateMessageEnd(HttpServletRequest request){
        star();
        messageService.updateMessageEnd(request);
        success(true);
        return end();
    }
}
