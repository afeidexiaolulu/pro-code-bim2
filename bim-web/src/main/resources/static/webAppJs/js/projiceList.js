$(function () {
    layui.use(['form'], function () {
        var form = layui.form;
        var pageIndex = 1;
        var s = 1;

        get_UnreadMessage();

        $(".form_title,nav").hide();
        if (navigator.onLine) {
            $(".form_title,nav").show();
            GetList();
        } else {
            BIM.open({
                content: '\u60a8\u7684\u8bbe\u5907\u65e0\u7f51\u7edc',
                skin: 'msg',
                time: 2
            });
        }

        active = {
            search: function () {
                pageIndex = 1;
                $("#layui-projectList").empty();
                GetList();
            },
            addProject: function () {
                $("body").css("overflow", "hidden")
                layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 0,
                    shade: [0],
                    area: ['100%', '100%'],
                    time: 0,
                    anim: 2,
                    content: ['addProject'],
                    end: function () {
                        $("body").removeAttr("style")
                    }
                })
            },
            sort: function () {
                pageIndex = 1;
                $(".layui-projectList").remove();
                if ($(this).attr("type") == "desc") {
                    $(this).attr("type", "asc");
                } else {
                    $(this).attr("type", "desc")
                }
                GetList();
                $('.BIMjiantouxia').on('click', function (event) {
                    event.stopPropagation();
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
            },
            more: function () {
                $(this).parents('.layui-projectList').siblings(".layui-projectList").children(".layui-roject-List").children(".layui-project-btn").slideUp("100");
                $(this).parents('.layui-projectDetail').siblings(".layui-project-btn").slideToggle("100");
                stopEven();
            }
        }


        function GetList() {
            $.ajax({
                url: getRootPath() + "/bim/project/findAllproject",
                type: "post",
                cache: false,
                async: false,
                data: {
                    pageSize: 10,
                    pageNum: pageIndex,
                    projectName: $("input[name='search']").val(),
                    rule: $(".BIMpaixu").attr("type")
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (data) {
                    if (data.success == true) {
                        var layui_projectList = ""
                        $.each(data.data.list, function (index, item) {
                            layui_projectList =
                                '<div class="layui-projectList">' +
                                '<div class="layui-roject-List" id=' + item.id + '>' +
                                '<div class="layui-projectImg">' +
                                '<img src="' + getRootPath() + item.img + '">' +
                                '</div>' +
                                '<div class="layui-projectDetail">' +
                                '<p class="layui_project_name"><span class="layui-elip project_NAME">' + item.projectName + '</span><span><a class="BIM-iconfont BIMjiantouxia layui-pull-right" data-type="more"></a></span></p>' +
                                '<p class="layui-elip layui_projext_owner">'+ item.createPersonName +'</p>' +
                                '<p class="layui-elip layui_projext_phone">'+ item.createPersonPhoneNumber +'</p>' +
                                '<p class="layui-elip layui_projext_datePlace"><span>' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.createTime) + '</span><span class="layui-elip">' + item.projectAddress + '</span></p>' +
                                '</div>' +
                                '<div class="layui-clear"></div>' +
                                '<div class="layui-project-btn">' +
                                '<ul class="layui-table-view">' +
                                '<li class="layui-table-view-cell rename" daty-type="rename">重命名</li>' +
                                '<hr />' +
                                '<li class="layui-table-view-cell del">删除</li>' +
                                '</ul>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            $("#layui-projectList").append(layui_projectList);
                        })

                        if (pageIndex != 1 && data.data.list == "") {
                            if (s == 1) {
                                s = 2;
                                BIM.open({
                                    content: '\u95ee\u541b\u80fd\u6709\u51e0\u591a\u6101\uff0c\u6570\u636e\u53ea\u6709\u8fd9\u4e48\u591a',
                                    skin: 'msg',
                                    time: 3
                                });
                            } else {
                                return true;
                            }
                        } else if (data.data.list == "" && $("input[name='search']").val() != "" && pageIndex != 1) {
                            // debugger
                            $("#layui-projectList").append("<div>暂无数据</div>")
                        }

                    } else if (data.success == false) {
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
            });

            document.addEventListener("touchmove", function (event) {
                $(".layui-project-btn").slideUp();
                event.stopPropagation();
            })

            $(".rename").click(function (event) {
                event.stopPropagation();
                let projectId = $(this).parents(".layui-roject-List").attr("id");
                let projectYuanName = $(this).parents(".layui-roject-List").children(".layui-projectDetail").children(".layui_project_name").children(".project_NAME").html();
                var contents =
                    '<div class="layui-m-layerDiv"><p><strong>项目重命名</strong></p><p>原名称：<span class="oldName layui-elip">'+ projectYuanName +'</span></p><p class = "layui-input-row" > 重命名：<input type="text" name="rename" ></p></div>'
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
                                url: getRootPath() + "/bim/project/update",
                                type: "post",
                                cache: false,
                                async: false,
                                data: {
                                    projectId: projectId,
                                    projectName: $("input[name='rename']").val()
                                },
                                beforeSend: function () {
                                    layer.load(2);
                                },
                                complete: function () {
                                    layer.closeAll('loading');
                                },
                                success: function (res) {
                                    if (res.success == true) {
                                        BIM.open({
                                            content: '修改成功',
                                            skin: 'msg',
                                            time: 3
                                        });
                                    } else if((res.success == false)){
                                        BIM.open({
                                            content: '\u53d1\u751f\u9519\u8bef',
                                            skin: 'msg',
                                            time: 3
                                        });
                                    }
                                    $("#layui-projectList").empty();
                                    GetList();
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
                        BIM.close(index);
                    }
                });
                $(".layui-m-layerDiv").parent("div.layui-m-BIMcont").css("padding", "15px 20px");
                event.stopPropagation();
            });


            $(".del").click(function (event) {
                let id = $(this).parents(".layui-roject-List").attr("id");
                let removeHtml = $(this).parents(".layui-roject-List").parent(".layui-projectList");
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: "是否删除本项目？",
                    btn: ['是', '否'],
                    yes: function () {
                        $.ajax({
                            url: getRootPath() + "/bim/project/delete",
                            type: "post",
                            cache: false,
                            async: false,
                            data: {
                                id: id
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (res) {
                                if (res.success == true) {
                                    BIM.open({
                                        content: res.message,
                                        skin: 'msg',
                                        time: 2
                                    });
                                    $(removeHtml).remove();
                                } else if (res.success == false) {
                                    BIM.open({
                                        content: res.message,
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

                        $(".layui-project-btn").slideUp();
                    },
                    no: function (index) {
                        $(".layui-project-btn").slideUp();
                        BIM.close(index);
                    }
                });

                $("div.layui-m-BIMcont").css("padding", "0.26666666rem");
                event.stopPropagation();
            })

            $(".layui-roject-List").click(function (event) {
                event.stopPropagation();
                let titleIcon = $(this).children(".layui-projectDetail").children(".layui_project_name").children(".project_NAME").html();
                if ($(this).attr("id") == "" || "undefined" == $(this).attr("id")) {
                    BIM.open({
                        title: false,
                        anim: 'up',
                        time: 2,
                        content: "ID丢失，请联系管理员"
                    });
                } else {
                    window.location.href = "projectDetails?id=" + $(this).attr("id") + "&title=" + encodeURI(titleIcon);
                }
            })

            $(document).keydown(function (event) {
                if (event.keyCode == 13) {
                    $('.search').click();
                }
            });
        }

        //滚动
        $(window).scroll(function () {
            var nowScrolledHeight = document.documentElement.scrollTop || document.body.scrollTop;
            var docHeight = document.body.clientHeight;
            var pageHeight = window.innerHeight;
            var go = parseInt(docHeight) - parseInt(pageHeight);
            if (nowScrolledHeight >= go) {
                pageIndex++;
                GetList();
            }
        });

        $('.form_title span.BIM-iconfont,.search,.BIMjiantouxia').on('click', function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    })
})