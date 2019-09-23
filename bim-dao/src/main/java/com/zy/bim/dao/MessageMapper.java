package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.Message;
import com.zy.bim.bean.MessageInfo;
import com.zy.bim.bean.MessageVo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author linchong
 * @Create 2019/9/2 16:30
 */
@Component
public interface MessageMapper extends BaseMapper<Message> {
    /*##################################
    * ############新增###############
    * ##################################*/
    /**
     * 新增问题
     * @param message
     * @return
     */
    public int insert(Message message);

    /**
     * 问题详情插入
     * @param messageInfo
     * @return
     */
    public int insertMessageInfo(MessageInfo messageInfo);

    /**
     * 更新问题详情
     * @param messageInfo
     */
    void updateInfo(MessageInfo messageInfo);
    /*##################################
     * ############查询###############
     * ##################################*/
    /**
     *  分页查询
     * @param userId
     * @param status 处理状态
     * @return
     */
    List<MessageVo> selectMessageByUser(@Param("userId")Integer userId,@Param("status")String status,@Param("currentPage")Integer currentPage,@Param("pageSize")Integer pageSize);
    /**
     * 查询问题回复列表
     * @param parentId 问题id
     * @return
     */
    List<MessageVo> selectMessageInfoList(@Param("parentId")Integer parentId);
    /**
     * 查询问题详情
     * @param id
     * @return
     */
    MessageInfo getInfoById(@Param("id")Integer id);
    /**
     * 查询问题数量
     * @param userId 用户id
     * @param readStatus 读取状态(英文全拼)
     * @return
     */
    int getReadNum(@Param("userId")Integer userId,@Param("readStatus")String readStatus);
    /**
     * 查询messageId
     * @param problemId 问题id
     * @return
     */
    Integer getMessageId(@Param("problemId")Integer problemId);

    /**
     *  根据id查询message
     * @param messageId
     * @return
     */
    Message getMessageById(@Param("messageId")Integer messageId);
    /*##################################
     * ############更新###############
     * ##################################*/
    /**
     *  更新问题处理状态
     * @param messageId
     */
    void updateInfoStatus(@Param("messageId")Integer messageId);
    /**
     * 更新问题
     * @param message
     */
    public void update(Message message);

    /**
     * 根据问题id和发送人id查询处理人
     */
    String queryProblemSolverName(Map parame);
}
