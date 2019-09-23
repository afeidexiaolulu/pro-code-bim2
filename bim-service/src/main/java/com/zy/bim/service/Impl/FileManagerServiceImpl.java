package com.zy.bim.service.Impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.bim.bean.FileAttachment;
import com.zy.bim.bean.MutilFileInfo;
import com.zy.bim.bean.User;
import com.zy.bim.dao.FileManagerMapper;
import com.zy.bim.dao.ModelMapper;
import com.zy.bim.service.FileManagerService;
import com.zy.bim.util.Const;
import com.zy.bim.util.MutilFileUploadUtils;
import com.zy.bim.util.SHA256Util;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Service
public class FileManagerServiceImpl extends ServiceImpl<FileManagerMapper, FileAttachment> implements FileManagerService {

    @Value("${filePath.tempWorkBasePath}")
    private String tempWorkPath;//分片临时文件存放目录

    @Value("${filePath.saveFileBasePath}")
    private String saveFilePath;//文件存放目录

    @Value("${ftpPath.ftpIp}")
    private String ftpIp;//ftp服务器ip

    @Value("${ftpPath.accountNumber}")
    private String accountNumber;//ftp服务器账号

    @Value("${ftpPath.password}")
    private String password;//ftp服务器密码

    @Value("${ftpPath.ftpPort}")
    private Integer ftpPort;//ftp服务器端口

    @Value("${ftpPath.ftpFilePath}")
    private String ftpFilePath;//ftp服务器储存地址

    private ReentrantLock filetempLock = new ReentrantLock();

    @Autowired
    private FileManagerMapper fileManagerMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void saveMutiBurstFiletoDir(MutilFileInfo fileinfo, MultipartFile file) throws Exception {
        this.checkBaseDir(tempWorkPath);
        File tempFile = this.GenerateDirPathForCurrFile(fileinfo,"chunks");
        MutilFileUploadUtils.spaceFileWriter(file,tempFile,fileinfo);
    }

    @Override
    public void saveSingleFiletoDir(MutilFileInfo fileinfo, MultipartFile file) throws Exception {
        this.checkBaseDir(saveFilePath);
        File targetFile = this.GenerateDirPathForCurrFile(fileinfo,"single");
        //单文件上传
        MutilFileUploadUtils.saveFile2DirPath(file,targetFile);
        //上传成功后传ftp服务器
        //FileInputStream is = new FileInputStream(targetFile);
        //boolean b = storeFile(targetFile.getName(), is);
    }

    @Override
    synchronized public File  GenerateDirPathForCurrFile(MutilFileInfo fileinfo,String flag) throws Exception {
        String fileName = fileinfo.getName();   //原始文件名
        String lastModifiedDate = fileinfo.getLastModifiedDate();   //最后修改时间
        long fileSize = fileinfo.getSize(); //文件大小
        String type = fileinfo.getType();
        String id = fileinfo.getId();
        String extName = fileName.substring(fileName.lastIndexOf("."));
        long timeStemp=System.currentTimeMillis();
        if("single".equals(flag)) {
            String fileNameSource = fileName+lastModifiedDate+fileSize+type+id+timeStemp;
            String fileDirName = SHA256Util.getSHA256StrJava(fileNameSource)+extName;
            File targetFile = new File(saveFilePath,fileDirName);
            while(targetFile.exists()){
                fileNameSource = fileNameSource + "1";
                fileDirName = SHA256Util.getSHA256StrJava(fileNameSource) + extName;
                targetFile = new File(fileDirName);
            }
            return targetFile;
        }else if("chunks".equals(flag)) {
            String fileNameSource = fileSize + "_" + fileName + id + lastModifiedDate;
            String fileDirName = tempWorkPath + "/" + SHA256Util.getSHA256StrJava(fileNameSource) + extName + ".temp";
            File tempFile = new File(fileDirName);//禁用FileInfo.exists()类, 防止缓存导致并发问题
            if(!(tempFile.exists()&&tempFile.isFile())){
                filetempLock.lock();//上锁
                if(!(tempFile.exists()&&tempFile.isFile())) {
                    MutilFileUploadUtils.readySpaceFile(fileinfo,tempFile);
                }
                filetempLock.unlock();//释放锁
            }
            tempFile = new File(fileDirName);
            return tempFile;
        }else{
            throw new Exception("目标文件生成失败");
        }
    }

    @Override
    public String download(HttpServletRequest request, HttpServletResponse response) throws FileNotFoundException, UnsupportedEncodingException {

        String modelImg = request.getParameter("modelImg");   //获取模型储存地址的主键

        String filePath = fileManagerMapper.getFilePathById(modelImg);
        String filename = new String(fileManagerMapper.getFileNameById(modelImg).getBytes(), "ISO-8859-1");
        ;

        File file = new File(filePath);
        if(file.exists()){ //判断文件父目录是否存在
            response.setContentType("application/force-download");
            response.setHeader("Content-Disposition", "attachment;fileName=" + filename);

            byte[] buffer = new byte[1024]; //创建数据缓冲区
            FileInputStream fis = null; //文件输入流
            BufferedInputStream bis = null;

            OutputStream os = null; //输出流
            try {
                os = response.getOutputStream();
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                int i = bis.read(buffer);
                while(i != -1){
                    os.write(buffer);
                    i = bis.read(buffer);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }finally{
                if (bis != null) {
                    try {
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return null;
    }

    @Override
    public String checkFileMd5(HttpServletRequest request) {
        String fileMd5 = request.getParameter("fileMd5");
        String id = fileManagerMapper.checkFileMd5(fileMd5);
        if(id != null ){
            return id;
        }else {
            return "false";
        }
    }

    @Override
    public String deltefile(HttpServletRequest request, HttpServletResponse response) {
        String fileId = "20";//request.getParameter("fileId");
        String modelId = "1";//request.getParameter("modelId");
        String filePath = fileManagerMapper.getFilePathById(fileId);//"4d8ab595fe4a550ebeeecc4fb72fd7bd88d29075644987c0937ce8def1bbe583.rvt";
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("modelId",modelId);
        params.put("newModelImgId",null);
        File file = new File(filePath);
        //验证文件是否存在,并且不为文件夹
        try{
            if(file.exists() && file.isFile()) {
                //删除文件
                if(file.delete()){
                    System.out.println(file.getName() + " 文件已被删除！");
                    //删除模型图表下的img字段
                    Integer updNum = modelMapper.updateImgByFileId(params);
                    Integer delNum = fileManagerMapper.deleteById(Integer.parseInt(fileId));
                    System.out.println("更新: "+ updNum +" 条");
                    System.out.println("删除: "+ delNum +" 条");
                }else{
                    System.out.println("文件删除失败！");
                }
            }else {
                System.out.println("文件不存在!");
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public void checkBaseDir(String baseDir) throws Exception {
        File file = new File(baseDir);
        if(!file.exists()&&!file.isDirectory()) {
            file.mkdirs();
        }
    }

    //文件合并
    @Override
    public String MutilMergingChunks(MutilFileInfo fileinfo,HttpServletRequest request) throws Exception {
        String fileName = fileinfo.getName();   //文件名
        String lastModifiedDate = fileinfo.getLastModifiedDate();   //最后修改时间
        long fileSize = fileinfo.getSize(); //文件大小
        String id = fileinfo.getId();
        String extName = fileName.substring(fileName.lastIndexOf("."));
        String fileNameSource = fileSize + "_" + fileName + id + lastModifiedDate;
        String fileDirName = tempWorkPath + "/" + SHA256Util.getSHA256StrJava(fileNameSource) + extName + ".temp";
        File tempFile = new File(fileDirName);
        //验证文件是否存在,并且不为文件夹
        if(tempFile.exists() && tempFile.isFile()) {
            checkBaseDir(saveFilePath);
            String targetDirName = saveFilePath + "/"+ SHA256Util.getSHA256StrJava(fileNameSource);
            File targetFile=new File(targetDirName+extName);
            //文件已经存在后缀名+1
            while(targetFile.exists() && targetFile.isFile()) {
                targetDirName = targetDirName + "1";
                targetFile=new File(targetDirName+extName);
            }
            System.out.println(targetFile.getAbsolutePath());

            //数据库操作
            User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //获取当前登录的session用户
            String fileMd5 = request.getParameter("fileMd5"); //获取文件md5值
            FileAttachment fileAttachment = new FileAttachment();
            String userId = user.getId().toString();
            String projectId = (String) request.getSession().getAttribute(Const.PROJECT_ID); //获取当前选中的项目id

            fileAttachment.setCreateBy(userId);
            fileAttachment.setCreateTime(new Date());
            fileAttachment.setExt(extName);
            fileAttachment.setStoreType("disk");
            fileAttachment.setFileName(fileName);
            fileAttachment.setTotalBytes(fileSize+"");
            fileAttachment.setFilePath(targetFile.getAbsolutePath());
            fileAttachment.setFileMd5(fileMd5);
            fileAttachment.setProblemId(projectId);

            if(tempFile.renameTo(targetFile)) {
                System.out.println("文件重命名成功!");
                //将文件信息插入数据库
                fileManagerMapper.insert(fileAttachment);
                String returnId = fileAttachment.getId()+"";
                System.out.println("生成的id为:"+returnId);
                //文件合并成功后将文件传输到ftp服务器
                /*FileInputStream is = new FileInputStream(targetFile);
                boolean b = storeFile(targetFile.getName(), is);

                if(!b){
                    System.out.println("文件ftp传输失败!");
                    throw new Exception("文件ftp传输失败!");
                }*/
                //返回生成的id
                return returnId;
            }else {
                System.out.println("文件重命名失败!");
                throw new Exception("临时文件重命名失败");
            }
        }else{
            throw new Exception("未找到临时文件");
        }
    }

    //传输到ftp服务器方法
    public boolean storeFile ( String fileName, InputStream is) {
        boolean result = false;
        FTPClient ftp = new FTPClient();
        try {
            // 连接至服务器，端口默认为21时，可直接通过URL连接
            ftp.connect(ftpIp ,ftpPort);
            // 登录服务器
            ftp.login(accountNumber, password);
            // 判断返回码是否合法
            if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
                // 不合法时断开连接
                ftp.disconnect();
                // 结束程序
                return result;
            }
            // 设置文件操作目录
            boolean b = ftp.changeWorkingDirectory(ftpFilePath);
            System.out.println(b);
            // 设置文件类型，二进制
            ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
            // 设置缓冲区大小
            ftp.setBufferSize(3072);
            // 上传文件
            result = ftp.storeFile(fileName, is);
            System.out.println(result);
            // 关闭输入流
            is.close();
            // 登出服务器
            ftp.logout();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                // 判断输入流是否存在
                if (null != is) {
                    // 关闭输入流
                    is.close();
                }
                // 判断连接是否存在
                if (ftp.isConnected()) {
                    // 断开连接
                    ftp.disconnect();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

}
