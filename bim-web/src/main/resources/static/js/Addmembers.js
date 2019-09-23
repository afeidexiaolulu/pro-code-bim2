$(function () {
    layui.use(['form', 'layer'], function () {
        eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('0 1=3.1;0 2=3.2;',4,4,'var|form|layer|layui'.split('|'),0,{}))

        form.verify({
            NameMember: function (value, item) {
                if (value.length <= 0) {
                    return '请搜索选择成员姓名';
                }
            }
        });

        $("input[name='SubordinateProjects']").val(parent.parent.$('.ENTRYNAME').html());

        // 搜索选择姓名下拉框
        var userName = "";
        $("input[name='NameMember']").bind('input', function () {
            userName = $(this).val();
            $.ajax({
                url: getRootPath() + "/bim/projectMember/queryUserByLike",
                type: "post",
                data: {
                    userName: userName
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (res) {
                    if (res.data != "" || res.data != null) {
                        str = ""
                        $("select[name='NameMember']").html("");
                        $.each(res.data, function (index, item) {
                            str += "<option value=" + item.id + " >" + item
                                .userName + "</option>";
                        });
                        $("select[name='NameMember']").append(str);
                        form.render('select');
                        $("select[name='NameMember']").nextAll("div.layui-unselect").addClass("layui-form-selected")

                        form.on("select", function (data) {
                            if ($(this).parents("div.layui-form-selected").prev("select").attr("name") == "NameMember") {
                                $("input[name='NameMember']").val(data.elem[data.elem.selectedIndex].text);
                                $("input[name='NameMember']").attr("id", data.value);
                                $("select[name='NameMember']").nextAll("div.layui-unselect").removeClass("layui-form-selected");
                                $.ajax({
                                    url: getRootPath() + "/bim/projectMember/queryUserByLike",
                                    type: "post",
                                    data: {
                                        userName: $("input[name='NameMember']").val()
                                    },
                                    beforeSend: function () {
                                        layer.load(2);
                                    },
                                    complete: function () {
                                        layer.closeAll('loading');
                                    },
                                    success: function (data) {
                                        for (let i = 0; i < data.data.length; i++) {
                                            if (data.data[i].userName == $("input[name='NameMember']").val()) {
                                                $("input[name='id']").val(data.data[i].id)
                                                $("input[name='phone']").val(data.data[i].phoneNumber)
                                                $("input[name='email']").val(data.data[i].email)
                                            }
                                        }
                                    },
                                    error: function () {
                                        layer.msg("请求失败，请稍后再试", {
                                            icon: 5,
                                            anim: 6
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        layer.msg('数据为空', {
                            icon: 5
                        });
                    }
                },
                error: function () {
                    layer.msg("请求失败，请稍后再试", {
                        icon: 5,
                        anim: 6
                    });
                }
            });
        });

        // 搜索选择手机号下拉框
        var phoneNumber = "";
        $("input[name='phone']").bind('input', function () {
            phoneNumber = $(this).val();
            $.ajax({
                url: getRootPath() + "/bim/projectMember/queryUserByLike",
                type: "post",
                data: {
                    phoneNumber: phoneNumber
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (res) {
                    if (res.data != "" || res.data != null) {
                        str = ""
                        $("select[name='phone']").html("");
                        $.each(res.data, function (index, item) {
                            str += "<option value=" + item.id + " >" + item
                                .phoneNumber + "</option>";
                        });
                        $("select[name='phone']").append(str);
                        form.render('select');
                        $("select[name='phone']").nextAll("div.layui-unselect").addClass("layui-form-selected")

                        form.on("select", function (data) {
                            if ($(this).parents("div.layui-form-selected").prev("select").attr("name") == "phone") {
                                $("input[name='phone']").val(data.elem[data.elem.selectedIndex].text); //html
                                $("input[name='phone']").attr("id", data.value);
                                $("select[name='phone']").nextAll("div.layui-unselect").removeClass("layui-form-selected");
                                // console.log(data);
                                // console.log(data.elem); //得到select原始DOM对象
                                // console.log(data.value); //得到被选中的值
                                // console.log(data.othis); //得到美化后的DOM对象
                                $.ajax({
                                    url: getRootPath() + "/bim/projectMember/queryUserByLike",
                                    type: "post",
                                    data: {
                                        phoneNumber: $("input[name='phone']").val()
                                    },
                                    beforeSend: function () {
                                        layer.load(2);
                                    },
                                    complete: function () {
                                        layer.closeAll('loading');
                                    },
                                    success: function (data) {
                                        for (let i = 0; i < data.data.length; i++) {
                                            if (data.data[i].phoneNumber == $("input[name='phone']").val()) {
                                                $("input[name='id']").val(data.data[i].id);
                                                $("input[name='NameMember']").val(data.data[i].userName);
                                                $("input[name='email']").val(data.data[i].email);
                                            }
                                        }
                                    },
                                    error: function () {
                                        layer.msg("请求失败，请稍后再试", {
                                            icon: 5,
                                            anim: 6
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        layer.msg('数据为空', {
                            icon: 5
                        });
                    }
                },
                error: function () {
                    layer.msg("请求失败，请稍后再试", {
                        icon: 5,
                        anim: 6
                    });
                }
            });
        });

        // 搜索选择邮箱下拉框
        var email = "";
        $("input[name='email']").bind('input', function () {
            email = $(this).val();
            $.ajax({
                url: getRootPath() + "/bim/projectMember/queryUserByLike",
                type: "post",
                data: {
                    email: email
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (res) {
                    if (res.data != "" || res.data != null) {
                        str = ""
                        $("select[name='email']").html("");
                        $.each(res.data, function (index, item) {
                            str += "<option value=" + item.id + " >" + item
                                .email + "</option>";
                        });
                        $("select[name='email']").append(str);
                        form.render('select');
                        $("select[name='email']").nextAll("div.layui-unselect").addClass("layui-form-selected")

                        form.on("select", function (data) {
                            if ($(this).parents("div.layui-form-selected").prev("select").attr("name") == "email") {
                                $("input[name='email']").val(data.elem[data.elem.selectedIndex].text); //html
                                $("input[name='email']").attr("id", data.value);
                                $("select[name='email']").nextAll("div.layui-unselect").removeClass("layui-form-selected");
                                // console.log(data);
                                // console.log(data.elem); //得到select原始DOM对象
                                // console.log(data.value); //得到被选中的值
                                // console.log(data.othis); //得到美化后的DOM对象
                                $.ajax({
                                    url: getRootPath() + "/bim/projectMember/queryUserByLike",
                                    type: "post",
                                    data: {
                                        email: $("input[name='email']").val()
                                    },
                                    beforeSend: function () {
                                        layer.load(2);
                                    },
                                    complete: function () {
                                        layer.closeAll('loading');
                                    },
                                    success: function (data) {
                                        for (let i = 0; i < data.data.length; i++) {
                                            if (data.data[i].email == $("input[name='email']").val()) {
                                                $("input[name='id']").val(data.data[i].id);
                                                $("input[name='NameMember']").val(data.data[i].userName);
                                                $("input[name='phone']").val(data.data[i].phoneNumber);
                                            }
                                        }
                                    },
                                    error: function () {
                                        layer.msg("请求失败，请稍后再试", {
                                            icon: 5,
                                            anim: 6
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        layer.msg('数据为空', {
                            icon: 5
                        });
                    }
                },
                error: function () {
                    layer.msg("请求失败，请稍后再试", {
                        icon: 5,
                        anim: 6
                    });
                }
            });
        });

        //监听提交
        form.on('submit(formDemo)', function (data) {
            if(data.field.NameMember == ""){
                layer.msg('请搜索选择成员姓名', {
                    icon: 5,
                    anim: 6
                });
                return false;
            }else if(data.field.entryName == ""){
                layer.msg('请选择成员角色', {
                    icon: 5,
                    anim: 6
                });
                return false;
            }else{
                $.ajax({
                    url: getRootPath() + "/bim/projectMember/addProjectMember",
                    type: "post",
                    data: {
                        userId: data.field.id,
                        roleId: data.field.entryName
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        if (data.success == true) {
                            layer.msg(data.message);
                            let index = parent.layer.getFrameIndex(window.name);
                            setTimeout(parent.layer.close(index), 4000);
                        } else {
                            layer.msg(data.message);
                        }
                    },
                    error: function () {
                        layer.msg("请求失败，请稍后再试", {
                            icon: 5,
                            anim: 6
                        });
                    }
                })
                return false;
            }
        });

        $("#close").click(function () {
            $maskof();
            let index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        })

        $('.icon-xinjian').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    });
})