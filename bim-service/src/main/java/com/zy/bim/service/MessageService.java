package com.zy.bim.service;

import com.zy.bim.bean.Message;
import com.zy.bim.bean.MessageVo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/26 0026 上午 10:53
 */
public interface MessageService {

    String sendMessage(String phoneNumber, HttpSession session) throws Exception;

    /**
     * 新增问题
     * @param request
     * @return
     */
    public int insert(HttpServletRequest request);

    /**
     * 查询用户接收的问题列表
     * @param request
     * @return
     */
    public List<MessageVo> selectMessagePage(HttpServletRequest request);

    /**
     * 问题回复
     * @param request
     */
    public void updateMessageInfo(HttpServletRequest request);

    /**
     * 查询阅读数量
     * @param request
     * @return
     */
    public int getReadNum(HttpServletRequest request);

    /**
     * 获取message对象
     * @param problemId
     * @return
     */
    Message getMessageId(Integer problemId);
    /**
     * 查询问题回复列表
     * @param request
     * @return
     */
    public List<MessageVo> selectMessageInfoList(HttpServletRequest request);

    /**
     * 问题详情-回复内容
     * @param problemId
     * @return
     */
    public List<MessageVo> selectMessageListByProblem(Integer problemId);

    /**
     * 更新读取状态
     * @param problemId
     */
    void updateReadStatus(Integer problemId,HttpServletRequest request);

    /**
     * 结束问题
     * @param request
     */
    void updateMessageEnd(HttpServletRequest request);

    /**
     * 根据问题id和发送人id查询处理人
     */
    String queryProblemSolverName(Map parame);
}
