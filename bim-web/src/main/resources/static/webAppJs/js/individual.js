layui.use(['layer'], function () {
    var layer = layui.layer;
    var clickType = "";
    var status = "";
    var pageIndex = 1;
    var a = 0;
    var h = 1;
    getUsreTiops();
    get_UnreadMessage();
    //获取个人信息
    $(".individual_right_content .StaffName").html(sessionStorage.getItem("userName") != ""?sessionStorage.getItem("userName"):"未知");
    $(".individual_left img").attr("src",sessionStorage.getItem("icon") !=""?sessionStorage.getItem("icon"):"");
    $(".individual_right_content .Cell_phoneNumber").html(sessionStorage.getItem("phoneNumber") !=""?sessionStorage.getItem("phoneNumber"):"未知");
    $(".individual_right_content .department").html(sessionStorage.getItem("department") != ""?sessionStorage.getItem("department"):"未知");
    active = {
        personal_ShareDiv: function () {
            $(".homepage").empty();
            $(".individual").empty();
            $("#refreshContainer").show();
            personal_ShareDiv();
        },
        my_Question:function(){
            $(".homepage").empty();
            $(".individual").empty();
            $(".my_Question").show();
            my_Question();
        },
        weidu:function(){
            $(".homepage").empty();
            $(".individual").empty();
            $(".my_Question").hide();
            $(".my_Question").empty();
            unhandled_Issues();
        },
        yidu:function(){
            $(".homepage").empty();
            $(".individual").empty();
            $(".my_Question").hide();
            $(".my_Question").empty();
            issues_Addressed();
        },
        questDetail: function(){
            $(".Search").empty();
            $(".unhandled_Issues").empty();
            $("#refreshContainer").empty();
            questDetail($(this).attr("id"),$(this).attr("messageId"));
        },
        recovery_Problem:function(){ //回复问题
            recoveryP_roblem($(".questDetail").attr("messageId"),'recovery_Problem');
        },
        add_Problem:function(){ //追加问题
            recoveryP_roblem($(".questDetail").attr("messageId"),'add_Problem');
        },
        end_Problem:function(){
            end_Problem($(".questDetail").attr("id"));
        },
        questclose:function(){
            $(".questDetailHtml").empty();
            $(".my_Question").css("display","block");
            my_Question();
        },
        colose_Problem:function(){
            $(".questDetailHtml").empty();
            $(".my_Question").css("display","block");
            my_Question();
        }
    }


    //我创建的分享
    personal_ShareDiv = function () {
        var pageIndex = 1;
        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/sharePage.css");
            dynamicLoading.js("../../../webAppJs/js/sharePage.js");
            var shareSearch =
                '<div class="shareSearch" style="top: 0;">' +
                '<input type="search" name="search" placeholder="搜索" autocomplete="off" class="layui-input search" data-type="search"><span class="BIM-iconfont BIMpaixu" data-type="personal_sort" type="desc"></span>' +
                '</div>';
            var sharePage =
                '<div class="sharePage">' +
                '<div class="share_list_content">' +
                '</div>' +
                '</div>';
            $(".Search").append(shareSearch);
            $("#refreshContainer").append(sharePage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }

        $.ajax({
            url: getRootPath() + '/bim/modelShare/myModelShareList',
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
                            '<span class="share_Subordinate layui-elip">' + item.projectName + '</span>' +
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
            if (type == "personal_sort"){
                clickType = "sort";
            }else if( type == "colse_link" ){
                clickType = "colse_link";
                OpenHtml = "indiv_Share";
            }
            active[type] ? active[type].call(this) : '';
        });

        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                clickType = "search";
                $(".share_list_content").empty();
                personal_ShareDiv();
            }
        })
    }

    //我的问题
    my_Question = function(){
        let my_Question =
    '<div class="Question">' +
        '<p data-type="weidu"><span class="BIM-iconfont BIMfenxiang"></span><span>未处理的问题</span><span class="BIM-iconfont BIMyoujiantou"></span><span class="layui-badge-dot"></span></p>' +
        '<p data-type="yidu"><span class="BIM-iconfont BIMwenti"></span><span>已处理的问题</span><span class="BIM-iconfont BIMyoujiantou"></span><span class="layui-badge-dot"></span></p>' +
    '</div>';
        $(".my_Question").append(my_Question);

        //获取未读数量
        $.ajax({
            url: getRootPath() + "/bim/api/message/getReadNum",
            type: "post",
            cache: false,
            async: false,
            data: {
                readStatus: "weidu"
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.data != "0"){
                    if(data.data > "9") {
                        $(".Question p:first-child .layui-badge-dot").html("9+");
                    }else {
                        $(".Question p:first-child .layui-badge-dot").html(data.data);
                    }
                    $(".Question p:first-child .layui-badge-dot").show();
                }else{
                    $(".Question p:first-child .layui-badge-dot").hide();
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

        //获取已读数量
        $.ajax({
            url: getRootPath() + "/bim/api/message/getReadNum",
            type: "post",
            cache: false,
            async: false,
            data: {
                readStatus: "yidu"
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.data != "0"){
                    if(data.data > "9") {
                        $(".Question p:last .layui-badge-dot").html("9+");
                    }else {
                        $(".Question p:last .layui-badge-dot").html(data.data);
                    }
                    $(".Question p:last-child .layui-badge-dot").show();
                }else{
                    $(".Question p:last-child .layui-badge-dot").hide();
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

        $('.Question p').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //未处理的问题
    unhandled_Issues = function(){
        status = "weichuli";
        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/questionPage.css");
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
            $(".unhandled_Issues").append(QuestPage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }

        $.ajax({
            url: getRootPath() + '/bim/api/message/selectMessagePage',
            type: "post",
            cache: false,
            async: false,
            data: {
                // pageSize: "10",
                // problemName: $("input[name='search']").val() == undefined ? '' : $("input[name='search']").val(),
                // pageNum: pageIndex, //页码
                // sort: "createTime",
                // rule: $(".questionSearch .BIMpaixu").attr("type") //排序方法
                status: "weichuli",
                currentPage: pageIndex, //页码
                pageSize: "10"
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
                    $.each(data.data, function (index, item) {
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
                            '<div class="question_list" id=' + item.id + ' messageId='+ item.messageId +' data-type="questDetail">' +
                            '<div class="question_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="question_content">' +
                            '<div class="question_explicit">' +
                            '<div class="question_top layui-elip question_name">' + item.problemName + '<span class="projectName">'+ item.projectName +'</span></div>' +
                            '<div class="question_bot">' +
                            '<span class="question_time">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.createTime) + '</span>' +
                            '<span class="question_grade"><span class="BIM-iconfont BIMdengji" style="color: ' + gradeColor + ';"></span>' + item.grade + '</span>' +
                            '<span class="question_Subordinate layui-elip">' + item.sendPersonName + '</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            ' </div>' +
                            '</div>';
                        $(".question_list_content").append(QuestDiv);
                        if (item.readStatus == "weidu"){
                            debugger
                            $("#"+item.id).addClass("fontWeight");
                        }
                    })

                    if (pageIndex != 1 && data.data == "") {
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

        $('.question_list').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //已处理的问题
    issues_Addressed = function(){
        status = "yichuli";
        if (clickType == "" && ($("input[name='search']").val() == "" || $("input[name='search']").val() == undefined)) {
            dynamicLoading.css("../../../webAppJs/css/questionPage.css");
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
            $("#refreshContainer").append(QuestPage);
        } else if (clickType == "sort" || clickType == "onRefreshStart") {
            pageIndex = 1;
        }

        $.ajax({
            url: getRootPath() + '/bim/api/message/selectMessagePage',
            type: "post",
            cache: false,
            async: false,
            data: {
                // pageSize: "10",
                // problemName: $("input[name='search']").val() == undefined ? '' : $("input[name='search']").val(),
                // pageNum: pageIndex, //页码
                // sort: "createTime",
                // rule: $(".questionSearch .BIMpaixu").attr("type") //排序方法
                status: "yichuli",
                currentPage: pageIndex, //页码
                pageSize: "10"
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
                    $.each(data.data, function (index, item) {
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
                            '<div class="question_list" id=' + item.id + ' messageId='+ item.messageId +' data-type="questDetail">' +
                            '<div class="question_left">' +
                            '<img src="../../../webAppJs/images/default.png" alt="">' +
                            '</div>' +
                            '<div class="question_content">' +
                            '<div class="question_explicit">' +
                            '<div class="question_top layui-elip question_name">' + item.problemName + '</div>' +
                            '<div class="question_bot">' +
                            '<span class="question_time">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.createTime) + '</span>' +
                            '<span class="question_grade"><span class="BIM-iconfont BIMdengji" style="color: ' + gradeColor + ';"></span>' + item.grade + '</span>' +
                            '<span class="question_Subordinate layui-elip">' + item.sendPersonName + '</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            ' </div>' +
                            '</div>';
                        $(".question_list_content").append(QuestDiv);
                    })

                    if (pageIndex != 1 && data.data == "") {
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

        $('.question_list').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }

    //问题详情
    questDetail = function(questId,messageId){
        dynamicLoading.css("../../../webAppJs/css/questDetail.css");
        //详情
        $.ajax({
            url: getRootPath() + "/bim/problem/findOne",
            type: "post",
            cache: false,
            async: false,
            data: {
                id: questId,
                into: "1"
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
                            '<div class="questDetail" id=' + item.id + ' messageId='+ messageId +'>' +
                            '<p><strong>问题名称</strong><span>' + item.problemName + '</span></p>' +
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
                            '<p>' + item.describes + '</p>' +
                            '</div>' +
                            '<p class="soundRecordiv"><strong>问题录音</strong><span class="send Orderprocessing"><span class="arrow"></span><span class="BIM-iconfont BIMyuyin"></span>1\'11\"</span></p>' +
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
                            '<button class="layui-btn layui-btn-indigo" data-type="recovery_Problem">回复问题</button>' +
                            '<button class="layui-btn layui-btn-primary" data-type="questclose">取消</button>' +
                            '<button class="layui-btn layui-btn-indigo" data-type="end_Problem">结束问题</button>' +
                            '<button class="layui-btn layui-btn-primary" data-type="add_Problem">追加问题</button>' +
                            '<button class="layui-btn layui-btn-primary" data-type="colose_Problem">返回</button>' +
                            '</div>';

                        $(".questDetailHtml").append(questDetail);
                    };
                    if(status == "yichuli"){
                        $(".layui-form-item button:nth-child(1)").hide();
                        $(".layui-form-item button:nth-child(2)").hide();
                        $(".layui-form-item button:nth-child(3)").hide();
                        $(".layui-form-item button:nth-child(4)").hide();
                        $(".layui-form-item button:nth-child(5)").show();
                    };
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

        //回复列表
        $.ajax({
            url: getRootPath() + "/bim/api/message/selectMessageInfoList",
            type: "post",
            cache: false,
            async: false,
            data: {
                parentId: messageId
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    $.each(data.data,function(index,item){
                        let record_listDiv =
                            '<div class="record_listDiv">' +
                            '<p><span class="record_name">'+ item.sendPersonName +'</span><span class="record_date">'+ item.createTime +'</span></p>' +
                            '<p class="record_cont">'+ item.info +'</p>' +
                            '</div>';
                        $(".record_list").append(record_listDiv)
                    })
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
        $(".record_list").show();

        //判断是否结束 再次请求  详情接口
        $.ajax({
            url: getRootPath() + "/bim/problem/findOne",
            type: "post",
            cache: false,
            async: false,
            data: {
                id: questId,
                into: "1"
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {
                    if (data.data.isEnd == "1") { // 结束
                        $(".record_listDiv:last-child").after(
                            "<div class='record_listDiv' style='text-align:center;color:#66ad66;'><span class='BIM-iconfont BIMdengji tiops'>问题已经解决</span></div>"
                        );
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

        $('.layui-form-item button').click(function (event) {
            event.stopPropagation();
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

        $(".Orderprocessing").click(function(){
            Orderprocessing();
        })
    }

    //回复问题
    recoveryP_roblem = function(messageId,data_type){
        if (data_type == "recovery_Problem") {
            tiops = "回复该问题"
        }else{
            tiops = "追加该问题"
        }
        let contents = '<div class="recoveryP_roblem"><p><strong>'+ tiops +'</strong></p><textarea maxlength="140" required placeholder="输入内容（不超过140个字）" rows="6" cols="35" name="content"></textarea><div class="layui-clear"></div></div>'
        BIM.open({
            title: false,
            anim: 'up',
            content: contents,
            btn: ['保存', '取消'],
            yes: function (index) {
                if ($("input[name='content']").val() == "") {
                    BIM.open({
                        type: 4,
                        content: '请输入内容',
                        skin: 'msg',
                        time: 1.5
                    });
                } else {
                    $.ajax({
                        url: getRootPath() + "/bim/api/message/addMessageInfo",
                        type: "post",
                        cache: false,
                        async: false,
                        data: {
                            id: messageId,
                            info: $("textarea[name='content']").val()
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (data) {
                            if (data.success == true) {
                                BIM.close(index);
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
            },
            no: function (index) {
                BIM.close(index);
            }
        });

        $(".recoveryP_roblem").parent("div.layui-m-BIMcont").css("padding", "15px 20px");
    };

    //结束问题
    end_Problem = function(problemId){
        $.ajax({
            url: getRootPath() + "/bim/api/message/updateMessageEnd",
            type: "post",
            cache: false,
            async: false,
            data: {
                problemId: problemId,
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                if (data.success == true) {

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
    };

    //获取信息
    function getUsreTiops(){
        $.ajax({
            url: getRootPath() +"/bim/queryUserInfo",
            type: "post",
            cache: false,
            async: false,
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                sessionStorage.Jurisdiction = (data.message);
                sessionStorage.userName = (data.data.userName);
                sessionStorage.phoneNumber = (data.data.phoneNumber);
                sessionStorage.department = (data.data.department);
                sessionStorage.icon = (data.data.icon);

            },
            error: function () {
                BIM.open({
                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                    skin: 'msg',
                    time: 2
                });
            }
        });
    };

    $('.homepage p').click(function (event) {
        event.stopPropagation();
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

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

    window.onscroll = function () {
        var scrollT = document.documentElement.scrollTop || document.body.scrollTop; //滚动条的垂直偏移
        var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight; //元素的整体高度
        var clientH = document.documentElement.clientHeight || document.body.clientHeight; //元素的可见高度
        if (scrollT == scrollH - clientH) {
            // console.log("到底部了");
            pageIndex++;
            if (status == "weichuli") {
                clickType = "onscroll";
                unhandled_Issues();
            }else{
                clickType = "onscroll";
                issues_Addressed();
            }
        } else if (scrollT < scrollH - clientH) {
            // console.log("到顶了")
        }
    }
})


