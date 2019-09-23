package com.zy.bim.util;

import java.util.Random;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/18 0018 下午 5:49
 */
public class AuthCode {

    public static String randomCode() {
        StringBuilder str = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            str.append(random.nextInt(10));
        }
        return str.toString();
    }
}
