package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

/**
 *
 * 权限实体类
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/3 0003 下午 2:12
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("t_permission")
public class Permission {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String permissionName;

    private String permission;

    private String permissionUrl;

    private String parentId;

    private Date createTime;

    private Date updateTime;

    private String type;
}
