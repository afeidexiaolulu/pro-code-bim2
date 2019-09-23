$(function () {
    // browserRedirect();
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var $ = layui.$;
        form.verify({
            registerUserName: function (value) {
                if (value.length <= 0) {
                    return '请输入用户名';
                }
            },
            registerPassWord: function (value) {
                if (value.length <= 0) {
                    return '请输入密码';
                }
            },
            registerCaptcha: function (value) {
                if (value.length < 6 || value.length > 6) {
                    return '请输入验证码';
                }
            }
        });

        active = {
            /**
             * 登录
             */
            SignIn: function () {
                loginJS();
            },
            /**
             * 注册
             */
            register: function () {

                if ($("input[name='registerPhone']").val() == "") {
                    layer.msg("请输入手机号", {
                        icon: 5,
                        anim: 6
                    });
                } else {
                    $.ajax({
                        url: getRootPath() + "/bim/registerUser",
                        type: "post",
                        data: {
                            authCode: $("input[name='registerCaptcha']").val(),
                            userName: $("input[name='registerUserName']").val(),
                            passWord: $("input[name='registerPassWord']").val(),
                            phoneNumber: $("input[name='registerPhone']").val(),
                            email: "" //2019/07/30初定无需email
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (data) {
                            if (data.success == true) {
                                if( data.message == "\u7528\u6237\u6ce8\u518c\u6210\u529f"){
                                    layer.msg("恭喜您注册成功", {
                                        icon: 6,
                                        time:800
                                    });
                                    $(".loginSix").show();
                                    $(".registerSix").hide();
                                }
                            } else if (data.success == false) {
                                // layer.msg(data.message, {
                                //     icon: 5
                                // });
                            }
                        },
                        error: function () {
                            layer.msg("请求失败，请稍后再试", {
                                icon: 5,
                                anim: 6
                            });
                        }
                    })
                }
            },
            /**
             * 登录 ---> 注册
             */
            login_register: function () {
                if ($(".registerSix").css("display") == "none") {
                    $(".loginSix").hide();
                    $(".registerSix").show();
                    $("input[name='registerUserName']").val("");
                    $("input[name='registerPassWord']").val("");
                    $("input[name='registerPhone']").val("");
                    $("input[name='registerCaptcha']").val("");
                }
            },
            /**
             * 注册 ---> 登录
             */
            register_SignIn: function () {
                if ($(".loginSix").css("display") == "none") {
                    $(".loginSix").show();
                    $(".registerSix").hide();
                }
            },
            /**
            * 密码明文显示
            */
            Plaintext: function () {
                if($(this).attr("class") == "iconfont icon-yanjing-bi"){
                    $(this).prev("input").attr("type","text")
                    $(this).removeClass("icon-yanjing-bi").addClass("icon-ai-eye");
                }else{
                    $(this).prev("input").attr("type","password")
                    $(this).removeClass("icon-ai-eye").addClass("icon-yanjing-bi");
                }
            }
        }

        /**
         * 手机号唯一性验证
         */
        $("input[name='registerPhone']").change(function () {
            if ($("input[name='registerPhone']").val().length == "11") {
                let myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
                if (!myreg.test($("input[name='registerPhone']").val())) {
                    layer.msg("请输入有效的手机号码", {
                        icon: 5,
                        time:800
                    }, function () {
                        $("input[name='registerPhone']").val("");
                    });
                    return false;
                } else {
                    $.ajax({
                        url: getRootPath() + "/bim/getUserByPhone",
                        type: "post",
                        data: {
                            phoneNumber: $("input[name='registerPhone']").val()
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (data) {
                            if (data.success == true) {
                                layer.msg(data.message, {
                                    icon: 6,
                                    time:800
                                }, function () {
                                    $("#Send_Code").removeClass("layui-btn-disabled");
                                    $("#Send_Code").removeAttr("disabled");
                                });
                            } else {
                                layer.msg(data.message, {
                                    icon: 5,
                                    time:800
                                }, function () {
                                    $("input[name='registerPhone']").val("")
                                });
                            }
                        },
                        error: function () {
                            layer.msg("请求失败，请稍后再试", {
                                icon: 5,
                                anim: 6
                            });
                        }
                    })
                }
            } else {
                layer.msg("请输入十一位手机号", {
                    icon: 5,
                    time:800
                }, function () {
                    $("input[name='registerPhone']").val("");
                });
            }
        })

        /**
         * 验证码
         */
        $("#Send_Code").click(function () {
            if ($("input[name='registerPhone']").val() != "") {
                $.ajax({
                    url: getRootPath() + "/bim/sendMessage",
                    type: "post",
                    data: {
                        phoneNumber: $("input[name='registerPhone']").val()
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        if (data.success == true) {
                            layer.msg(data.message, {
                                icon: 6,
                                time:800
                            }, function () {
                                $(".operationBtn input").removeClass("layui-btn-disabled");
                                $(".operationBtn input").removeAttr("disabled");
                                time();
                            });
                        } else if (data.success == false) {
                            layer.msg(data.message, {
                                icon: 5,
                                time:800
                            }, function () {
                                $("input[name='registerPhone']").val("")
                            });
                        }
                    },
                    error: function () {
                        layer.msg("请求失败，请稍后再试", {
                            icon: 5,
                            anim: 6
                        });
                    }
                })
            }
        })

        /**
         * 有效时间验证
         */
        var wait = 180;
        function time() {
            if (wait == 0) {
                $("#Send_Code").attr("disabled");
                $("#Send_Code").val("发送验证码");
                wait = 180;
            } else {
                $("#Send_Code").attr("disabled", true);
                $("#Send_Code").val("重新发送(" + wait + ")");
                wait--;
                setTimeout(function () {
                    time();
                }, 1000);
            };
        }

        function loginJS(){
            $.ajax({
                url: getRootPath() + "/bim/doLogin",
                type: "post",
                data: {
                    accountNumber: $("input[name='userName']").val(),
                    passWord: $("input[name='passWord']").val()
                },
                success: function (data) {
                    if (data.success == true) {
                        sessionStorage.Jurisdiction = hex_md5(data.message);
                        sessionStorage.userName = (data.data.userName);
                        window.location = '/bim/index'
                    } else {
                        layer.msg(data.message, {
                            icon: 5
                        });
                    }
                },
                error: function (data) {
                    layer.msg("请求失败，请稍后再试", {
                        icon: 5,
                        anim: 6
                    });
                }
            })
        }

        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                loginJS();
            }
        });

        /**
         * 点击事件
         */
        $('input.layui-btn , .operationBtn span,.icon-yanjing-bi,.icon-ai-eye').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    });
})