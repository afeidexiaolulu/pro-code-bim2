$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var element = layui.element;
        OpenHtml = "modelShare";

        active = {
            sort: function () {
                clickType = "sort";
                $(".tab-container:nth-of-type(5) .share_list_content").empty();
                if ($(this).attr("type") == "desc") {
                    $(this).attr("type", "asc");
                } else {
                    $(this).attr("type", "desc")
                }
                ShareDiv();
                stopEven();
            },
            personal_sort: function () {
                $(".share_list_content").empty();
                if ($(this).attr("type") == "desc") {
                    $(this).attr("type", "asc");
                } else {
                    $(this).attr("type", "desc")
                }
                personal_ShareDiv();
                stopEven();
            },
            copy_link: function (data) {
                $("body").append("<div class='input_input'><div>")
                var i = $.base64.encode("id=" + $(this).parents(".mode_list").attr("id"));
                $(".input_input").html("");
                $(".input_input").html(getRootPath() + "/bim/modelShare/modelLightWeightShare?" + i)
                Copy($('.input_input').html());
                BIM.open({
                    content: '\u590d\u5236\u6210\u529f',
                    skin: 'msg',
                    time: 2
                });
                $(".layui-project-btn").slideUp();
            },
            produce_QR: function () {
                let model_URL = getRootPath() + "/bim/modelShare/modelLightWeightShare?" + $.base64.encode("id=" + $(this).parents(".mode_list").attr("id"));
                let qrcode ="<div class=''><p id='qrcode'></p></div>"
                BIM.open({
                    content: qrcode,
                    btn: '关闭'
                });
                $('#qrcode').erweima({
                    render: "image",
                    minVersion: 10, //二维码密度，推荐0-10
                    fill: '#000', //二维码颜色
                    background: '#fff', // 二维码背景颜色
                    text: model_URL, // 最后扫出来的结果
                    size: 200, //二维码大小
                    radius: 1, //点圆滑度,50以内
                    quiet: "0", //二维码边框
                    mode: 2, //不显示LOGO：0 / 文字且占整行：1 / 文字居中：2 / 图片且占整行：3 / 图片居中：4
                    mSize: 8, //logo大小
                    mPosX: 50, //logo水平坐标,50居中
                    mPosY: 50, //logo垂直坐标,50居中
                    label: 'MCC-BIM', //logo文字
                    fontname: '宋体', //logo字体名
                    fontcolor: '#007aff', //logo字体颜色
                });

                $(".layui-project-btn").slideUp();
            },
            colse_link: function () {
                let ids = $(this).parents(".mode_list").attr("id");
                $.ajax({
                    url: getRootPath() + "/bim/modelShare/modelShareStatuChange",
                    type: "post",
                    cache: false,
                    async: false,
                    data: {
                        modelShareId: ids
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (obj) {
                        if (obj.success == true) {
                            if (obj.message == "链接更新成功") {
                                BIM.open({
                                    content: obj.message,
                                    skin: 'msg',
                                    time: 3
                                });
                            } else if (obj.message == "链接已到期,无法开启") {
                                BIM.open({
                                    title: false,
                                    anim: 'up',
                                    content: obj.message + '，是否修改有效期？',
                                    btn: ['是', '否'],
                                    yes: function () {
                                        let RoleSelection =
                                            '<div class="layui-form layui-form-paned">' +
                                            '<p class="titlep">请选择有效日期</p>' +
                                            '<div class="layui-input-block">' +
                                            '<input type="radio" name="termValidity" value="3" title="3天有效">' +
                                            '<div class="layui-clear"></div>' +
                                            '<input type="radio" name="termValidity" value="5" title="5天有效">' +
                                            '<div class="layui-clear"></div>' +
                                            '<input type="radio" name="termValidity" value="7" title="7天有效">' +
                                            '<div class="layui-clear"></div>' +
                                            '<input type="radio" name="termValidity" value="36500" title="永久有效" checked>' +
                                            '<div class="layui-clear"></div>' +
                                            '</div>' +
                                            '</div>';
                                        BIM.open({
                                            title: false,
                                            anim: 'up',
                                            content: RoleSelection,
                                            btn: ['是', '否'],
                                            yes: function () {
                                                $.ajax({
                                                    url: getRootPath() + "/bim/modelShare/modelEndShareTimeChange",
                                                    type: "post",
                                                    cache: false,
                                                    async: false,
                                                    data: {
                                                        modelShareId: ids, // 分享列表的id
                                                        shareDay: termValidity_checked()
                                                    },
                                                    beforeSend: function () {
                                                        layer.load(2);
                                                    },
                                                    complete: function () {
                                                        layer.closeAll('loading');
                                                    },
                                                    success: function (data_) {
                                                        debugger
                                                        if (data_.success == true) {
                                                            if ("您不为此链接创建人,无法修改" == data_.message) {
                                                                BIM.open({
                                                                    content: data_.message,
                                                                    skin: 'msg',
                                                                    time: 3
                                                                });
                                                            } else {
                                                                BIM.open({
                                                                    content: data_.message,
                                                                    skin: 'msg',
                                                                    time: 3
                                                                });
                                                            }
                                                        } else {
                                                            BIM.open({
                                                                content: data_.message,
                                                                skin: 'msg',
                                                                time: 3
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
                                        });
                                        form.render();
                                    },
                                    no: function () {
                                        $(".layui-project-btn").slideUp();
                                    }
                                });
                                $("div.layui-m-BIMcont").css("padding", "0.26666666rem");
                            }
                        } else if (obj.success == false) {
                            BIM.open({
                                content: obj.message,
                                skin: 'msg',
                                time: 3
                            });
                        }
                        if (OpenHtml == "modelShare"){
                            $(".tab-container:nth-of-type(5) .s-pull ").empty();
                            ShareDiv();
                        } else{
                            $(".share_list_content").empty();
                            personal_ShareDiv();
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
            del_link: function () {
                let ids = $(this).parents(".mode_list").attr("id");
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: "是否删除此链接？",
                    btn: ['是', '否'],
                    yes: function () {
                        $.ajax({
                            url: getRootPath() + "/bim/modelShare/deleteModelShareBatch",
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
                                        content: data.message,
                                        skin: 'msg',
                                        time: 3
                                    });
                                    $("#" + ids).remove();
                                } else if (data.success == false) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 3
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
                    no: function (index) {
                        $(".layui-project-btn").slideUp();
                    }
                });
                $("div.layui-m-BIMcont").css("padding", "0.26666666rem");
            },
            more: function () {
                $(this).parents('.mode_list').siblings(".mode_list").children(".share_content").children(".layui-project-btn").slideUp("100");
                $(this).parents('.More').siblings(".layui-project-btn").slideToggle("100");
                stopEven();
            }
        }

    });

    function termValidity_checked() {
        const array = $("input[name='termValidity']");
        for (let i = 0; i < array.length; i++) {
            if (array[i].checked) {
                return parseInt(array[i].value);
            }
        }
    }


    document.addEventListener("touchmove", function (event) {
        $(".layui-project-btn").slideUp();
        event.stopPropagation();
    })
})