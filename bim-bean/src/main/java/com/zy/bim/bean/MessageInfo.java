package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @program: pro-code-bim
 * @description: 问题详情类
 * @author: LinChong
 * @create: 2019-09-02 14:31
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageInfo {
    @TableId(type = IdType.AUTO)
    private Integer id;
    /* 信息表主键 */
    private Integer parentId;
    /* 信息内容 */
    private String info;
    /* 创建人 */
    private Integer createPerson;
    /* 创建时间 */
    private Date createTime;
    /* 更新人 */
    private String updatePerson;
    /* 更新时间 */
    private Date updateTime;
    /* 接收人主键 */
    private Integer receivePerson;
    /* 读取状态 */
    private String readStatus;
    /* 问题状态 */
    private String status;
}
