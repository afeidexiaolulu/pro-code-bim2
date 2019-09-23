package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/3 0003 下午 2:48
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("t_user_role_project")
public class UserRoleProject {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String userId;

    private String roleId;

    private String projectId;

    private Date createTime;

    private Date updateTime;

    private String createPerson;

    private String updatePerson;
}
