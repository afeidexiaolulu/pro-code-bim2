package com.zy.bim.util;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author 陈坤鹏
 * @data 2019-08-08 13:49
 **/
@Configuration
public class RabbitConfig {

    @Bean
    public Queue Queue() {
        return new Queue("BIMConverter_Mission",false);
    }

}
