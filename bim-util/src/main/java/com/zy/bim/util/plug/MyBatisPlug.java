package com.zy.bim.util.plug;

import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 1:43
 */

@EnableTransactionManagement
@Configuration
public class MyBatisPlug {

    //分页插件
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }


}

