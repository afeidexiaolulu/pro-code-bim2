package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.beans.Transient;
import java.util.Date;
import java.util.List;

/**
 *
 * 项目实体类
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/3 0003 下午 2:16
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("t_project")
public class Project {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String projectName;

    private String ProjectAddress;

    private String projectDescription;

    private String projectManager;

    private String createPerson;

    private Date createTime;

    private String updatePerson;

    private Date updateTime;

    @TableField(exist = false)
    private String img;
    @TableField(exist = false)
    private List<Model> models; //模型
    @TableField(exist = false)
    private  List<Problem> problems;//问题
    @TableField(exist = false)
    private  List<User> users;
    @TableField(exist = false)
    private  String createPersonName;//项目创建人姓名
    @TableField(exist = false)
    private  String createPersonPhoneNumber;//项目创建人电话

}
