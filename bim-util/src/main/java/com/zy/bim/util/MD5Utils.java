package com.zy.bim.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/5 0005 下午 3:47
 */
public class MD5Utils {


    //md5加密 32位小
    public static String toMD5(String plainText) {
        byte[] secretBytes = null;
        try {
            secretBytes = MessageDigest.getInstance("md5").digest(
                    plainText.getBytes());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("没有md5这个算法！");
        }
        String md5code = new BigInteger(1, secretBytes).toString(16);// 16进制数字
        // 如果生成数字未满32位，需要前面补0
        for (int i = 0; i < 32 - md5code.length(); i++) {
            md5code = "0" + md5code;
        }
        return md5code;
    }

    //密码加密
    public static String digestPassWord(String str, String passWord){
        return toMD5(passWord.substring(0, 2) + str + passWord.substring(2));
    }

    public static void main(String[] args) {
        String s = digestPassWord("18332566942", "123");
        System.out.println(s);
    }
}