$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var element = layui.element;
        getPower();
        active = {
            sort: function () {
                clickType = "sort";
                $(".tab-container:nth-of-type(4) .staff_list_content").empty();
                if ($(this).attr("type") == "desc") {
                    $(this).attr("type", "asc");
                } else {
                    $(this).attr("type", "desc");
                }
                StaffDiv();
                stopEven();
            },
            addPerson: function () {
                $(".tab-container:nth-of-type(4) .s-pull").empty();
                addPerson();
            },
            cancel: function () {
                $(".tab-container:nth-of-type(4) .s-pull").empty();
                StaffDiv();
            },
            del: function () {
                let ids = $(this).parents(".staff_list").attr("id");
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: "是否删除此成员？",
                    btn: ['是', '否'],
                    yes: function (index) {
                        $.ajax({
                            url: getRootPath() + "/bim/projectMember/deleteProjectMember",
                            type: "post",
                            cache: false,
                            async: false,
                            data: {
                                ids: ids
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (data) {
                                if (data.success == true) {
                                    BIM.open({
                                        content: "\u5220\u9664\u6210\u529f",
                                        skin: 'msg',
                                        time: 2
                                    });
                                    $("#" + ids + "").remove();
                                } else if (data.success == false) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 2
                                    });
                                }
                                $(".layui-project-btn").slideUp();
                            },
                            error: function () {
                                BIM.open({
                                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                                    skin: 'msg',
                                    time: 2
                                });
                            }
                        })
                    },
                    no: function () {
                        $(".layui-project-btn").slideUp();
                    }
                })
                $("div.layui-m-BIMcont").css("padding", "0.26666666rem");
            },
            more: function () {
                $(this).parents('.staff_list').siblings(".staff_list").children(".staff_content").children(".layui-project-btn").slideUp("100");
                $(this).parents('.More').siblings(".layui-project-btn").slideToggle("100");
                stopEven();
            },
            person_list: function () {
                Person_detail();
                $(".Person_detailDiv").show();
                $(".Person_detail").attr("id", $(this).attr("id"));
                $(".StaffName").html($(this).children(".Person_right").children("p").children("span:eq(0)").html());
                $(".Cell_phoneNumber").html($(this).children(".Person_right").children("p").children("span:eq(1)").html());

                $(".Search").empty();
                $(".tab-container:nth-of-type(4) .s-pull div.staffPage:first-child").remove();

            },
            selectedPerson: function () {
                let RoleSelection =
                    '<div class="layui-form layui-form-pane">' +
                    '<p class="titlep">请选择用户角色</p>' +
                    '<div class="layui-input-block">' +
                    '<input type="radio" name="role" value="1" title="项目管理员">' +
                    '<div class="layui-clear"></div>' +
                    '<input type="radio" name="role" value="2" title="项目经理">' +
                    '<div class="layui-clear"></div>' +
                    '<input type="radio" name="role" value="3" title="项目成员" checked>' +
                    '<div class="layui-clear"></div>' +
                    '</div>' +
                    '</div>';
                BIM.open({
                    title: false,
                    anim: 'up',
                    btn: ['是', '否'],
                    content: RoleSelection,
                    yes: function () {
                        $.ajax({
                            url: getRootPath() + "/bim/projectMember/addProjectMember",
                            type: "post",
                            cache: false,
                            async: false,
                            data: {
                                userId: $(".Person_detail").attr("id"),
                                roleId: role_checked()
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (data) {
                                if (data.success == true) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 2
                                    });
                                    $(".Search").empty();
                                    $(".tab-container:nth-of-type(4) .s-pull").empty();
                                    StaffDiv();
                                } else if (data.success == false) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 2
                                    });
                                }
                            },
                            error: function () {
                                BIM.open({
                                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                                    skin: 'msg',
                                    time: 2
                                });
                            }
                        })
                    },
                    no: function () {
                        $(".Search").empty();
                        $(".tab-container:nth-of-type(4) .s-pull").empty();
                        StaffDiv();
                    }
                });

                form.render();
            },
            cancellation: function () {
                $(".Person_form_title").remove();
                addPerson();
            },
            staffDetail: function () {
                staffDetail();
                $(".Person_detailDiv").show();
                $(".Person_detail").attr("id", $(this).attr("id"));
                $(".Person_detail").attr("userId", $(this).attr("userId"));
                $(".StaffName").html($(this).children(".staff_content").children(".staff_explicit").children(".staff_name").html());
                $(".rolesName").html($(this).children(".staff_content").children(".staff_explicit").children(".staff_bot").children("span.staff_grade").html());
                $(".Cell_phoneNumber").html($(this).children(".staff_content").children(".staff_explicit").children(".staff_bot").children("span.staff_phone").html());

                $(".Search").empty();
                $(".tab-container:nth-of-type(4) .s-pull div.staffPage:first-child").remove();

            },
            updateRoles: function () {
                let RoleSelection =
                    '<div class="layui-form layui-form-pane">' +
                    '<p class="titlep">请选择用户角色</p>' +
                    '<div class="layui-input-block">' +
                    '<input type="radio" name="role" value="1" title="项目管理员">' +
                    '<div class="layui-clear"></div>' +
                    '<input type="radio" name="role" value="2" title="项目经理">' +
                    '<div class="layui-clear"></div>' +
                    '<input type="radio" name="role" value="3" title="项目成员">' +
                    '<div class="layui-clear"></div>' +
                    '</div>' +
                    '</div>';
                BIM.open({
                    title: false,
                    anim: 'up',
                    btn: ['是', '否'],
                    content: RoleSelection,
                    yes: function () {
                        $.ajax({
                            url: getRootPath() + "/bim/projectMember/updateProjectMember",
                            type: "post",
                            cache: false,
                            async: false,
                            data: {
                                userId: $(".Person_detail").attr("userId"),
                                oldRoleId: $(".rolesName").html(),
                                newRoleId: role_checkedTitle()
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (data) {
                                debugger
                                if (data.success == true) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 2
                                    });
                                    $(".Search").empty();
                                    $(".tab-container:nth-of-type(4) .s-pull").empty();
                                    StaffDiv();
                                } else if (data.success == false) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 2
                                    });
                                }
                            },
                            error: function () {
                                BIM.open({
                                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                                    skin: 'msg',
                                    time: 2
                                });
                            }
                        })
                    },
                    no: function () {
                        $(".Search").empty();
                        $(".tab-container:nth-of-type(4) .s-pull").empty();
                        StaffDiv();
                    }
                });

                switch ($(".rolesName").html()) {
                    case "项目管理员":
                        $("input[title='项目管理员']").attr("checked", "checked");
                        break;
                    case "项目经理":
                        $("input[title='项目经理']").attr("checked", "checked");
                    case "项目成员":
                        $("input[title='项目成员']").attr("checked", "checked");
                        break;
                }
                form.render();
            }
        }
    });

    document.addEventListener("touchmove", function (event) {
        $(".layui-project-btn").slideUp();
        event.stopPropagation();
    })

    function role_checked() {
        const array = $("input[name='role']");
        for (let i = 0; i < array.length; i++) {
            if (array[i].checked) {
                return parseInt(array[i].value);
            }
        }
    }

    function role_checkedTitle() {
        const array = $("input[name='role']");
        for (let i = 0; i < array.length; i++) {
            if (array[i].checked) {
                debugger
                if (parseInt(array[i].value) == "1") {
                    return "项目管理员"
                } else if (parseInt(array[i].value) == "2") {
                    return "项目经理"
                } else if (parseInt(array[i].value) == "3") {
                    return "项目成员"
                }
            }
        }
    }

    function getPower() {
        $.ajax({
            url: getRootPath() + "/bim/userGetPermission",
            type: "get",
            cache: false,
            async: false,
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    for (let i = 0; i < data.data.length; i++) {
                        if (data.data[i] == "User:add"){
                            $(".staffSearch .BIMxinzeng").css("display","inline-block");
                            $(".staffSearch input").css("width","80%");
                            return false;
                        }
                    }
                } else {
                    BIM.open({
                        content: '\u53d1\u751f\u9519\u8bef',
                        skin: 'msg',
                        time: 2
                    });
                }
            },
            error: function () {
                BIM.open({
                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                    skin: 'msg',
                    time: 2
                });
            }
        })
    }
})