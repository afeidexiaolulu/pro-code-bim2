package com.zy.bim;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;


//开启servlet组件扫描
@ServletComponentScan
//开启声明式事务
@EnableTransactionManagement
//打开定时任务
@EnableScheduling
//mapper包所在位置
@MapperScan("com.zy.bim.dao")
@SpringBootApplication
public class BimWebApplication  extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(BimWebApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BimWebApplication.class);
    }

}
