package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 角色实体类
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/3 0003 下午 2:09
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("t_role")
public class Role {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String role;

    private String roleName;

    private Data createTime;

    private Data updateTime;

    private String type;
}
