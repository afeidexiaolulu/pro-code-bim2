layui.use(['layer'], function () {
    var layer = layui.layer;
    var projectID = GetQueryString("id");
    var pageIndex = 1;
    var a = 0;
    var h = 1;
    clickType = "";
    var currentPage = "";
    audioMP3 = "";
    get_UnreadMessage();


    //初始化  详情
    InitialDiv = function () {
        currentPage = "0";
        dynamicLoading.css("../../../webAppJs/css/detailsPage.css");
        dynamicLoading.js("../../../webAppJs/js/detailsPage.js");
        $.ajax({
            url: getRootPath() + "/bim/project/projectDetail",
            type: "post",
            cache: false,
            async: false,
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
                    const item = data.data;
                    var InitialDiv =
                        '<div class="detailsPage">' +
                        '<div class="porject_img" id="uploader">' +
                        '<img src="' + getRootPath() + item.img + '" alt="">' +
                        '<div class="replace add">点击可以更换此图片</div>' +
                        '</div>' +
                        '<div class="layui-form">' +
                        '<p><span>项目名称</span><span class="projext_name">' + item
                        .projectName +
                        '</span></p>' +
                        '<p><span>项目地点</span><span class="projectAddress">' + item
                        .projectAddress + '</span></p>' +
                        '<p><span>项目经理</span><span>' + item.projectManager +
                        '</span></p>' +
                        '<p><span>创建人</span><span>'+ item.createPersonName +'</span></p>' +
                        '<p><span>创建时间</span><span>' + item.createTime +
                        '</span></p>' +
                        '<p><span>项目简介</span><span></span></p>' +
                        '<p class="projectDescription">' + item.projectDescription + '</p>' +
                        '</div>' +
                        '<div class="layui-form-item">' +
                        '<button class="layui-btn layui-btn-indigo" data-type="edit" style="display:none;">编辑</button>' +
                        '</div>' +
                        '</div>';
                    $(".tab-container:nth-of-type(1) .s-pull").append(InitialDiv);
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
        })

        /**
         * 获取权限
         */
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
                    $.each(data.data, function (key, value) {
                        if (value == "Project:edition") {
                            $(".layui-form-item button").css("display","inline-block");
                            return false;
                        }
                    })

                } else if(data.success == false){
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

    //初始化  模型
    ModelDiv = function () {
        currentPage = "1";
        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/modelPage.css");
            dynamicLoading.js("../../../webAppJs/js/modelPage.js");
            var modelSearch = '<div class="modelSearch">' +
                '<input type="search" name="search" placeholder="搜索" autocomplete="off" class="layui-input search" data-type="search" style="display:inline-block;width:90%;"><span class="BIM-iconfont BIMpaixu" data-type="sort" type="desc"></span>' +
                '</div>';

            var modelPage =
                '<div class="modelPage">' +
                '<div class="model_list_content">' +
                '</div>' +
                '</div>';

            $(".Search").append(modelSearch);
            $(".tab-container:nth-of-type(2) .s-pull").append(modelPage);
        } else if (clickType == "sort" || clickType == "onRefreshStart" || clickType == "search") {
            pageIndex = 1;
        }

        $.ajax({
            url: getRootPath() + '/bim/model/modelList',
            type: "post",
            cache: false,
            async: false,
            data: {
                pageSize: "10",
                modelName: $("input[name='search']").val() == undefined ? '' : $("input[name='search']").val(),
                pageNo: pageIndex, //页码
                orderField: "createTime",
                type: $(".modelSearch .BIMpaixu").attr("type") //排序方法
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    let ModelDiv = "";
                    $.each(data.data.datas, function (index, item) {
                        let isOpenHtml = item.isOpen == "是" ? "公开" : "私密";
                        let isOpenIcon = item.isOpen == "是" ? "BIMgongkai" : "BIMsimi";
                        ModelDiv =
                            '<div class="mode_list" data-type="ModelDetails" id=' + item.id + '>' +
                            '<div class="model_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="model_content">' +
                            '<div class="model_explicit">' +
                            '<div class="model_top">' +
                            '<span class="layui-elip model_name">' + item.modelName + '</span>' +
                            '<span class="BIM-iconfont ' + isOpenIcon + '"></span>' +
                            '<span class="model_state">' + isOpenHtml + '</span>' +
                            '</div>' +
                            '<div class="model_bot">' +
                            '<span class="model_time">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.createTime) + '</span>' +
                            '<span class="model_size">' + item.modelSize + '</span>' +
                            '<span class="model_Subordinate layui-elip">' + item.createPersonName + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="More">' +
                            '<span class="BIM-iconfont BIMgengduo" data-type="more"></span>' +
                            '</div>' +
                            '<div class="layui-project-btn">' +
                            '<ul class="layui-table-view">' +
                            ' <li class="layui-table-view-cell share" data-type="share">分享</li>' +
                            '<hr />' +
                            '<li class="layui-table-view-cell rename" data-type="rename">重命名</li>' +
                            '<hr />' +
                            '<li class="layui-table-view-cell del" data-type="del">删除</li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        $(".model_list_content").append(ModelDiv);
                    })

                    if (pageIndex != 1 && data.data.datas == "") {
                        if (h == 1) {
                            h = 2;
                            BIM.open({
                                content: '\u95ee\u541b\u80fd\u6709\u51e0\u591a\u6101\uff0c\u6570\u636e\u53ea\u6709\u8fd9\u4e48\u591a',
                                skin: 'msg',
                                time: 3
                            });
                        }
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
        })

        $('.BIMpaixu,.BIMgengduo,.layui-table-view-cell,.link_div,.qr_div,.mode_list').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //初始化  问题
    QuestDiv = function () {
        currentPage = "2";
        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/questionPage.css");
            dynamicLoading.js("../../../webAppJs/js/questionPage.js");
            var QuestSearch =
                '<div class="questionSearch">' +
                '<input type="search" name="search" placeholder="搜索" autocomplete="off" class="layui-input search" data-type="search">' +
                '<span class="BIM-iconfont BIMxinzeng" data-type="add"></span><span class="BIM-iconfont BIMpaixu" data-type="sort" type="desc"></span>' +
                ' </div>';

            var QuestPage =
                '<div class="questionPage form_title">' +
                '<div class="question_list_content">' +
                '</div>' +
                '</div>';
            $(".Search").append(QuestSearch);
            $(".tab-container:nth-of-type(3) .s-pull").append(QuestPage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }

        $.ajax({
            url: getRootPath() + '/bim/problem/findAll',
            type: "post",
            cache: false,
            async: false,
            data: {
                pageSize: "10",
                problemName: $("input[name='search']").val() == undefined ? '' : $("input[name='search']").val(),
                pageNum: pageIndex, //页码
                sort: "createTime",
                rule: $(".questionSearch .BIMpaixu").attr("type") //排序方法
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    let QuestDiv = "";
                    let gradeColor = ""
                    $.each(data.data.list, function (index, item) {
                        switch (item.grade) {
                            case "十分重要":
                                gradeColor = "#D43031"
                                break;
                            case "重要":
                                gradeColor = "#FFC325"
                                break;
                            case "不重要":
                                gradeColor = "#1890FB"
                                break;
                            case "普通":
                                gradeColor = "#00B8AC"
                                break;
                        };
                        QuestDiv =
                            '<div class="question_list" id=' + item.id + ' data-type="questDetail">' +
                            '<div class="question_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="question_content">' +
                            '<div class="question_explicit">' +
                            '<div class="question_top layui-elip question_name">' + item.problemName + '</div>' +
                            '<div class="question_bot">' +
                            '<span class="question_time">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.createTime) + '</span>' +
                            '<span class="question_grade"><span class="BIM-iconfont BIMdengji" style="color: ' + gradeColor + ';"></span>' + item.grade + '</span>' +
                            '<span class="question_Subordinate layui-elip">' + item.createPerson + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="More">' +
                            '<span class="BIM-iconfont BIMgengduo" data-type="more"></span>' +
                            '</div>' +
                            '<div class="layui-project-btn">' +
                            '<ul class="layui-table-view">' +
                            '<li class="layui-table-view-cell rename" data-type="rename">重命名</li>' +
                            '<hr />' +
                            '<li class="layui-table-view-cell del" data-type="del">删除</li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            ' </div>' +
                            '</div>';
                        $(".question_list_content").append(QuestDiv);
                    })

                    if (pageIndex != 1 && data.data.list == "") {
                        if (h == 1) {
                            h = 2;
                            BIM.open({
                                content: '\u95ee\u541b\u80fd\u6709\u51e0\u591a\u6101\uff0c\u6570\u636e\u53ea\u6709\u8fd9\u4e48\u591a',
                                skin: 'msg',
                                time: 3
                            });
                        }
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
        })

        $('.layui-form-item button,.layui-table-view .layui-table-view-cell,.question_list,.questionSearch span,.BIMgengduo').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    // 初始化  成员
    StaffDiv = function () {
        currentPage = "3";
        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/staffPage.css");
            dynamicLoading.js("../../../webAppJs/js/staffPage.js");
            var StaffSearch =
                '<div class="staffSearch">' +
                '<input type="search" name="search" placeholder="搜索" autocomplete="off" class="layui-input search" data-type="search"><span class="BIM-iconfont BIMxinzeng" data-type="addPerson"></span><span class="BIM-iconfont BIMpaixu" data-type="sort" type="desc"></span>' +
                '</div>';

            var StaffPage =
                '<div class="staffPage form_title">' +
                '<div class="staff_list_content">' +
                '</div>' +
                '</div>';

            $(".Search").append(StaffSearch);
            $(".tab-container:nth-of-type(4) .s-pull").append(StaffPage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }

        $.ajax({
            url: getRootPath() + '/bim/projectMember/findAllProjectMember',
            type: "post",
            cache: false,
            async: false,
            data: {
                pageSize: "10",
                MembershipName: $("input[name='search']").val() == undefined ? '' : $("input[name='search']").val(),
                pageNo: pageIndex, //页码
                orderCondition: "roleName",
                orderMethod: $(".staffSearch .BIMpaixu").attr("type") //排序方法
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    let StaffDiv = "";
                    $.each(data.data.list, function (index, item) {
                        let itemAdd = item.roleName == "项目管理员" ? '<span class="staff_Subordinate layui-elip"><span class="BIM-iconfont BIMgerenzhuye"></span>项目创建人</span>' : ""
                        StaffDiv =
                            '<div class="staff_list" id=' + item.id + ' data-type="staffDetail" userId=' + item.userId + '>' +
                            '<div class="staff_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="staff_content">' +
                            '<div class="staff_explicit">' +
                            '<div class="staff_top layui-elip staff_name">' + item.userName + '</div>' +
                            '<div class="staff_bot">' +
                            '<span class="staff_phone">' + item.phoneNumber + '</span><span class="staff_grade">' + item.roleName + '</span>' + itemAdd +
                            '</div>' +
                            '</div>' +
                            '<div class="More">' +
                            '<span class="BIM-iconfont BIMgengduo" data-type="more"></span>' +
                            '</div>' +
                            '<div class="layui-project-btn">' +
                            '<ul class="layui-table-view">' +
                            '<li class="layui-table-view-cell del" data-type="del">删除</li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        if (item.roleName == "项目管理员") {
                            $(".staff_list_content").prepend(StaffDiv);
                        } else {
                            $(".staff_list_content").append(StaffDiv);
                        }
                    })

                    if (pageIndex != 1 && data.data.list == "") {
                        if (h == 1) {
                            h = 2;
                            BIM.open({
                                content: '\u95ee\u541b\u80fd\u6709\u51e0\u591a\u6101\uff0c\u6570\u636e\u53ea\u6709\u8fd9\u4e48\u591a',
                                skin: 'msg',
                                time: 3
                            });
                        }
                    }

                } else if (data.success == false) {
                    BIM.open({
                        content: '\u53d1\u751f\u9519\u8bef',
                        skin: 'msg',
                        time: 2
                    });
                }
            },
            erroe: function () {
                BIM.open({
                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                    skin: 'msg',
                    time: 2
                });
            }
        })

        $('.BIMxinzeng,.BIMpaixu,.staff_list,.BIMgengduo,.layui-table-view-cell,.Person_list').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //初始化 分享
    ShareDiv = function () {
        currentPage = "4";

        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/sharePage.css");
            dynamicLoading.js("../../../webAppJs/js/sharePage.js");
            var shareSearch =
                '<div class="shareSearch">' +
                '<input type="search" name="search" placeholder="搜索" autocomplete="off" class="layui-input search" data-type="search"><span class="BIM-iconfont BIMpaixu" data-type="sort" type="desc"></span>' +
                '</div>';

            var sharePage =
                '<div class="sharePage">' +
                '<div class="share_list_content">' +
                '</div>' +
                '</div>';

            $(".Search").append(shareSearch);
            $(".tab-container:nth-of-type(5) .s-pull").append(sharePage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }


        $.ajax({
            url: getRootPath() + '/bim/modelShare/modelShareList',
            type: "post",
            cache: false,
            async: false,
            data: {
                pageNo: pageIndex, //页码
                pageSize: "10",
                modelName: $("input[name='search']").val() == undefined ? '' : $("input[name='search']").val(),
                orderField: "startSharingTime",
                type: $(".shareSearch .BIMpaixu").attr("type") //排序方法
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    let ShareDiv = "";
                    $.each(data.data.datas, function (index, item) {
                        let share_state = item.shareStatu == "false" ? "私密链接" : "链接打开";
                        let share_icon = item.shareStatu == "false" ? "BIMsimi" : "BIMgongkai";
                        let share_onOff = item.shareStatu == 'false' ? '<li class="layui-table-view-cell rename" data-type="colse_link" type=' + item.shareStatu + '>开启链接</li>' : '<li class="layui-table-view-cell rename" data-type="colse_link" type=' + item.shareStatu + '>临时关闭链接</li>';

                        switch (item.shareDay) {
                            case 3:
                                var share_day = "3天有效";
                                break;
                            case 5:
                                var share_day = "5天有效";
                                break;
                            case 7:
                                var share_day = "7天有效";
                                break;
                            case 36500:
                                var share_day = "永久有效";
                                break;
                        }

                        ShareDiv =
                            '<div class="mode_list" id=' + item.id + '>' +
                            '<div class="share_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="share_content">' +
                            '<div class="share_explicit">' +
                            '<div class="share_top">' +
                            '<span class="layui-elip share_name">' + item.modelName + '</span>' +
                            '<span class="BIM-iconfont ' + share_icon + '"></span>' +
                            '<span class="share_state">' + share_state + '</span>' +
                            '</div>' +
                            '<div class="share_bot">' +
                            '<span class="share_time">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.startSharingTime) + '</span>' +
                            '<span class="share_size">' + share_day + '</span>' +
                            '<span class="share_Subordinate layui-elip">' + item.createPersonName + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="More">' +
                            '<span class="BIM-iconfont BIMgengduo" data-type="more"></span>' +
                            '</div>' +
                            '<div class="layui-project-btn">' +
                            '<ul class="layui-table-view">' +
                            '<li class="layui-table-view-cell share" data-type="copy_link">复制链接</li>' +
                            '<hr />' +
                            '<li class="layui-table-view-cell share" data-type="produce_QR">生成二维码</li>' +
                            '<hr />' + share_onOff +
                            '<hr />' +
                            '<li class="layui-table-view-cell del" data-type="del_link">删除链接</li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        $(".share_list_content").append(ShareDiv);
                    })

                    if (pageIndex != 1 && data.data.datas == "") {
                        if (h == 1) {
                            h = 2;
                            BIM.open({
                                content: '\u95ee\u541b\u80fd\u6709\u51e0\u591a\u6101\uff0c\u6570\u636e\u53ea\u6709\u8fd9\u4e48\u591a',
                                skin: 'msg',
                                time: 3
                            });
                        }
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
        })

        $('.layui-table-view .layui-table-view-cell,.BIMpaixu,.BIMgengduo').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

    }

    //问题详情
    questDetail = function (questId) {
        dynamicLoading.css("../../../webAppJs/css/questDetail.css");
        dynamicLoading.js("../../../webAppJs/js/questDetail.js");
        $.ajax({
            url: getRootPath() + "/bim/problem/findOne",
            type: "post",
            cache: false,
            async: false,
            data: {
                id: questId
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    if (data.data.problemOne == "" || data.data.problemOne == null) {
                        BIM.open({
                            content: '\u6682\u65e0\u8be6\u60c5',
                            skin: 'msg',
                            time: 3
                        });
                    } else {
                        let item = data.data.problemOne;
                        let gradeColor = "";
                        switch (item.grade) {
                            case "十分重要":
                                gradeColor = "#D43031"
                                break;
                            case "重要":
                                gradeColor = "#FFC325"
                                break;
                            case "不重要":
                                gradeColor = "#1890FB"
                                break;
                            case "普通":
                                gradeColor = "#00B8AC"
                                break;
                        };
                        var questDetail =
                            '<div class="questDetail" id=' + item.id + '>' +
                            '<p><strong>问题名称</strong><span class="projectName">' + item.problemName + '</span></p>' +
                            '<p class="ImportantLevel"><strong>问题等级</strong><span class="BIM-iconfont BIMdengji grade" style="color: ' + gradeColor + ';">' + item.grade + '</span></p>' +
                            '<div class="iosselect">' +
                            '<ul>' +
                                    '<li>十分重要</li>' +
                                    '<li>重要</li>' +
                                    '<li>普通</li>' +
                                    '<li>不重要</li>' +
                                '</ul>' +
                            '</div>' +
                            '<p><strong>创建人</strong><span>' + item.createPerson + '</span></p>' +
                            '<p><strong>创建时间</strong><span>' + /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g.exec(item.createTime) + '</span></p>' +
                            '<p><strong>处理人</strong><span>'+ item.problemSolverName +'</span></p>' +
                            '<div class="explain">' +
                            '<strong>问题详述</strong>' +
                            '<p class="describe">' + item.describes + '</p>' +
                            '</div>' +
                            '<p class="soundRecordiv"><strong>问题录音</strong><span class="send Orderprocessing"><span class="arrow"></span><span class="BIM-iconfont BIMyuyin"></span>1\'11\"</span><span class="BIM-iconfont BIMdeleteluyin" data-type="BIMdeleteluyin"></span><span class="BIM-iconfont BIMhuatong startRecord"></span></p>' +
                            '<p class="startRecord">开始录音</p>' +
                            '<audio hidden="hidden" id="audio">' +
                            '<source src='+ getRootPath() + '/voice' + item.problemDescribeRecording + ' type="audio/mp3">' +
                            '<embed height="50px" width="100px" src='+ getRootPath() + '/voice' + item.problemDescribeRecording + '>' +
                            '</audio>' +
                            '<div class="picture">' +
                            '<strong>问题截图</strong>' +
                            '<div class="problemImg"><ul id="uploader"><li style="display:none;" class="add" data-type="addImg"><span class="BIM-iconfont BIMxinzeng"></span></li></ul><div style="clear: both;"></div></div>' +
                            '</div>' +
                            '<div class="record">' +
                            '<strong>处理记录</strong>' +
                            '<div class="record_list">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="layui-form-item">' +
                            '<button class="layui-btn layui-btn-indigo" data-type="questEdit">编辑</button>' +
                            '<button class="layui-btn layui-btn-primary" data-type="questclose">取消</button>' +
                            '</div>';

                        $(".tab-container:nth-of-type(3) .s-pull").append(questDetail);
                    };


                    $.each(data.data.messageList,function(index,atem){
                        let record_listDiv =
                            '<div class="record_listDiv">' +
                            '<p><span class="record_name">'+ atem.sendPersonName +'</span><span class="record_date">'+ atem.createTime +'</span></p>' +
                            '<p class="record_cont">'+ atem.info +'</p>' +
                            '</div>';
                        $(".record_list").append(record_listDiv);
                    })

                    if (data.data.problemImg == "" || data.data.problemImg == null) {
                        $(".problemImg").html('\u6682\u65e0\u56fe\u7247');
                    } else {
                        $.each(data.data.problemImg, function (index, item) {
                            let problemImg =
                                '<li><img src=' + getRootPath() + item.img + ' id=' + item.id + ' alt="" /><span class="BIM-iconfont BIMguanbi" data-type="del"></span></li>'
                            $(".problemImg ul").append(problemImg);
                        })
                    }

                    if (data.data.isEnd == "1"){ // 结束
                        $(".record_listDiv:last-child").after("<div class='record_listDiv'><span class='BIM-iconfont BIMdengji tiops'>问题已经解决</span></div>");
                        return false;
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
        });

        $('.layui-form-item button,.BIMguanbi,.grade,.BIMdeleteluyin').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });


        getToken();
        let localId1 = "";
        let serverId = "";
        //开始录音
        $('.startRecord').on('touchstart', function(event){
            event.preventDefault();
            START = new Date().getTime();
            recordTimer = setTimeout(function(){
                wx.startRecord({
                    success: function(){

                    },
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
            },300);
        });

        //松手结束录音
        $('.startRecord').on('touchend', function(event){
            event.preventDefault();
            END = new Date().getTime();
            if((END - START) < 1000){
                END = 0;
                START = 0;
                //小于1000ms，不录音
                clearTimeout(recordTimer);
                BIM.open({
                    content: '说话时间太短'
                    ,skin: 'msg'
                    ,time: 2
                });
                var t=setTimeout(function(){wx.stopRecord()},800);
                //这里设置800毫秒，是因为如果用户录音之后马上松开按钮，会成 wx.stopRecord不起作用的情况，然后会一直录音，所以时间设置长一点
            }else{
                wx.stopRecord({
                    success: function (res) {
                        localId1 = res.localId;
                        uploadVoice();
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        });

        //上传录音
        function uploadVoice(){
            wx.uploadVoice({
                localId: localId1, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    serverId = res.serverId; // 返回音频的服务器端ID
                    console.log(serverId);
                    $.ajax({
                        url: getRootPath() + "/bim/webApp/recordingTranscoding",
                        type: "post",
                        cache: false,
                        async: false,
                        data: {
                            mediaId: serverId
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (res) {
                            if (res.success == true){
                                audioMP3 =  res.data;
                                $("audio source").attr("src",getRootPath()+ "/voice" + res.data);
                                $("audio embed").attr("src",getRootPath()+ "/voice" + res.data);
                                $(".soundRecordiv span").show();
                                $(".BIMhuatong ").hide();
                                $(".Orderprocessing").click(function(){
                                    wx.playVoice({
                                        localId: localId1 // 需要播放的音频的本地ID，由stopRecord接口获得
                                    });
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
            });
        }

        //监听录音自动停止
        wx.onVoiceRecordEnd({
            complete: function (res) {
                localId1 = res.localId;
                uploadVoice();//上传录音到服务器
                layer.open({
                    content: '录音时间已超过一分钟'
                    ,skin: 'msg'
                    ,time: 3
                });
            }
        });

        $(".Orderprocessing").click(function(){
            Orderprocessing();
        })

    }

    //成员详情
    staffDetail = function () {
        let Person_detail =
            '<div class="staffPage Person_form_title">' +
            '<div class="Person_list_content">' +
            '</div>' +
            '</div>';
        $(".tab-container:nth-of-type(4) .s-pull").append(Person_detail);

        let staffDetail =
            '<div class="Person_detailDiv">' +
            '<div class="Person_detail">' +
            '<div class="Person_detail_left">' +
            '<img src="../../../webAppJs/images/default.png" alt="">' +
            '</div>' +
            '<div class="Person_detail_right">' +
            '<div class="Person_detail_right_content"><div class="StaffName"></div><span class="rolesName"></span><div><span class="Cell_phoneNumber"></span><span>中冶建研院</span></div></div>' +
            '</div>' +
            '</div>' +
            '<div class="layui-form-item"><button class="layui-btn layui-btn-indigo" data-type="updateRoles">更改角色</button><button class="layui-btn layui-btn-primary" data-type="cancellation">取消</button></div>';
        '</div>';

        $(".Person_list_content").append(staffDetail);

        $('.Person_detailDiv button').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

    }

    //增加成员
    addPerson = function () {
        if ($("input").attr("name") == "search") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(4) .s-pull").empty();
        }
        currentPage = "3";
        if (clickType == "" && ($("input[name='PersonSearch']").val() == "" || $("input[name='PersonSearch']").val() == undefined)) {
            var StaffSearch =
                '<div class="staffSearch">' +
                '<input type="search" name="PersonSearch" placeholder="姓名/手机号" autocomplete="off" class="layui-input PersonSearch" data-type="PersonSearch" style="width:90%;display:inline-block;"><span class="addPersonCancel" data-type="cancel" >取消</span>' +
                '</div>';

            var StaffPage =
                '<div class="staffPage form_title">' +
                '<div class="staff_list_content">' +
                '</div>' +
                '</div>';

            $(".Search").append(StaffSearch);
            $(".tab-container:nth-of-type(4) .s-pull").append(StaffPage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }


        $.ajax({
            url: getRootPath() + "/bim/projectMember/queryUserByUesrNameAndPhoneNumber",
            type: "post",
            cache: false,
            async: false,
            data: {
                uesrNameAndPhoneNumber: $("input[name='PersonSearch']").val()
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    $.each(data.data, function (index, item) {
                        let addPerson =
                            '<div class="person_list" data-type="person_list" id=' + item.id + '>' +
                            '<div class="Person_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="Person_right">' +
                            '<p><span class="layui-elip">' + item.userName + '</span><span style="margin: 0 0.06666666rem;">:</span><span>' + item.phoneNumber + '</span></p>' +
                            '</div>' +
                            '</div>';
                        $(".staff_list_content").append(addPerson);
                    })
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
        })

        $('.person_list,.addPersonCancel').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //添加时==人员详情
    Person_detail = function () {
        let Person_detail =
            '<div class="staffPage Person_form_title">' +
            '<div class="Person_list_content">' +
            '</div>' +
            '</div>';
        $(".tab-container:nth-of-type(4) .s-pull").append(Person_detail);

        let Person_details =
            '<div class="Person_detailDiv">' +
            '<div class="Person_detail">' +
            '<div class="Person_detail_left">' +
            '<img src="../../../webAppJs/images/default.png" alt="">' +
            '</div>' +
            '<div class="Person_detail_right">' +
            '<div class="Person_detail_right_content"><div class="StaffName"></div><div><span class="Cell_phoneNumber"></span><span>中冶建研院</span></div></div>' +
            '</div>' +
            '</div>' +
            '<div class="layui-form-item">' +
            '<button class="layui-btn layui-btn-indigo" data-type="selectedPerson">确定</button>' +
            '<button class="layui-btn layui-btn-primary" data-type="cancellation">取消</button>' +
            '</div>' +
            '</div>';
        $(".Person_list_content").append(Person_details);

        $('.Person_detailDiv button').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //增加问题
    addQuestion = function () {
        currentPage = "2";
        if ($("input").attr("name") == "search") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(3) .s-pull").empty();
        }

        let addQuestion =
            '<div class="layui-form addQuestion" action="">' +
                '<input type="text" name="QuestionName" required lay-verify="required" placeholder="问题名称（不超过15个字）" autocomplete="off" class="layui-input">' +
                '<p class="ImportantLevel" data-type="iosselect"><span>重要等级</span><span class="BIM-iconfont BIMdengji grade" style="display:none;"></span><span class="BIM-iconfont BIMjiantouxia"><span></p>' +
                '<div class="iosselect">' +
                   '<ul>' +
                        '<li>十分重要</li>' +
                        '<li>重要</li>' +
                        '<li>普通</li>' +
                        '<li>不重要</li>' +
                    '</ul>' +
                '</div>' +
                '<p class="Send" data-type="currentStaff"><span>发送给</span><span class="sending"></span><span class="BIM-iconfont BIMjiantouxia"><span></p>' +
                '<div class="currentStaff">' +
                '<ul>' +
                '</ul>' +
                '</div>' +
                '<textarea name="QuestionDescribe" placeholder="问题详述（不超过80个字）" class="layui-textarea"></textarea>' +
                '<p class="soundRecordiv"><strong>问题录音</strong><span class="send Orderprocessing"><span class="arrow"></span><span class="BIM-iconfont BIMyuyin"></span>1\'11\"</span><span class="BIM-iconfont BIMhuatong startRecord"></span></p>' +
                '<audio hidden="hidden" id="audio">' +
                '<source src="">' +
                '<embed height="50px" width="100px" src="">' +
                '</audio>' +
                '<div class="picture">' +
                    '<strong>问题截图</strong>' +
                    '<div class="problemImg">' +
                        '<ul id="uploader">' +
                            '<li class="add" data-type="addImg"><span class="BIM-iconfont BIMxinzeng"></span></li>' +
                            '</ul>' +
                            '<div style="clear: both;">' +
                        '</div>' +
                    '</div>' +
               ' </div>' +
                '<div class="layui-form-item">' +
                '<button class="layui-btn layui-btn-indigo" data-type="firm">确定</button>' +
                '<button class="layui-btn layui-btn-primary" data-type="close">取消</button>' +
                '</div>'
            '</div>';


        $(".tab-container:nth-of-type(3) .s-pull").append(addQuestion);

        $('.addQuestion .layui-btn ,.ImportantLevel ,.Send').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

        getToken();
        let localId1 = "";
        let serverId = "";
        //开始录音
        $('.startRecord').on('touchstart', function(event){
            event.preventDefault();
            START = new Date().getTime();
            recordTimer = setTimeout(function(){
                wx.startRecord({
                    success: function(){

                    },
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
            },300);
        });

        //松手结束录音
        $('.startRecord').on('touchend', function(event){
            event.preventDefault();
            END = new Date().getTime();
            if((END - START) < 1000){
                END = 0;
                START = 0;
                //小于1000ms，不录音
                clearTimeout(recordTimer);
                BIM.open({
                    content: '说话时间太短'
                    ,skin: 'msg'
                    ,time: 2
                });
                var t=setTimeout(function(){wx.stopRecord()},800);
                //这里设置800毫秒，是因为如果用户录音之后马上松开按钮，会成 wx.stopRecord不起作用的情况，然后会一直录音，所以时间设置长一点
            }else{
                wx.stopRecord({
                    success: function (res) {
                        localId1 = res.localId;
                        uploadVoice();
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        });

        //上传录音
        function uploadVoice(){
            wx.uploadVoice({
                localId: localId1, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    serverId = res.serverId; // 返回音频的服务器端ID
                    console.log(serverId);
                    $.ajax({
                        url: getRootPath() + "/bim/webApp/recordingTranscoding",
                        type: "post",
                        cache: false,
                        async: false,
                        data: {
                            mediaId: serverId
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (res) {
                            if (res.success == true){
                                audioMP3 =  res.data;
                                $("audio source").attr("src",getRootPath()+ '/voice' + res.data);
                                $("audio embed").attr("src",getRootPath()+ '/voice' + res.data);
                                $(".soundRecordiv .send").css("display","flex");
                                $(".BIMhuatong ").hide();
                                $(".Orderprocessing").click(function(){
                                    wx.playVoice({
                                        localId: localId1 // 需要播放的音频的本地ID，由stopRecord接口获得
                                    });
                                })
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
            });
        }

        //监听录音自动停止
        wx.onVoiceRecordEnd({
            complete: function (res) {
                localId1 = res.localId;
                uploadVoice();//上传录音到服务器
                layer.open({
                    content: '录音时间已超过一分钟'
                    ,skin: 'msg'
                    ,time: 3
                });
            }
        });

        $(".Orderprocessing").click(function(){
            Orderprocessing();
        });

    }

    var box = document.getElementById('box');
    var swiper = new TabSwiper(box, {
        speed: 500,
        threshold: 150,
        isPullDown: true,
        isPullUp: true,
        closeInertia: true,
        xThreshold: 0.25,
        defaultPage: 0,
        initCb: function () { // 初始化回调
            InitialDiv();
            console.log('初始化完成');
            var spans = document.querySelectorAll('.tabs span')
            for (var i = 0; i < spans.length; i++) {
                (function (page) {
                    spans[page].onclick = function (event) {
                        swiper.changePage(page)
                        event.stopPropagation();
                    }
                })(i)
            }
        },
        onRefreshStart: function () { // 触发下拉刷新时回调(返回当前页数)
            setTimeout(function () {
                swiper.pullEnd(function (page) {
                    console.log('刷新结束----' + page);
                    pageIndex = 1;
                    if (page == "1") {
                        histry();
                        clickType = "";
                        ModelDiv();
                    } else if (page == "2") {
                        histry();
                        clickType = "";
                        QuestDiv();
                    } else if (page == "3") {
                        histry();
                        clickType = "";
                        StaffDiv();
                    } else if (page == "4") {
                        histry();
                        clickType = "";
                        ShareDiv();
                    } else if (page == "0") {
                        $(".tab-container:nth-of-type(1) .s-pull").empty();
                        InitialDiv();
                    }
                })
            }, 500)
        },
        onLoadStart: function () { // 触发上拉加载时回调(返回当前页数)
            setTimeout(function () {
                swiper.pullEnd(function (page) {
                    console.log('加载结束----' + page)
                    pageIndex = pageIndex + 1;
                    if (page == "1") {
                        clickType = "onLoadStart";
                        ModelDiv();
                    } else if (page == "2") {
                        clickType = "onLoadStart";
                        QuestDiv();
                    } else if (page == "3") {
                        clickType = "onLoadStart";
                        StaffDiv();
                    } else if (page == "4") {
                        clickType = "onLoadStart";
                        ShareDiv();
                    } else if (page == "0") {
                        $(".tab-container:nth-of-type(1) .s-pull").empty();
                        InitialDiv();
                    }
                })
            }, 500)
        },
        onEnd: function (page) { // 切换页数时回调(返回当前页数)
            if (page == "1") {
                histry();
                clickType = "";
                $(".tab-container:nth-of-type(2) .s-pull").empty();
                ModelDiv();
            } else if (page == "2") {
                histry();
                clickType = "";
                $(".tab-container:nth-of-type(3) .s-pull").empty();
                QuestDiv();
            } else if (page == "3") {
                histry();
                clickType = "";
                $(".tab-container:nth-of-type(4) .s-pull").empty();
                StaffDiv();
            } else if (page == "4") {
                histry();
                clickType = "";
                $(".tab-container:nth-of-type(5) .s-pull").empty();
                ShareDiv();
            } else if (page == "0") {
                histry();
                clickType = "";
                $(".tab-container:nth-of-type(1) .s-pull").empty();
                InitialDiv();
            }

            function next() {
                console.log('当前所在----' + page);
                a = page;
                var spans = document.querySelectorAll('.tabs span')
                for (var i = 0; i < spans.length; i++) {
                    if (i != page) {
                        spans[i].className = ''
                    } else {
                        spans[i].className = 'active'
                        var left = i * 20 + 5 + "% !important";
                        addRule(".tabs span.active::before", {
                            left: left,
                            //    width: '10% !important'
                        });
                    }
                }

            }
            next()
        },
        onTouchmove: function (page, e) { // 正在页面上滑动回调(返回当前页数和滑动信息。可通过滑动的信息得到当前滑动的方向速度滑动的距离，进行功能扩展)
            // console.log('正在拖动...')
            // console.log(e.x)
            // console.log(Math.abs(e.x))
            // console.log(e)
            var a = Math.floor(Math.abs(e.x / (window.screen.width * 0.25) * 10))
            // console.log(a)
            // addRule(".tabs span.active::before", {
            //     width: '20% !important'
            // });

            // if(Math.abs(e.x) < Math.abs(window.screen.width*0.25)){
            //     var width = ""

            //     for (let i = 5; i < 20; i++) {
            //         width = i++
            //     }
            //     console.log(width)
            // }
        }
    })

    //回车查询
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = a;
            pageIndex = 1;
            clickType = "search";
            $('.search').click();
            if (page == "1") {
                $(".tab-container:nth-of-type(2) .model_list_content").empty();
                ModelDiv();
            } else if (page == "2") {
                $(".tab-container:nth-of-type(3) .question_list_content").empty();
                QuestDiv();
            } else if (page == "3") {
                if ($("input").attr("name") == "search") {
                    $(".tab-container:nth-of-type(4) .staff_list_content").empty();
                    StaffDiv();
                } else if ($("input").attr("name") == "PersonSearch") {
                    $(".tab-container:nth-of-type(4) .staff_list_content").empty();
                    addPerson();
                }
            } else if (page == "4") {
                $(".tab-container:nth-of-type(5) .modelPage").empty();
                ShareDiv();
            } else if (page == "0") {
                $(".tab-container:nth-of-type(1) .modelPage").empty();
                InitialDiv();
            }
        }
    });

    //返回上一页页码
    function histry() {
        if (currentPage == "0") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(1) .s-pull").empty();
            removejscssfile("detailsPage", "css");
            removejscssfile("detailsPage", "js");
        } else if (currentPage == "1") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(2) .s-pull").empty();
            removejscssfile("modelPage", "css");
            removejscssfile("modelPage", "js");
        } else if (currentPage == "2") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(3) .s-pull").empty();
            removejscssfile("questionPage", "css");
            removejscssfile("questionPage", "js");
        } else if (currentPage == "3") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(4) .s-pull").empty();
            removejscssfile("staffPage", "css");
            removejscssfile("staffPage", "js");
        } else if (currentPage == "4") {
            $(".Search").empty();
            $(".tab-container:nth-of-type(5) .s-pull").empty();
            removejscssfile("sharePage", "css");
            removejscssfile("sharePage", "js");
        }
    };

    //从后台获取wx.config中所需要的参数
    function getToken() {
        $.ajax({
            url : getRootPath() + "/bim/webApp/jssdk",
            type : "get",
            dataType : "json",
            cache: false,
            async: false,
            data: {
                'url': location.href.split('#')[0]
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success : function(data) {
                var json = data;
                wx.config({
                    beta : true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId : json.appId, // 必填，企业微信的corpID
                    timestamp : json.timestamp, // 必填，生成签名的时间戳
                    nonceStr : json.nonceStr, // 必填，生成签名的随机串
                    signature : json.signature,// 必填，签名，见附录1
                    jsApiList: [
                        'checkJsApi',
                        'startRecord',
                        'stopRecord',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'chooseImage',
                        'translateVoice',
                        'uploadVoice'
                    ]
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function() {
                    wx.checkJsApi({
                        jsApiList: [
                            'checkJsApi',
                            'startRecord',
                            'stopRecord',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'chooseImage',
                            'translateVoice',
                            'uploadVoice'
                        ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success : function(res) {
                            //alert("支持权限检查:"+JSON.stringify(res));
                        }
                    });
                });
            }
        })
    };

    //自动播放
    function autoPlayAudio() {
        wx.ready(function() {
            // document.getElementById('audio').play();
            var vid = document.getElementById("audio");//获取音频对象
            vid.play();
        });
    };
    //播放录音
    function Orderprocessing(){
        debugger
        var vid = document.getElementById("audio");//获取音频对象
        var start = 0;//定义循环的变量
        var times=1;//定于循环的次数
        autoPlayAudio(vid);
        if(vid.paused) {
            vid.play();// 这个就是播放
        }
        vid.addEventListener("ended",function() {
            autoPlayAudio(vid);
            if(vid.paused)                     {
                vid.play();// 这个就是播放
            }
            start++;//循环
            start == times && vid.pause();//也就是当循环的变量等于次数的时候，就会终止循环并且关掉音频
        });
    };

})