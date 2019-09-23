$(function () {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var $ = layui.$

        $(".layui-fluid").show();
        /**
         * 获取权限
         */
        $.ajax({
            url: getRootPath() + "/bim/getRoleAndPermission",
            type: "get",
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    $.each(data.data, function (key, val) {
                        if (val.roleId == "2") {
                            // 项目经理
                            if (key == 0) {
                                let $RoleValues = ""
                                let tableId = $(".tableTbody .layui-table tbody");
                                // 获取此角色的权限代表值
                                for (let i = 0; i < val.permissionIdList.length; i++) {
                                    $RoleValues = val.permissionIdList[i];
                                    //获取table中的每一行
                                    for (let a = 1; a <= tableId.find("tr").length; a++) {
                                        // 两值相同，开始处理
                                        if ($RoleValues == a + 7) {
                                            tableId.children("tr:nth-child(" + a + ")").find("td:last-child").children("input").prop("checked", true);
                                        }
                                    }
                                }
                            }
                        };
                        if (val.roleId == "3") {
                            // 普通成员
                            if (key == 1) {
                                let $RoleValues = ""
                                let tableId = $(".tableTbody .layui-table tbody");
                                // 获取此角色的权限代表值
                                for (let i = 0; i < val.permissionIdList.length; i++) {
                                    $RoleValues = val.permissionIdList[i];
                                    //获取table中的每一行
                                    for (let a = 1; a <= tableId.find("tr").length; a++) {
                                        // 两值相同，开始处理
                                        if ($RoleValues == a + 7) {
                                            tableId.children("tr:nth-child(" + a + ")").find("td:nth-child(2)").children("input").prop("checked", true);
                                        }
                                    }
                                }
                            }
                        }
                        form.render();
                    })
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
        /**
         * 修改权限
         */
        active = {
            change_Permission: function () {
                // 普通权限
                let OrdinaryArr = []; //[true, false, true]
                let OrdinarySecondary = []; // [1,3]
                let Ordinaryidss = [];
                for (let i = 1; i <= $(".tableTbody .layui-table tbody tr").length; i++) {
                    var haha = $(".tableTbody .layui-table tbody tr:nth-child(" + i + ")").children("td:nth-child(2)").children("input[type='checkbox']").prop('checked')
                    OrdinaryArr.push(haha)
                }
                for (key in OrdinaryArr) {
                    if (OrdinaryArr[key] == true) {
                        OrdinarySecondary.push(Number(key) + 8)
                    }
                }
                for (key in OrdinarySecondary) {
                    Ordinaryidss.push("&mpids=" + OrdinarySecondary[key])  //mpids
                }
                // 经理权限
                let ManagerArr = []; //[true, false, true]
                let ManagerSecondary = []; // [1,3]
                let Manageridss = [];
                for (let i = 1; i <= $(".tableTbody .layui-table tbody tr").length; i++) {
                    var haha = $(".tableTbody .layui-table tbody tr:nth-child(" + i + ")").children("td:nth-child(3)").children("input[type='checkbox']").prop('checked')
                    ManagerArr.push(haha)
                }
                for (key in ManagerArr) {
                    if (ManagerArr[key] == true) {
                        ManagerSecondary.push(Number(key) + 8)
                    }
                }
                for (key in ManagerSecondary) {
                    Manageridss.push("&ppids=" + ManagerSecondary[key])
                }
                layer.msg('是否更改权限？', {
                    time: 0,
                    btn: ['是', '否'],
                    yes: function (index) {
                        $.ajax({
                            url: getRootPath() + "/bim/updateRoleAndPermission?pid=2&mid=3" + Ordinaryidss.join("") + Manageridss.join(""),
                            type: "post",
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (data) {
                                if (data.success == true) {
                                    layer.msg("更改成功", {
                                        icon: 6
                                    });
                                    layer.close(index);
                                }else{
                                    layer.msg(data.message, {
                                        icon: 5
                                    });
                                    layer.close(index);
                                }
                            },
                            error: function () {
                                layer.msg("请求失败，请稍后再试", {
                                    icon: 5,
                                    anim: 6
                                });
                                layer.close(index);
                            }
                        })
                    }
                });
            }
        };

        $('.layui-form .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    });
})