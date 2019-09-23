package com.zy.bimweb;

import com.zy.bim.BimWebApplication;
import com.zy.bim.util.MD5Utils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collections;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BimWebApplicationTests {

    @Test
    public void contextLoads() {

    }


    @Test
    public void test(){
        String s = MD5Utils.toMD5("111");
        System.out.println(s);
    }
}
