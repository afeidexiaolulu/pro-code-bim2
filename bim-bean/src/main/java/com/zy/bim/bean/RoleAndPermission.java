package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/3 0003 下午 2:45
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("t_role_permission")
public class RoleAndPermission {

    @TableId(type = IdType.AUTO)
    private String id;

    private String roleId;

    //一个用户对于多个id
    private List<String> permissionIdList = new ArrayList<>();

    private Date createTime;

    private Date updateTime;
}
