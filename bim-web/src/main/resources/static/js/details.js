$(function () {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var projectID = getParameterFromUrl("id");

        deed();

        function deed() {
            $(".layui-fluid").show();
            if (projectID != "") {
                $.ajax({
                    url: getRootPath() + "/bim/project/projectDetail",
                    type: "post",
                    data: {
                        projectId: projectID
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        if (data.success == true) {
                            // 项目详情
                            $(".projectName").html(data.data.projectName);
                            $(".projectAddress").html(data.data.projectAddress);
                            $(".projectManager").html(data.data.projectManager);
                            $(".projectDescription").html(data.data.projectDescription);
                            edit();
                            // 人员列表
                            let ProjectMembersStr = "";
                            $(".ProjectMembers:last-child() tbody").html("");
                            $.each(data.data.users, function (key, value) {
                                if(value.department == "项目管理员"){
                                    ProjectMembersStr += "<tr><td>" + value.userName + "</td><td>" + value.department + "<span class='iconfont icon-user' style='color:#2e85c1;margin-left: 20px;'></span></td></tr>";
                                }else{
                                    ProjectMembersStr += "<tr><td>" + value.userName + "</td><td>" + value.department + "</td></tr>";
                                }
                            })
                            $(".ProjectMembers:last-child() tbody").append(ProjectMembersStr);
                            if (data.data.users.length > 5) {
                                BeautifyScroll("#ProjectMembersTbody");
                            }
                        } else {
                            layer.msg(data.messgae, {
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
                })

                $.ajax({
                    url: getRootPath() + "/bim/project/projectProblem",
                    type: "post",
                    data: {
                        projectId: projectID
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        if (data.success == true) {
                            // 问题清单
                            let ListQuestionssStr = "";
                            $(".ListQuestions:last-child() tbody").html("");
                            $.each(data.data.list, function (key, value) {
                                /**
                                 * 判断问题的紧急情况
                                 */
                                grade = ""
                                switch (value.grade) {
                                    case "十分重要":
                                        grade = "<span class='iconfont icon-jinggaotianchong' style='color:#D43031'></span>";
                                        break;
                                    case "重要":
                                        grade = "<span class='iconfont icon-jinggaotianchong' style='color:#FFC325'></span>";
                                        break;
                                    case "不重要":
                                        grade = "<span class='iconfont icon-jinggaotianchong' style='color:#1890FB'></span>";
                                        break;
                                    case "普通":
                                        grade = "<span class='iconfont icon-jinggaotianchong' style='color:#00B8AC'></span>";
                                        break;
                                }
                                ListQuestionssStr += "<tr><td>" + value.problemName + "</td><td>" + grade + "</td></tr>"
                            })
                            $(".ListQuestions:last-child() tbody").append(ListQuestionssStr);
                            if (data.data.list.length > 6) {
                                BeautifyScroll("#ListQuestionsTbody");
                            }
                        } else {
                            layer.msg(data.messgae, {
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
                })

            } else if (projectID == "") {
                layer.msg("项目ID不存在，请联系管理员", {
                    icon: 5,
                    anim: 6
                });
            }


            /**
             * 滚动渲染列表
             */
            var pageIndex = 1;
            var divscroll= $("#Model");
            function divScroll() {
                var wholeHeight = divscroll.scrollHeight;
                var scrollTop = divscroll.scrollTop;
                var divHeight = divscroll.clientHeight;
                if (scrollTop + divHeight >= wholeHeight) {
                    pageIndex++;
                    GetList();
                }
            }

            GetList();

            /**
             * 添加模型图
             */
            function GetList(){
                $.ajax({
                    url: getRootPath() + '/bim/model/modelList',
                    type: "post",
                    data:{
                        pageNo: pageIndex, //页码
                        pageSize: "10000" ,//每页数量
                        orderField: "createTime",//排序字段
                        type: "desc"//排序方法
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
                        var add = '<div class="layui-col-md3 layui-col-lg3 add" style="line-height: 120px;"><span class="iconfont icon-xinjian" id="NewAdd" ></span></div>'
                        /**
                         * 显示页面
                         */
                        if (data.data.datas != "") {
                            $(".cmdlist-container").show()
                            var Model = ""
                            $.each(data.data.datas, function (key, val) {
                                Model += '<div class="layui-col-md3 layui-col-lg3"><img src='+ parent.layer.methodConfig +' alt=""><div class="em" id='+ val.id +'>'+ val.modelName +'</div></div>'
                            });
                            // 判断是否第一次加载
                            if (pageIndex == "1") {
                                $(".add").show();
                                $("#Model").empty();
                                $("#Model").append(add + Model);
                            } else {
                                $("#Model").append(Model);
                            }
                            //上传model
                            uploadModel();
                            //hover事件
                            NameHover();
                            //点击模型事件
                            modeClick();

                            $('#Model').on('scroll', function(){
                                divScroll();
                            })


                            /**
                             * 判断项目是否到底
                             */
                            if (data.data.totalno <= pageIndex) {
                                return false
                            }
                        }else if(data.data.datas == ""){
                            $(".add").show();
                            $(".add").css({"width":"180px","height":"120px"});
                            if(0 == data.data.totalno){
                                uploadModel();
                                return false;
                            }else if(pageIndex > data.data.totalno){

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
             * 上传
             */
            function uploadModel(){
                $("#NewAdd").click(function () {
                    $maskon();
                    layer.open({
                        type: 2,
                        title: "添加模型",
                        closeBtn: 0,
                        shade: [.5],
                        area: ['800px', '550px'],
                        content: ['../model/newBuild', 'no'],
                        end: function () {
                            location.reload();
                        }
                    });
                })
            }

            /**
             * 获取权限
             */
            $.ajax({
                url: getRootPath() + "/bim/userGetPermission",
                type: "get",
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (data) {
                    if (data.success == true) {
                        $.each(data.data, function (key, value) {
                            if (value == "Project:edition") {
                                $(".btnClass").append('<button type="button" class="layui-btn layui-btn-darkblue" id="edit">编辑</button><button type="button" class="layui-btn" id="hold">保存</button>');
                            }
                            edit();
                        })

                    } else {
                        layer.msg(data.message, {
                            icon: 5
                        });
                    }
                },
                error: function () {
                    layer.msg("获取权限失败，请联系管理员", {
                        icon: 5,
                        anim: 6
                    });
                }
            })

            /**
             * 修改
             */
            function edit() {
                $("#edit").click(function () {
                    $("p.projectName").attr("contenteditable", true);
                    $("span.projectAddress").attr("contenteditable", true);
                    $("p.projectDescription").attr("contenteditable", true);
                    layer.tips('开始修改吧', 'p.projectName');
                    $("p.projectName").addClass("modify");
                    $("span.projectAddress").addClass("modify");
                    $("p.projectDescription").addClass("modify");
                    $("#hold").show();
                    $("#hold").click(function () {
                        layer.msg('确定修改？', {
                            time: 0,
                            btn: ['是', '否'],
                            yes: function (index) {
                                layer.close(index);
                                $.ajax({
                                    url: getRootPath() + "/bim/project/update",
                                    type: "post",
                                    data: {
                                        projectId: projectID,
                                        projectName: $("p.projectName").html(),
                                        projectDescription: $("p.projectDescription").text(),
                                        ProjectAddress: $("span.projectAddress").html()
                                    },
                                    beforeSend: function () {
                                        layer.load(2);
                                    },
                                    complete: function () {
                                        layer.closeAll('loading');
                                    },
                                    success: function (data) {
                                        if (data.success == true) {
                                            layer.msg("修改成功", {
                                                icon: 6
                                            });
                                            $("#hold").hide();
                                            $("p.projectName").removeAttr("contenteditable");
                                            $("span.projectAddress").removeAttr("contenteditable");
                                            $("p.projectDescription").removeAttr("contenteditable");
                                            $("p.projectName").removeClass("modify");
                                            $("span.projectAddress").removeClass("modify");
                                            $("p.projectDescription").removeClass("modify");
                                        } else if (data.success == false) {
                                            layer.msg(data.message, {
                                                icon: 5
                                            });
                                            $("#hold").hide();
                                            $("p.projectName").removeAttr("contenteditable");
                                            $("span.projectAddress").removeAttr("contenteditable");
                                            $("p.projectDescription").removeAttr("contenteditable");
                                            $("p.projectName").removeClass("modify");
                                            $("span.projectAddress").removeClass("modify");
                                            $("p.projectDescription").removeClass("modify");
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
                    })
                })
            }


            /**
             * 操作
             */
            active = {
                // 项目成员
                chengyuan: function () {
                    Clcik_href($(this).attr('name'));
                },
                // 问题清单
                wentilist: function () {
                    Clcik_href($(this).attr('name'));
                },
                // 模型
                modelist: function () {
                    Clcik_href($(this).attr('name'));
                }
            }

            /**
             * 跳转对应页面
             */
            function Clcik_href(activeName){
                var  activeName = activeName;
                var ifarmeName = getCaption(activeName,"/")
                $.each(parent.parent.$("#layui-side-scroll-ul li"),function(index,item){
                    if($(this).attr('name') == activeName){
                        $(this).addClass("layui-Select");
                    }else{
                        $(this).removeClass("layui-Select");
                    }
                })
                parent.parent.$(".layui-layout-left").show();
                parent.parent.$(".layui-body div").append("<iframe class='layadmin-iframe' name='" + ifarmeName +
                    "' src='" + activeName + "' frameborder='0'></iframe>");
                parent.parent.$(".layui-body div iframe:first-child").remove();
            }

            function NameHover(){
                $("#Drawing div,#Model div").mouseover(function () {
                    $(this).width($(this).prev("img").width());
                    $(this).height($(this).prev("img").height());
                    $(this).css("line-height",$(this).prev("img").height() + "px");
                    $(this).children(".em").css("display", "block");
                }).mouseout(function () {
                    $(this).children(".em").css("display", "none");
                })
            }

            function modeClick(){
                $(".em").click(function(){
                    layer.open({
                        type: 2,
                        title: false,
                        closeBtn: 1,
                        area: ['100%', '100%'],
                        content: ['../model/ModelDetails?id=' + $(this).attr("id"), 'no'],
                        end: function () {
                            location.reload();
                        }
                    });
                })
            }

            debugger
            let heightList = $(".ParkManagement").height();
            // alert(heightList - (heightList*0.22))
            $("#Drawing").css("height", heightList)
            $(".Model div.cmdlist-text").css("height", heightList - (heightList * 0.16))
            BeautifyScroll("#Drawing")

            $('.layui-title-button p').click(function () {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            })

        }

    })
})