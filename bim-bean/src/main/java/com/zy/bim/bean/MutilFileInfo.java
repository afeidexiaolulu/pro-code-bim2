package com.zy.bim.bean;

import java.io.File;

/**
 * @version 1.0
 * @author 陈坤鹏
 * @since 2019-07-15
 * @return 大文件分片,断点上传实体类
 */
public class MutilFileInfo {
    private String id; //文件id
    private String name; //文件名称
    private String type;//文件类型
    private String lastModifiedDate;//文件最后一次修改时间
    private Long size;//文件总大小
    //private Byte[] file;//副本字节流文件
    private Integer chunk;//当前分片序号
    private Integer chunks;//分片总数
    private File fileChunk;//文件临时分片
    private Boolean saved=false;//分片是否保存成功 默认值:false

    public Boolean getSaved() {
        return saved;
    }
    public void setSaved(Boolean saved) {
        this.saved = saved;
    }

    public String getId() {
        return id;
    }
    public File getFileChunk() {
        return fileChunk;
    }

    public void setFileChunk(File fileChunk) {
        this.fileChunk = fileChunk;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getLastModifiedDate() {
        return lastModifiedDate;
    }
    public void setLastModifiedDate(String lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Long getSize() {
        return size;
    }
    public void setSize(Long size) {
        this.size = size;
    }

    public Integer getChunk() {
        return chunk;
    }
    public void setChunk(Integer chunk) {
        this.chunk = chunk;
    }

    public Integer getChunks() {
        return chunks;
    }
    public void setChunks(Integer chunks) {
        this.chunks = chunks;
    }

    @Override
    public String toString() {
        return "MutilFileInfo [id=" + id + ", name=" + name + ", type=" + type + ", lastModifiedDate="
                + lastModifiedDate + ", size=" + size + ", chunk=" + chunk + ", chunks=" + chunks + ", fileChunk="
                + fileChunk + ", saved=" + saved + "]";
    }
}
