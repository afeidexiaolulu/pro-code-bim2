package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author 陈坤鹏
 * @version 1.00
 * @time 2019/07/04 下午 14:34
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("t_model")
public class Model {

    @TableId(type = IdType.AUTO)
    private Integer id; /*主键*/

    private Integer parentId;   /*所属项目主键*/

    private String modelName;   /*模型名称*/

    private String modelImg; /*模型图*/

    private String modelSize;   /*模型图大小*/

    private String isOpen;  /*是否公开*/

    private  String remark; /*备注*/

    private String createPerson;    /*创建人*/

    private String updatePerson;    /*修改人*/

    private Date createTime;    /*创建时间*/

    private Date updateTime;    /*修改时间*/

    private  String toolType; /*建模工具*/

    private String currentVersion; /**当前版本**/

    private String createPersonName;    /**创建人姓名**/
}
