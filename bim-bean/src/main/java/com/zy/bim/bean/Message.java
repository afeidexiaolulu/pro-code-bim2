package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @program: pro-code-bim
 * @description: 问题发送类
 * @author: LinChong
 * @create: 2019-09-02 14:30
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @TableId(type = IdType.AUTO)
    private Integer id;
    /* 问题主键 */
    private Integer parentId;
    /* 发送人主键 */
    private Integer sendPerson;

    /* 发送类型 */
    private String sendType;

    /* 创建人 */
    private String createPerson;
    /* 创建时间 */
    private Date createTime;
    /* 更新人 */
    private String updatePerson;
    /* 更新时间 */
    private Date updateTime;
    /* 是否结束 */
    private Integer isEnd;
}
