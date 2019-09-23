$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var element = layui.element;

        active = {
            sort: function () {
                clickType = "sort";
                $(".tab-container:nth-of-type(2) .model_list_content").empty();
                if ($(this).attr("type") == "desc") {
                    $(this).attr("type", "asc");
                } else if ($(this).attr("type") == "asc") {
                    $(this).attr("type", "desc")
                }
                ModelDiv();
                stopEven();
            },
            share: function () {
                projectID = $(this).parents(".model_content").parent(".mode_list").attr("id");
                modelName = $(this).parents(".layui-project-btn").siblings(".model_explicit").children(".model_top").children(".model_name").html();
                const contents =
                    '<div class="layui-m-layerDiv ">' +
                    '<p>文件分享有效期</p>' +
                    '<div class="layui-form" style="padding:0 0.13333333rem;">' +
                    '<input type="radio" lay-filter="link_valid" name="link_valid" title="1天过期" value="1天过期">' +
                    '<input type="radio" lay-filter="link_valid" name="link_valid" title="3天过期" value="3天过期">' +
                    '<input type="radio" lay-filter="link_valid" name="link_valid" title="7天过期" value="7天过期">' +
                    '<input type="radio" lay-filter="link_valid" name="link_valid" title="永久有效" value="永久有效" checked="">' +
                    '</div><hr /><div class="OperationalSet">' +
                    '<div class="link_div" data-type="Copy_link">' +
                    '<div class="link_child"><span class="BIM-iconfont BIMlianjie"></span></div>' +
                    '<p>复制链接</p>' +
                    '</div>' +
                    '<div class="qr_div" data-type="produce_QR">' +
                    '<div class="qr_child"><span class="BIM-iconfont BIMerweima"></span></div>' +
                    '<p>生成二维码</p>' +
                    '</div>' +
                    '</div></div>';
                // 检查是否分享过
                $.ajax({
                    url: getRootPath() + "/bim/modelShare/checkModelShareRepetition",
                    type: "post",
                    cache: false,
                    async: false,
                    data: {
                        ids: projectID
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data_) {
                        if (data_.success == true) {
                            BIM.open({
                                title: false,
                                anim: 'up',
                                content: contents,
                                btn: ['取消'],
                                no: function (index) {
                                   
                                }
                            });
                            form.render();
                            $(".layui-m-layerDiv").parent("div.layui-m-BIMcont").css("padding", "0");
                        } else {
                            BIM.open({
                                content: data_.message,
                                skin: 'msg',
                                time: 2
                            });
                        }

                        $('.link_div,.qr_div').on('click', function () {
                            debugger
                            var type = $(this).data('type');
                            active[type] ? active[type].call(this) : '';
                        });
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

                $('.link_div,.qr_div').on('click', function () {
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
            },
            Copy_link: function (data) {
                let thisHtml = $(this);
                //复制链接-ajax
                $.ajax({
                    url: getRootPath() + "/bim/modelShare/insertModelShare",
                    type: "post",
                    cache: false,
                    async: false,
                    data: {
                        shareDay: link_valid_checked(), //天数
                        modelId: projectID, // ID
                        modelName: modelName, // NAME
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
                            let model_URL = getRootPath() + "/bim/modelShare/modelLightWeightShare?" + $.base64.encode("id=" + data_.data.id);
                            thisHtml.append('<p class="input_input">' + model_URL + '</p>');
                            Copy($('.input_input').html());
                            BIM.open({
                                content: '\u590d\u5236\u6210\u529f',
                                skin: 'msg',
                                time: 2
                            });

                        } else if (data_.success == false) {
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
            },
            produce_QR: function () {
                //生成二维码 --ajax
                $.ajax({
                    url: getRootPath() + "/bim/modelShare/insertModelShare",
                    type: "post",
                    cache: false,
                    async: false,
                    data: {
                        shareDay: link_valid_checked(), //天数
                        modelId: projectID, // ID
                        modelName: modelName, // NAME
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
                            let model_URL = getRootPath() + "/bim/modelShare/modelLightWeightShare?" + $.base64.encode("id=" + data_.data.id);
                            let qrcode = "<div id='qrcode'></div>"
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
                        } else if (data_.success == false) {
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
            },
            rename: function () {
                let modelId = $(this).parents(".mode_list").attr("id");
                let modelName = $(this).parents(".mode_list").children(".model_content").children(".model_explicit").children(".model_top").children(".model_name").html();
                const contents =
                    '<div class="layui-m-renameDiv"><p>重命名模型</p><p>原名称：<span class="oldName layui-elip">'+ modelName +'</span></p><p class = "layui-input-row" > 重命名：<input type="text" name="rename" ></p></div>'
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: contents,
                    btn: ['确认', '取消'],
                    yes: function () {
                        if ($("input[name='rename']").val() == "") {
                            BIM.open({
                                type: 4,
                                content: '请输入新名称',
                                skin: 'msg',
                                time: 1.5
                            });
                        } else {
                            $.ajax({
                                url: getRootPath() + "/bim/model/checkModelNameRepetition",
                                type: "post",
                                cache: false,
                                async: false,
                                data: {
                                    modelName: $("input[name='rename']").val()
                                },
                                beforeSend: function () {
                                    layer.load(2);
                                },
                                complete: function () {
                                    layer.closeAll('loading');
                                },
                                success: function (data) {
                                    if (data.success == true) {
                                        $.ajax({
                                            url: getRootPath() + "/bim/model/updateModelName",
                                            type: "post",
                                            cache: false,
                                            async: false,
                                            data: {
                                                modelId: modelId,
                                                newModelName: $("input[name='rename']").val()
                                            },
                                            beforeSend: function () {
                                                layer.load(2);
                                            },
                                            complete: function () {
                                                layer.closeAll('loading');
                                            },
                                            success: function (data) {
                                                if (data.success == true) {
                                                   
                                                } else if (data.success == false) {
                                                    BIM.open({
                                                        content: data.message,
                                                        skin: 'msg',
                                                        time: 3
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
                                    } else if (data.success == false) {
                                        BIM.open({
                                            content: data.message,
                                            skin: 'msg',
                                            time: 3
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
                        $(".layui-project-btn").slideUp();
                    },
                    no: function (index) {
                        $(".layui-project-btn").slideUp();
                    }
                });
                $(".layui-m-renameDiv").parent("div.layui-m-BIMcont").css("padding", "0.13333333rem 0.26666666rem");
            },
            del: function () {
                let projectID = $(this).parents(".model_content").parent(".mode_list").attr("id")
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: "是否删除此模型？",
                    btn: ['是', '否'],
                    yes: function () {
                        $.ajax({
                            url: getRootPath() + "/bim/model/deleteModelBatch",
                            type: "post",
                            cache: false,
                            async: false,
                            data: {
                                ids: projectID
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (data) {
                                if (data.success == true) {
                                    $("#" + projectID).remove();
                                } else if (data.success == false) {
                                    BIM.open({
                                        content: data.message,
                                        skin: 'msg',
                                        time: 3
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
                        $(".layui-project-btn").slideUp();
                    },
                    no: function (index) {
                        $(".layui-project-btn").slideUp();
                    }
                });
                $("div.layui-m-BIMcont").css("padding", "0.26666666rem");
            },
            more: function () {
                $(this).parents('.mode_list').siblings(".mode_list").children(".model_content").children(".layui-project-btn").slideUp("100");
                $(this).parents('.More').siblings(".layui-project-btn").slideToggle("100");
                stopEven();
            },
            ModelDetails:function(){
                let id = $(this).attr("id");
                layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 0,
                    area: ['100%', '100%'],
                    content: ['modelDetails?id=' + id , 'no'],
                });
            }
        }

        function link_valid_checked() {
            const array = $("input[name='link_valid']");
            for (let i = 0; i < array.length; i++) {
                if (array[i].checked) {
                    if (array[i].value == "永久有效") {
                        return parseInt("36500");
                    } else {
                        return parseInt(array[i].value);
                    }
                }
            }
        }

    });

    document.addEventListener("touchmove", function (event) {
        $(".layui-project-btn").slideUp();
        event.stopPropagation();
    })
})