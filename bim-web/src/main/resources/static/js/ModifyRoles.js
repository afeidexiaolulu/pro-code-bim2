$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var $ = layui.$;

        var dataList = parent.layer.methodConfig;
        $("input[name='NameMember']").val(dataList.userName);
        $("input[name='SubordinateProjects']").val(dataList.projectName);
        $("input[name='phone']").val(dataList.phoneNumber);
        $("input[name='email']").val(dataList.email);
        $("input[name='id']").val(dataList.id);

        active = {
            Affirmatory: function () {
                if ($("select[name='entryName']").val() == "") {
                    layer.msg('请选择要修改的角色', {
                        icon: 5,
                        anim: 6
                    });
                } else {
                    $.ajax({
                        url: getRootPath() + "/bim/projectMember/updateProjectMember",
                        type: "post",
                        data: {
                            userId: dataList.userId,
                            oldRoleId: dataList.roleName,
                            newRoleId: $("select[name='entryName'] option:selected").text()
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (data) {
                            if (data.success == true) {
                                layer.msg(data.message, {anim: -1},function () {
                                    $maskof();
                                    let index = parent.layer.getFrameIndex(window.name);
                                    parent.layer.close(index);
                                });
                            } else {
                                layer.msg(data.message, {anim: -1},function () {
                                    $maskof();
                                    let index = parent.layer.getFrameIndex(window.name);
                                    parent.layer.close(index);
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
            },
            /**
             * 取消
             */
            close: function () {
                $maskof();
                let index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            }
        }

        /**
         * 全局操作
         */
        $('.layui-form-item button').click(function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        })
    })
})