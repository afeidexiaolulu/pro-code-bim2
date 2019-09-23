package com.zy.bim.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.bim.bean.FileAttachment;
import org.springframework.stereotype.Component;

/**
 * @author 陈坤鹏
 * @data 2019-07-18 10:43
 **/
@Component
public interface FileManagerMapper extends BaseMapper<FileAttachment> {

    String checkFileMd5(String fileMd5);

    String getFilePathById(String fileId);

    String getFileNameById(String modelImg);

    Integer deleteFileAttachmentById(String modelImg);
}
