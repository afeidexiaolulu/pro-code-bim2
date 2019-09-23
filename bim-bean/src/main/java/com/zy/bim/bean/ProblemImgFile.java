package com.zy.bim.bean;

import java.util.Date;
import java.util.UUID;

/**
 * @author 王文强
 * @title: ImgFile
 * @emal 17600817572@163.com
 * @date 2019/7/19 001914:58
 */
public class ProblemImgFile {
    /**主键id*/
    private  String id;
    /**图片地址*/
    private String img;
    /**创建时间*/
    private Date createTime;

    /**创建人*/
    private  String creteBy;
    /**存入磁盘*/
    private  String storeType;
    /**后缀*/
    private  String ext;

    public String getCreteBy() {
        return creteBy;
    }

    public void setCreteBy(String creteBy) {
        this.creteBy = creteBy;
    }

    public String getStoreType() {
        return storeType;
    }

    public void setStoreType(String storeType) {
        this.storeType = storeType;
    }

    public String getExt() {
        return ext;
    }

    public void setExt(String ext) {
        this.ext = ext;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public static void main(String[] args) {
        System.out.println( UUID.randomUUID().toString());
    }
}
