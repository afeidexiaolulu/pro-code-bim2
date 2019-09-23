package com.zy.bim.util;
import java.io.*;


import org.apache.poi.xwpf.usermodel.*;

import javax.servlet.http.HttpServletResponse;

public class DocUtil {
   /* private Configuration configure = null;
    public DocUtil(){
        configure= new Configuration();
        configure.setDefaultEncoding("utf-8");
    }
    *//**
     * 根据Doc模板生成word文件
     *
     * @param fileName 文件名称
     *
     *//*
    public void createDoc(Map<String, Object> dataMap, String downloadType, String savePath){
        try{
            //加载需要装填的模板
            Template template  = null;
            //加载模板文件
            configure.setClassForTemplateLoading(this.getClass(),"/com/favccxx/secret/templates");
            //设置对象包装器
            configure.setObjectWrapper(new DefaultObjectWrapper());
            //设置异常处理器
            configure.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
            //定义Template对象,注意模板类型名字与downloadType要一致
            template= configure.getTemplate(downloadType + ".ftl");
            //输出文档
            File outFile = new File(savePath);
            Writer out = null;
            out= new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile),"utf-8"));
            template.process(dataMap,out);
            outFile.delete();
        }catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    public void exportWord(XWPFDocument document, HttpServletResponse response, String fileName) throws Exception{
        XWPFDocument document1= new XWPFDocument();
        response.setHeader("Content-Disposition","attachment;fileName="+ fileName+".docx");
        response.setContentType("application/msword");
        OutputStream os = response.getOutputStream();
        document.write(os);
        os.flush();
        os.close();
    }







}