package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * 用户对象实体类
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/3 0003 下午 2:06
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("t_user")
public class User {

    //主键自增
    @TableId(type = IdType.AUTO)
    private Integer id;

    private String userName;

    private String passWord;

    private String type;

    private String email;

    private String phoneNumber;

    private String accountNumber;

    private String salt;

    private String department;

    private Date createTime;

    private Date updateTime;

    private String icon;
}
