package com.zy.bim.service.Impl;

import com.zy.bim.service.TransformationService;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author 陈坤鹏
 * @data 2019-08-08 16:36
 **/
@Service
public class TransformationServiceImpl implements TransformationService {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${filePath.transformationFilePath}")
    private String transformationFilePath;//文件存放目录

    @Override
    public String beginTransformation(String id, String inputFile, String quality) {
        int begin = inputFile.lastIndexOf("\\")+1;
        int end = inputFile.lastIndexOf(".");
        String str = inputFile.substring(begin,end)+"ToTransformation";
        String outputFile = transformationFilePath+"/"+str+"/"+"zhongYeBIM.esd";
        //String context = "2||C:\\Users\\BIM\\Desktop\\test\\1\\test2.rvt||C:/Users/BIM/Desktop/test/3/zyjyy.esd||6";
        String context = id + "||" + inputFile + "||" + outputFile + "||" + quality;
        System.out.println(context);
        rabbitTemplate.convertAndSend("BIMConverter_Mission", context);
        return "success";
    }
}
