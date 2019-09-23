package com.zy.bim.util;

import com.zy.bim.bean.AccessToken;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class WeChatMediaDloadImgUtil {
    /**
     *
     * 根据文件id下载文件
     *
     *
     *
     * @param mediaId
     *
     *            媒体id
     *
     * @throws Exception
     */

    public static String voicePath = "D:/data/appfiles/voice";

    public static String getInputStream(String mediaId) {
        InputStream is = null;
        File amrPath = null;
        File mp3Path = null;
        String access_token = AccessToken.bimAccessToken;
        String url = "https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=" + access_token + "&media_id=" + mediaId;
        try {
            URL urlGet = new URL(url);
            HttpURLConnection http = (HttpURLConnection) urlGet.openConnection();
            http.setRequestMethod("GET"); // 必须是get方式请求
            http.setRequestProperty("Content-Type","audio/mp3");
            http.setDoOutput(true);
            http.setDoInput(true);
            System.setProperty("sun.net.client.defaultConnectTimeout", "30000");// 连接超时30秒
            System.setProperty("sun.net.client.defaultReadTimeout", "30000"); // 读取超时30秒
            http.connect();
            // 获取文件转化为byte流
            is = http.getInputStream();

            //获取项目路径
            /*String path = Thread.currentThread().getContextClassLoader().getResource("").toString();
            path = path.replace('/', '\\'); // 将/换成\
            path = path.replace("file:", ""); //去掉file:
            path = path.replace("classes\\", ""); //去掉classes\
            path = path.replace("target\\", ""); //去掉target\
            path = path.replace("WEB-INF\\", "");//去掉web-inf\
            path = path.substring(1); //去掉第一个\,如 \D:\JavaWeb...
            //文件添加下级目录地址
            path += "static"+File.separator +"common" + File.separator +"voice";*/
            String path = voicePath;
            UUID uuid = UUID.randomUUID();
            String fileName = uuid.toString().replace("-", "");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            File file = new File(path);
            File todayFile = new File(path + "\\" + sdf.format(new Date()));
            amrPath = new File(todayFile + "\\" + fileName + ".amr");
            mp3Path = new File(amrPath.toString().replace(".amr", ".mp3"));
            //如果文件夹不存在则创建
            if  (!file.exists()  && !file.isDirectory()){
                file.mkdir();
            }
            if  (!todayFile.exists()  && !todayFile.isDirectory()){
                todayFile.mkdir();
            }

            BufferedInputStream in = new BufferedInputStream(is);
            BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(amrPath));
            byte[] by = new byte[1024];
            int lend = 0;
            while((lend = in.read(by)) != -1){
                out.write(by,0,lend);
            }
            in.close();
            out.close();
            //转码
            amrToMp3(amrPath.toString(),mp3Path.toString());
            //删除amr文件
            if(amrPath.isFile() && amrPath.exists()){
                amrPath.delete();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        //返回一个数据库存储的格式 ：wgBank\static\common\voice\2017-10-23\3d1043b7dafe44a78cf4f2e45047d999.mp3
        String pathStr = mp3Path.toString();
        int begin = pathStr.indexOf("\\",20);
        int end = pathStr.length();
        String path = pathStr.substring(begin,end);
        return path;

    }

    public static void amrToMp3(String sourcePath, String targetPath)  {
        File source = new File(sourcePath);
        File target = new File(targetPath);
        it.sauronsoftware.jave.AudioUtils.amrToMp3(source, target);
    }
}