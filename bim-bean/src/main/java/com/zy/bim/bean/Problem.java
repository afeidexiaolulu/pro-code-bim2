package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

/**
 * @author 王文强
 * @title: Problem
 * @emal 17600817572@163.com
 * @date 2019/7/5 000511:34
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Problem {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private  String problemName;

    private  String parentId;

    private String grade;

    private  String problemScreenshots;
    private String createPerson;    /*创建人*/

    private String updatePerson;    /*修改人*/

    private Date createTime;    /*创建时间*/

    private Date updateTime;    /*修改时间*/
    /*问题描述*/
    private  String describes;

    /*问题描述录音*/
    private  String problemDescribeRecording;

    /*问题处理人*/
    @TableField(exist = false)
    private  String problemSolverName;
}
