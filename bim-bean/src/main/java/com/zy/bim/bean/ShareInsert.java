package com.zy.bim.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author 陈坤鹏
 * @data 2019-08-01 17:24
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareInsert {

    private Integer modelId;

    private Integer shareDay;

    private  String modelName;
}
