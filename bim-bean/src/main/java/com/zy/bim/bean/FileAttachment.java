package com.zy.bim.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * 文件信息实体类
 * @author 陈坤鹏
 * @data 2019-07-18 10:36
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("t_file_attachment")
public class FileAttachment {

    @TableId(type = IdType.AUTO)
    private Integer id; /*主键*/

    private String fileName;    //文件名

    private String storeType;   //存储类型

    private String filePath;    //文件地址

    private String totalBytes;  //文件大小

    private String ext;    //拓展名

    private String createBy;   //创建人

    private Date createTime;   //创建时间

    private String fileMd5;   //文件md5值

    private String problemId;   //问题id

}
