package com.zy.bim.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.zy.bim.bean.AccessToken;
import com.zy.bim.service.ModelShareService;
import com.zy.bim.util.HttpClientUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ScheduledTask implements ApplicationRunner {

    @Autowired
    private ModelShareService modelShareService;

    @Value("${qyWeChat.bimAppId}")
    public String bimAppId;
    @Value("${qyWeChat.bimCorpsecret}")
    public String bimCorpsecret;
    @Value("${qyWeChat.addressBookCorpsecret}")
    public String addressBookCorpsecret;

    @Scheduled(fixedRate = 10800000)
    public void scheduledTask(){
        //每隔三小时查询一次modelShare表中小于当前时间数据,把分享状态share_statu改为false
        Integer updNum = modelShareService.closeShareStatu();
        System.out.println("关闭了"+updNum+"条");
    }

    /**
     * 每两小时获取登陆应用的access_token并使用access_token获取jsapi_ticket
     */
    @Scheduled(cron = "0 0 0/2 * * ? ")
    //@Scheduled(cron = "0 0/1 * * * ? ")
    public void getAddressBookAccessToken(){
        //获取应用access_token
        //发送 http请求
        String url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid="+bimAppId+"&corpsecret="+bimCorpsecret;
        String result = HttpClientUtil.doGet(url);
        JSONObject jsonObject = JSON.parseObject(result);
        //解析
        String access_token = jsonObject.getString("access_token");
        //赋值
        AccessToken.bimAccessToken = access_token;
        log.info("请求登陆应用：{}", access_token);

        //使用access_token获取jsapi_ticket
        //发送 http请求
        String urlJSSDK = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token="+AccessToken.bimAccessToken;
        String resultJSSDK = HttpClientUtil.doGet(urlJSSDK);
        JSONObject jsonObjectJSSDK = JSON.parseObject(resultJSSDK);
        //解析
        String jsapiTicket = jsonObjectJSSDK.getString("ticket");
        //赋值
        AccessToken.jsapiTicket = jsapiTicket;
        log.info("请求jssdk：{}", jsapiTicket);
    }

    /**
     * 每两个小时获取通讯录的access_token
     */
    @Scheduled(cron = "0 0 0/2 * * ? ")
    //@Scheduled(cron = "0 0/1 * * * ? ")
    public void getBimAccessToken(){
        //发送 http请求
        String url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid="+bimAppId+"&corpsecret="+addressBookCorpsecret;
        String result = HttpClientUtil.doGet(url);
        JSONObject jsonObject = JSON.parseObject(result);
        //解析
        String access_token = jsonObject.getString("access_token");
        //赋值
        AccessToken.addressBookAccessToken = access_token;
        log.info("请求通讯录应用：{}", access_token);
    }


    /**
     * 项目启动时就立即执行
     * @param args
     * @throws Exception
     */
    @Override
    public void run(ApplicationArguments args) throws Exception {
        getAddressBookAccessToken();
        getBimAccessToken();
    }
}
