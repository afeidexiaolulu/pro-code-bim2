package com.zy.bim.service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.zy.bim.bean.Message;
import com.zy.bim.bean.MessageInfo;
import com.zy.bim.bean.MessageVo;
import com.zy.bim.bean.User;
import com.zy.bim.dao.MessageMapper;
import com.zy.bim.service.MessageService;
import com.zy.bim.util.AuthCode;
import com.zy.bim.util.ClientUtil;
import com.zy.bim.util.Const;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 发送短信的服务
 *
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/26 0026 上午 10:53
 */
@Service
public class MessageServiceImpl implements MessageService {

    private static Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);
    @Autowired
    private MessageMapper messageMapper;

    //阿里云appCode
    @Value("${appCode}")
    String appCode;

    @Value("${TPid}")
    String TPid;

    //发送验证码
    @Override
    public String sendMessage(String phoneNumber, HttpSession session) throws Exception {
        //生成验证码
        String randomCode = AuthCode.randomCode();
        String paramCodeWord = "code:" + randomCode;
        //将生成的验证码放入session
        session.setAttribute(Const.RANDOM_CODE, randomCode);
        //验证码创建时间存入session中
        session.setAttribute(Const.CODE_TIME, System.currentTimeMillis());

        //系统参数
        String host = "http://yzx.market.alicloudapi.com";
        String path = "/yzx/sendSms";
        String method = "POST";
        String appcode = appCode;

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "APPCODE " + appcode);

        Map<String, String> querys = new HashMap<>();
        querys.put("mobile", phoneNumber);
        querys.put("param", paramCodeWord);
        querys.put("tpl_id", TPid);
        Map<String, String> bodys = new HashMap<>();

        HttpResponse response = ClientUtil.doPost(host, path, method, headers, querys, bodys);
        //获取response的body
        JSONObject jsonObject = JSONObject.parseObject(EntityUtils.toString(response.getEntity()));
        String returnCode = jsonObject.getString("return_code");
        if (!returnCode.equals("00000")) {
            logger.error("短信发送失败,阿里云平台原因,手机号码为：{},错误码：{}", phoneNumber, returnCode);
            throw new RuntimeException();
        }
        return returnCode;
    }

    /**
     * 新增问题发送
     *
     * @param request
     * @return
     */
    @Override
    public int insert(HttpServletRequest request) {
        try {
            User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
            String problemId = request.getParameter("problemId"); //项目id
            String sendPerson = user.getId().toString();    //用户id
            String receivePerson = request.getParameter("receivePerson");
            String info = request.getParameter("info");
            Message message = new Message();
            message.setParentId(Integer.parseInt(problemId));
            message.setSendPerson(Integer.parseInt(sendPerson));
            message.setSendType("处理人");
            message.setCreateTime(new Date());
            Integer id = messageMapper.insert(message);
            if (id != null && id != 0) {
                try {
                    MessageInfo messageInfo = new MessageInfo();
                    messageInfo.setParentId(message.getId());
                    messageInfo.setInfo(info);
                    messageInfo.setReceivePerson(Integer.parseInt(receivePerson));
                    messageInfo.setReadStatus("weidu");
                    messageInfo.setCreatePerson(user.getId());
                    messageInfo.setCreateTime(new Date());
                    messageInfo.setStatus("weichuli");
                    messageMapper.insertMessageInfo(messageInfo);
                } catch (Exception e) {
                    logger.error("【保存问题详情报错】");
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            logger.error("【发送问题出错】");
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * 查询用户接收的问题列表
     *
     * @param request
     * @return
     */
    @Override
    public List<MessageVo> selectMessagePage(HttpServletRequest request) {

        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER);
        String currentPage = null;
        String pageSize = null;
        try {
            String status = request.getParameter("status");
            currentPage = request.getParameter("currentPage");
            pageSize = request.getParameter("pageSize");
            return messageMapper.selectMessageByUser(user.getId(), status,(Integer.parseInt(currentPage) - 1) * Integer.parseInt(pageSize), Integer.parseInt(pageSize));
        } catch (Exception e) {
            logger.error("获取参数错误");
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 问题回复
     *
     * @param request
     */
    @Override
    public void updateMessageInfo(HttpServletRequest request) {
        String id = request.getParameter("id");
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String info = request.getParameter("info");
        MessageInfo messageInfo = messageMapper.getInfoById(Integer.parseInt(id));
        if (messageInfo != null) {
            try {
                //回复
                MessageInfo newMessageInfo = new MessageInfo();
                newMessageInfo.setCreateTime(new Date());
                newMessageInfo.setCreatePerson(user.getId());
                newMessageInfo.setReceivePerson(messageInfo.getCreatePerson());
                newMessageInfo.setParentId(Integer.parseInt(id));
                newMessageInfo.setInfo(info);
                newMessageInfo.setReadStatus("weidu");
                newMessageInfo.setUpdatePerson(user.getId().toString());
                newMessageInfo.setUpdateTime(new Date());
                newMessageInfo.setStatus("weichuli");
                messageMapper.insertMessageInfo(newMessageInfo);
                //已处理
                messageInfo.setStatus("yichuli");
                messageInfo.setUpdateTime(new Date());
                messageInfo.setUpdatePerson(user.getId().toString());
                messageMapper.updateInfo(messageInfo);
            } catch (Exception e) {
                logger.error("问题回复错误");
                e.printStackTrace();
            }
        }
    }

    @Override
    public int getReadNum(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String readStatus = request.getParameter("readStatus");
        return messageMapper.getReadNum(user.getId(),readStatus);
    }

    /**
     * 根据问题id查询message
     * @param problemId
     * @return
     */
    @Override
    public Message getMessageId(Integer problemId) {
        if(problemId != null){
            try {
                Integer messageId = messageMapper.getMessageId(problemId);
                return messageMapper.getMessageById(messageId);
            } catch (Exception e) {
                logger.error("根据问题id查询message错误");
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 查询问题回复列表
     * @param request
     * @return
     */
    @Override
    public List<MessageVo> selectMessageInfoList(HttpServletRequest request) {
        String parentId = request.getParameter("parentId");
        if(StringUtils.isNotEmpty(parentId)){
            return messageMapper.selectMessageInfoList(Integer.parseInt(parentId));
        }
        return null;
    }

    /**
     * 问题详情-回复内容
     * @param problemId
     * @return
     */
    @Override
    public List<MessageVo> selectMessageListByProblem(Integer problemId) {
        if(problemId != null){
            try {
                Integer messageId = messageMapper.getMessageId(problemId);
                if(messageId != null){
                    return messageMapper.selectMessageInfoList(messageId);
                }
            } catch (Exception e) {
                logger.error("回复内容查询错误");
                e.printStackTrace();
            }
        }
        return null;
    }

    @Override
    public void updateReadStatus(Integer problemId,HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        Integer messageId = messageMapper.getMessageId(problemId);
        MessageInfo messageInfo = messageMapper.getInfoById(messageId);
        messageInfo.setReadStatus("yidu");

        messageMapper.updateInfo(messageInfo);
    }

    /**
     * 问题结束
     * @param request
     */
    @Override
    public void updateMessageEnd(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String problemId=request.getParameter("problemId");
        if(StringUtils.isNotEmpty(problemId)){
            try {
                Integer messageId = messageMapper.getMessageId(Integer.parseInt(problemId));
                Message message = messageMapper.getMessageById(messageId);
                if(user.getId() == message.getSendPerson()){
                    message.setId(messageId);
                    message.setIsEnd(1);
                    messageMapper.update(message);
                    messageMapper.updateInfoStatus(messageId);
                }else{
                    logger.info("当前用户没有结束问题权限");
                }
            } catch (NumberFormatException e) {
                logger.error("更新结束状态错误");
                e.printStackTrace();
            }
        }
    }

    @Override
    public String queryProblemSolverName(Map parame) {
        return messageMapper.queryProblemSolverName(parame);
    }
}
