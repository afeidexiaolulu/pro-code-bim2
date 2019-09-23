package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author 陈坤鹏
 * @data 2019-07-29 16:08
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("t_model_share")
public class ModelShare {
    @TableId(type = IdType.AUTO)
    private Integer id; /*主键*/

    private Integer parentId;   /*所属项目主键*/

    private Integer modelId;   /*模型主键*/

    private String modelName;   /*模型名称*/

    private String createPerson;    /*创建人*/

    private String updatePerson;    /*修改人*/

    private Date createTime;    /*创建时间*/

    private Date updateTime;    /*修改时间*/

    private String shareStatu;   /**分享状态**/

    private Date startSharingTime; /**开始分享时间**/

    private Integer shareDay; /**分享时间**/

    private Date endSharingTime;    /**结束分享时间**/

    private String createPersonName;    /**创建人姓名**/

    @TableField(exist = false)
    private String projectName;    /**项目名称**/
}
