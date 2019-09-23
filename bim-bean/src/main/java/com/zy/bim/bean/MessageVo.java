package com.zy.bim.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @program: pro-code-bim
 * @description: 问题回显类
 * @author: LinChong
 * @create: 2019-09-04 14:28
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageVo {
    /* 问题id */
    private Integer id;
    /* messageId */
    private Integer messageId;
    /* 信息内容 */
    private String info;
    /* 项目名称 */
    private String projectName;
    /* 问题名称 */
    private String problemName;
    /* 问题等级 */
    private String grade;
    /* 问题内容 */
    private String problemInfo;
    /* 发送人id */
    private String sendPerson;
    /* 发送人名称 */
    private String sendPersonName;
    /* 接收人id */
    private String receivePerson;
    /* 接收人姓名 */
    private String receivePersonName;
    /* 发送类型 */
    private String sendType;
    /* 问题状态 */
    private String status;
    /* 读取状态 */
    private String readStatus;
    /* 创建时间 */
    private Date createTime;
    /* 是否结束 */
    private Integer isEnd;

}
