package com.zy.bim.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/19 0019 下午 6:24
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVO {

    private Integer id;

    private Integer userId;

    private String userName;

    private String roleName;

    private String projectName;

    private String phoneNumber;

    private String email;
}
