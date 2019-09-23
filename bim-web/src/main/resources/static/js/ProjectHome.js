$(function () {
    layui.use(['layer', 'flow'], function () {
        var layer = layui.layer;
        var flow = layui.flow;
        var $ = layui.$;


        /**
         * 操作
         */
        active = {
            /**
             * 搜索项目
             */
            reload: function () {
                $.ajax({
                    url: getRootPath() + "/bim/project/findAllproject",
                    type: "post",
                    data: {
                        pageNum: pageIndex,
                        projectName: $("input[name='projectName']").val()
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        /**
                         * 添加操作内容
                         */
                        var add = "<div class='layui-col-md3 layui-col-lg3 add'><div class='cmdlist-container'><span class='iconfont icon-xinjian' id='NewAdd'></span></div></div>"
                        /**
                         * 显示主体
                         */
                        $(".layui-fluid").show();
                        /**
                         * 获取数据长度
                         */
                        var datalength = data.data.list.length;
                        if (data.data.list != "" && data.data.list != null) {
                            var str = ""
                            $.each(data.data.list, function (key, val) {
                                str += "<div class='layui-col-md3 layui-col-lg3'>" +
                                    "<div class='cmdlist-container' id=" + val.id + ">" +
                                    "<a href='javascript:;'>" +
                                    "<div class='imgDiv'>" +
                                    "<img src=" + getRootPath() + val.img + ">" +
                                    "</div>" +
                                    "<div class='cmdlist-text'>" +
                                    "<div class='price'>" + "" +
                                    "<p class='layui-elip'><b>项目名称:</b><span>" + val.projectName + "</span></p>" +
                                    "</div>" +
                                    "<div class='price'>" + "" +
                                    "<p class='layui-elip'><b>项目地址:</b>" + val.projectAddress + "</p>" +
                                    "</div>" +
                                    "<div class='price'>" + "" +
                                    "<p class='layui-elip'><b>项目简介:</b>" + val.projectDescription + "</p>" +
                                    "</div>" +
                                    "</div>" +
                                    "</a>" +
                                    "<div class='maskDiv'>" +
                                    "<div class='mask'></div>" +
                                    "<button type='button' class='layui-btn'>查看详情</button>" +
                                    "<span class='iconfont icon-shanchu remove_this'></span>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>";
                            })
                            // 判断是否第一次加载
                            if (pageIndex == "1") {
                                $(".layui-row div").remove()
                                $(".layui-row").append(add + str);
                            } else {
                                $(".layui-row").append(str);
                            }
                            /**
                             * 创建项目
                             */
                            NewAdd();
                            /**
                             * hover事件
                             */
                            hoverDiv();
                            /**
                             * 详情事件
                             */
                            maskDivClick();
                            /**
                             * 删除项目
                             */
                            delProject();
                            $(".layui-col-md3:first-child()").innerHeight($(".layui-col-md3:last-child()").innerHeight());
                            $(".add span.icon-xinjian").css("lineHeight", $(".layui-col-md3:first-child()").innerHeight() + "px");
                            /**
                             * 判断项目是否到底
                             */
                            if (data.data.pages <= pageIndex) {
                                return true
                            }
                        }
                    },
                    error: function () {
                        layer.msg("获取列表失败!,请刷新页面", {
                            icon: 5
                        });
                    }
                })
            },
            /**
             * 排序
             */
            sort: function () {
                if($(".layui-row div.layui-col-md3").length == 1){
                    layer.msg('暂无项目', {
                        icon: 5,
                        anim: 6
                    });
                }else{
                    let rule = $(this).attr("name");
                    if (rule == "desc") {
                        $("div.sortDiv span.icon-paixujiantouxia").css("color", "#333333")
                        $("div.sortDiv span.icon-paixujiantoushang").css("color", "#eceeef")
                        $("input.rule").val(rule);
                        GetList($("input[name='projectName']").val(), $("input.rule").val())
                    } else if (rule == "asc") {
                        $("div.sortDiv span.icon-paixujiantoushang").css("color", "#333333")
                        $("div.sortDiv span.icon-paixujiantouxia").css("color", "#eceeef")
                        $("input.rule").val(rule);
                        GetList($("input[name='projectName']").val(), $("input.rule").val())
                    }
                }
            }
        };

        /**
         * 进入页面执行一次
         */
        GetList($("input[name='projectName']").val(), $("input.rule").val());

        /**
         * 滚动渲染列表
         */
        var pageIndex = 1;
        $(window).scroll(function () {
            var nowScrolledHeight = document.documentElement.scrollTop || document.body.scrollTop;
            var docHeight = document.body.clientHeight;
            var pageHeight = window.innerHeight;
            var go = parseInt(docHeight) - parseInt(pageHeight);
            if (nowScrolledHeight >= go) {
                pageIndex++;
                GetList($("input[name='projectName']").val(), $("input.rule").val());
            }
        });

        /**
         * 渲染列表方法
         */
        function GetList(projectName, rule) {
            $.ajax({
                url: getRootPath() + "/bim/project/findAllproject",
                type: "post",
                data: {
                    pageNum: pageIndex,
                    projectName: projectName,
                    rule: rule
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (data) {
                    /**
                     * 添加操作内容
                     */
                    var add = "<div class='layui-col-md3 layui-col-lg3 add'><div class='cmdlist-container'><span class='iconfont icon-xinjian' id='NewAdd'></span></div></div>"
                    /**
                     * 显示主体
                     */
                    $(".layui-fluid").show();
                    /**
                     * 显示页面
                     */
                    if (data.data.list != "") {
                        $(".cmdlist-container").show()
                        var str = ""
                        $.each(data.data.list, function (key, val) {
                            str += "<div class='layui-col-md3 layui-col-lg3'>" +
                                "<div class='cmdlist-container' id=" + val.id + ">" +
                                "<a href='javascript:;'>" +
                                "<div class='imgDiv'>" +
                                "<img src=" + getRootPath() + val.img + ">" +
                                "</div>" +
                                "<div class='cmdlist-text'>" +
                                "<div class='price'>" + "" +
                                "<p class='layui-elip'><b>项目名称:</b><span>" + val.projectName + "</span></p>" +
                                "</div>" +
                                "<div class='price'>" + "" +
                                "<p class='layui-elip'><b>项目地址:</b>" + val.projectAddress + "</p>" +
                                "</div>" +
                                "<div class='price'>" + "" +
                                "<p class='layui-elip'><b>项目简介:</b>" + val.projectDescription + "</p>" +
                                "</div>" +
                                "</div>" +
                                "</a>" +
                                "<div class='maskDiv'>" +
                                "<div class='mask'></div>" +
                                "<button type='button' class='layui-btn'>查看详情</button>" +
                                "<span class='iconfont icon-shanchu remove_this'></span>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        });
                        // 判断是否第一次加载
                        if (pageIndex == "1") {
                            $(".add").show();
                            $(".layui-row").empty();
                            $(".layui-row").append(add + str);
                        } else {
                            $(".layui-row").append(str);
                        }
                        NewAdd();
                        hoverDiv();
                        maskDivClick();
                        delProject();
                        $(".layui-col-md3:first-child()").innerHeight($(".layui-col-md3:last-child()").innerHeight());
                        $(".add span.icon-xinjian").css("lineHeight", $(".layui-col-md3:first-child()").innerHeight() + "px");
                        /**
                         * 判断项目是否到底
                         */
                        if (data.data.pages <= pageIndex) {
                            return false
                        }
                    }else if(data.data.list == ""){
                        $(".add").show();
                        if(0 == data.data.pages){
                            if (sessionStorage.getItem("isExisting") == null ) {
                                sessionStorage.isExisting = "true";
                                layer.msg("暂无项目,请添加一个项目吧", {
                                    icon: 5,
                                    time:800
                                });
                            }
                            NewAdd();
                            return false;
                        }else if(pageIndex > data.data.pages){
                            if (sessionStorage.getItem("isExisting") == null ) {
                                sessionStorage.isExisting = "true";
                                layer.msg("问君能有几多愁，项目只有这么多", {
                                    icon: 6
                                });
                                return false;
                            }
                            return false;
                        }
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


        /**
         * hover事件
         */
        function hoverDiv() {
            $(".cmdlist-container").mouseover(function () {
                $(this).children(".maskDiv").css("display", "block");
            }).mouseout(function () {
                $(this).children(".maskDiv").css("display", "none");
            })
        }

        /**
         * 删除项目
         */
        function delProject() {
            $(".remove_this").click(function () {
                let id = $(this).parent("div.maskDiv").parent("div.cmdlist-container").attr("id")
                layer.msg('确定要删除项目？', {
                    time: 0,
                    btn: ['是', '否'],
                    yes: function (index) {
                        layer.close(index);
                        $.ajax({
                            url: getRootPath() + "/bim/project/delete",
                            type: "post",
                            data: {
                                id: id
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
                                        anim: -1
                                    },function(){
                                        location.reload();
                                    })
                                } else if (data.success == false) {
                                    layer.msg(data.message, {
                                        icon: 5
                                    })
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
                });
            })
        }

        /**
         * 点击详情事件
         */
        function maskDivClick() {
            $(".maskDiv button").click(function () {
                let ENTRYNAME = $(this).parent("div.maskDiv").prev("a").children("div.cmdlist-text").children("div.price:eq(0)").children(".layui-elip").children("span").html();
                let A_parameter = $(this).parent("div.maskDiv").parent("div.cmdlist-container").attr("id");
                parent.$('.ENTRYNAME').html(ENTRYNAME);
                parent.$('.ENTRYNAME').attr("id", A_parameter);
                var selectOption = 'dd[lay-value=' + A_parameter + ']';
                parent.$("select[name='ENTRYNAME']").siblings("div.layui-form-select").find("dl").find(selectOption).click();
                layer.methodConfig = $(this).parent("div.maskDiv").prev("a").children("div.imgDiv").children("img").attr("src");
                var details = layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 1,
                    content: '/bim/project/details?id=' + A_parameter,
                    area: ['100%', '100%'],
                    end: function () {
                        location.reload();
                    }
                });
                layer.full(details);
            })
        }

        /**
         * 创建项目
         */
        function NewAdd() {
            $("#NewAdd").click(function () {
                $maskon();
                layer.open({
                    type: 2,
                    title: "创建项目",
                    closeBtn: 0,
                    shade: [.5],
                    area: ['800px', '550px'],
                    content: ['/bim/project/addProjectHome', 'no'],
                    end: function () {
                        location.reload();
                    }
                });
            })
        }

        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                $('.div_search span.icon-sousuo').click();
            }
        });
        $('.div_search span.icon-sousuo,.demoReloadTitle span.iconfont').click(function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        })
    });
})