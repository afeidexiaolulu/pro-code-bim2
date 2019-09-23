package com.zy.bim.util;

import org.apache.poi.xwpf.usermodel.*;

import java.io.File;
import java.io.FileOutputStream;

/**
 * @author 王文强
 * @title: FileUti
 * @emal 17600817572@163.com
 * @date 2019/7/4 00049:32
 */
public class FileUtil {

    public final static String IMG_PATH_PREFIX = "static/img";

    public static File getImgDirFile(String save) {
        try {
            // 构建上传文件的存放 "文件夹" 路径
            String fileDirPath = new String(save);

            File fileDir = new File(fileDirPath);
            if(!fileDir.exists()&&!fileDir.isDirectory()) {
                fileDir.mkdirs();
            }
            return fileDir;
        }catch (Exception e){

        }
       return null;

    }



}
