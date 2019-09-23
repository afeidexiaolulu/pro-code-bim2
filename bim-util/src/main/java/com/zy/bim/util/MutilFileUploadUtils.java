package com.zy.bim.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;

import com.zy.bim.bean.MutilFileInfo;
import org.springframework.web.multipart.MultipartFile;

/**
 * @version 1.0
 * @author 陈坤鹏
 * @since 2019-07-15
 * @return 大文件上传工具类
 */
public class MutilFileUploadUtils {

    /**
     *      校验文件切片上传参数(字节流文件不能为空)
     * @param fileinfo:上传参数实体类
     * @return  判断是否文件切片上传，true：切片上传，false:单文件整体上传
     * @throws Exception
     */
    public static Boolean checkMutiFilePremeter(MutilFileInfo fileinfo) {
        if(fileinfo!=null) {
            if(fileinfo.getChunks()!= null && fileinfo.getChunk() != null && fileinfo.getChunks() >1 && fileinfo.getChunk() >= 0 && fileinfo.getChunks() > fileinfo.getChunk()) {
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }
    /**
     *      校验文件单文件上传参数(字节流文件不能为空)
     * @param fileinfo:上传参数实体类
     * @return  判断参数上传是否合法，true：符合单文件上传参数格式，false:不符合单文件格式
     * @throws Exception
     */
    public static Boolean checkSingleFilePremeter(MutilFileInfo fileinfo) {
        if(fileinfo != null) {
            if(fileinfo.getChunks() == null && fileinfo.getChunk() == null) {
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }
    /**
     *      保存文件到指定目录
     * @param file:上传参数实体类
     * @throws Exception
     */
    public static void saveFile2DirPath(MultipartFile file,File targetFile) throws Exception {
        if(targetFile.createNewFile()){
            file.transferTo(targetFile);
        }
    }
    /**
     *     创建空目标文件
     * @throws IOException
     * @throws Exception
     */
    public static void readySpaceFile(MutilFileInfo fileinfo,File tempFile) throws IOException{
        RandomAccessFile targetSpaceFile = new RandomAccessFile(tempFile, "rws");
        targetSpaceFile.setLength(fileinfo.getSize());
        System.out.println("创建文件：" + fileinfo.getSize());
        targetSpaceFile.close();
    }

    /**
     * 向空文件写入二进制数据
     * @param file
     * @param tempFile
     * @param fileInfo
     * @throws Exception
     */
    @SuppressWarnings("resource")
    public static void spaceFileWriter(MultipartFile file, File tempFile,MutilFileInfo fileInfo) throws Exception {
        long totalSpace = tempFile.getTotalSpace();
        RandomAccessFile raf = new RandomAccessFile(tempFile, "rw");
        BufferedInputStream sourceBuffer = new BufferedInputStream(file.getInputStream());
        Long startPointer = getFileWriterStartPointer(file, fileInfo);
        raf.seek(startPointer);//初始化文件指针起始位置
        byte[] bt = new byte[1024];
        int n = 0;
        try {
            while ((n = sourceBuffer.read(bt)) != -1){
                raf.write(bt);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(sourceBuffer!=null) {
                sourceBuffer.close();
            }
            if(raf!=null) {
                raf.close();
            }
        }
    }

    /**
     * 计算指针开始位置
     * @param file
     * @param fileInfo
     * @return
     * @throws Exception
     */
    synchronized public static Long getFileWriterStartPointer(MultipartFile file, MutilFileInfo fileInfo) throws Exception {
        // TODO Auto-generated method stub
        long chunkSize = file.getSize();
        Integer currChunk = fileInfo.getChunk();
        Integer allChunks = fileInfo.getChunks();
        Long allSize = fileInfo.getSize();
        if(currChunk < (allChunks - 1)){
            long starter = chunkSize*currChunk;
            return starter;
        }else if(currChunk == (allChunks - 1)){
            long starter = allSize-chunkSize;
            return starter;
        }else {
            throw new Exception("分片参数异常");
        }
    }
}