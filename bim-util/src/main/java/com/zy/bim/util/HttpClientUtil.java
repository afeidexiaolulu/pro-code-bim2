package com.zy.bim.util;


import org.apache.http.NameValuePair;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Title: HTTP工具类
 * @ClassName:HttpClientUtil.java
 * @Description:
 * 字符编码<UTF-8>
 * public static final String CHARSET_UTF8 = "UTF-8";
 * @author: FLY
 * @date:2016年12月12日 下午3:55:15
 * @version V1.0
 */
public class HttpClientUtil {

    private static final Logger log = LoggerFactory.getLogger(HttpClientUtil.class);

    private static HttpClientContext context = HttpClientContext.create();

    /**
     *
     * @Title: get请求(带参)
     * @param url
     * @param param
     * @return String
     * @Description:
     *
     * @author: FLY
     * @date:2016年12月12日 下午3:55:42
     */
    public static String doGet(String url, Map<String, String> param) {

        // 创建Httpclient对象
        CloseableHttpClient httpclient = HttpClients.createDefault();

        String resultString = "";
        CloseableHttpResponse response = null;
        try {
            // 创建uri
            URIBuilder builder = new URIBuilder(url);
            if (param != null) {
                for (String key : param.keySet()) {
                    builder.addParameter(key, param.get(key));
                }
            }
            URI uri = builder.build();

            // 创建http GET请求
            HttpGet httpGet = new HttpGet(uri);

            // 执行请求
            try {
                response = httpclient.execute(httpGet);
                // 使用HttpClient认证机制
                // response = httpClient.execute(httpGet, context);
            } catch (Exception e) {
                log.warn("【GET请求失败】,请求地址：{}", url);
                e.printStackTrace();
            }
            // 判断返回状态是否为200
            if (response.getStatusLine().getStatusCode() == 200) {
                resultString = EntityUtils.toString(response.getEntity(), "utf-8");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (response != null) {
                    response.close();
                }
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return resultString;
    }

    /**
     *
     * @Title: get请求(无参)
     * @param url
     * @return String
     * @Description:
     *
     * @author: FLY
     * @date:2016年12月12日 下午3:56:26
     */
    public static String doGet(String url) {
        return doGet(url, null);
    }

    /**
     *
     * @Title: post请求(带参)
     * @param url
     * @param param
     * @return String
     * @Description:
     *
     * @author: FLY
     * @date:2016年12月12日 下午3:56:01
     */
    public static String doPost(String url, Map<String, String> param) {
        // 创建Httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        String resultString = "";
        try {
            // 创建Http Post请求
            HttpPost httpPost = new HttpPost(url);
            // 创建参数列表
            if (param != null) {
                List<NameValuePair> paramList = new ArrayList<>();
                for (String key : param.keySet()) {
                    paramList.add(new BasicNameValuePair(key, param.get(key)));
                }
                // 模拟表单
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(paramList, "utf-8");
                httpPost.setEntity(entity);
            }

            log.info("【POST请求信息】,请求地址:{},请求参数的MAP:{}", url, param);

            // 执行http请求
            try {
                response = httpClient.execute(httpPost);
                // 使用HttpClient认证机制
                // response = httpClient.execute(httpPost, context);
            } catch (Exception e) {
                log.warn("【POST请求失败】,请求地址:{},请求参数的MAP:{}", url, param);
                e.printStackTrace();
            }
            resultString = EntityUtils.toString(response.getEntity(), "utf-8");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if(response != null){
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return resultString;
    }

    /**
     *
     * @Title: post请求(无参)
     * @param url
     * @return String
     * @Description:
     *
     * @author: FLY
     * @date:2016年12月12日 下午3:56:17
     */
    public static String doPost(String url) {
        return doPost(url, null);
    }

    /**
     *
     * @Title:使用POST方法发送JSON数据
     * @param url
     * @param json
     * @return String
     * @Description:
     *
     * @author: FLY
     * @date:2016年12月12日 下午3:56:10
     */
    public static String doPostJson(String url, String json) {
        // 创建Httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        String resultString = "";
        try {
            // 创建Http Post请求
            HttpPost httpPost = new HttpPost(url);
            // 创建请求内容(指定请求形式是Json形式的字符串)
            // 在SpringMVC中接收请求的Json,需要使用@RequestBody;
            StringEntity entity = new StringEntity(json, ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);
            // 执行http请求
            try {
                response = httpClient.execute(httpPost);
                // 使用HttpClient认证机制
                // response = httpClient.execute(httpPost, context);
            } catch (Exception e) {
                log.warn("【POST请求(参数为Json)失败】,请求地址：{},参数：{}", url, json);
                e.printStackTrace();
            }
            resultString = EntityUtils.toString(response.getEntity(), "utf-8");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if(response != null) {
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return resultString;
    }

    /**
     *
     * @Title: 使用POST方法发送XML数据
     * @param url
     * @param xmlParam
     * @param xmlData
     * @return
     * @throws Exception
     *             String
     * @Description:
     *
     * @author: FLY
     * @date:2016年11月20日 下午9:54:54
     */
    public String sendXMLDataByPost(String url, String xmlParam, String xmlData) throws Exception {

        // 创建Httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        String resultString = "";

        HttpPost post = new HttpPost(url);
        List<BasicNameValuePair> parameters = new ArrayList<>();
        // 设置参数名的---注意传入的参数名,在获取的时候和他保持一致
        parameters.add(new BasicNameValuePair(xmlParam, xmlData));
        post.setEntity(new UrlEncodedFormEntity(parameters, "utf-8"));

        try {
            response = httpClient.execute(post);
        } catch (Exception e) {
            log.warn("【POST请求(参数为XML数据)失败】,请求地址：{},参数：{}", url, xmlData);
            e.printStackTrace();
        }


        resultString = EntityUtils.toString(response.getEntity(), "utf-8");
        return resultString;
    }


    /**
     *
     * @Title: 使用HttpClient认证机制
     * @param username
     * @param password void
     * @Description:
     *
     * @author: FLY
     * @date:2016年12月12日 下午5:02:09
     */
    public void addUserOAuth(String username, String password) {

        CredentialsProvider credsProvider = new BasicCredentialsProvider();
        org.apache.http.auth.Credentials credentials = new org.apache.http.auth.UsernamePasswordCredentials(username,
                password);
        credsProvider.setCredentials(org.apache.http.auth.AuthScope.ANY, credentials);
        context.setCredentialsProvider(credsProvider);
    }

}
