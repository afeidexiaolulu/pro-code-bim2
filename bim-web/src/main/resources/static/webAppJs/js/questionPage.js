$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var element = layui.element;
        // iosselect();
        getPower();
        active = {
            sort: function () {
                clickType = "sort";
                $(".tab-container:nth-of-type(3) .question_list_content").empty();
                if ($(this).attr("type") == "desc") {
                    $(this).attr("type", "asc");
                } else {
                    $(this).attr("type", "desc")
                }
                QuestDiv();
                stopEven();
            },
            add: function () {
                addQuestion();
                uploaderIMG();
                getCurrentStaff();
            },
            rename: function () {
                let questionId = $(this).parents(".question_list").attr("id");
                let questionName = $(this).parents(".question_list").children(".question_content").children(".question_explicit").children(".question_name").html();
                const contents =
                    '<div class="layui-m-renameDiv question_rename"><p>重命名问题</p><p>原名称：<span class="oldName layui-elip">' + questionName + '</span></p><p class = "layui-input-row" > 重命名：<input type="text" name="rename" ></p></div>'
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
                                url: getRootPath() + "/bim/problem/update",
                                type: "post",
                                cache: false,
                                async: false,
                                data: {
                                    id: questionId,
                                    problemName: $("input[name='rename']").val()
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
                                            content: "修改成功",
                                            skin: 'msg',
                                            time: 3
                                        });
                                        QuestDiv();
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
                let projectID = $(this).parents(".question_content").parent(".question_list").attr("id")
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: "是否删除此问题？",
                    btn: ['是', '否'],
                    yes: function (index) {
                        $.ajax({
                            url: getRootPath() + "/bim/problem/delete",
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
                        BIM.close(index);
                    },
                    no: function (index) {
                        $(".layui-project-btn").slideUp();
                        BIM.close(index)
                    }
                });
                $("div.layui-m-BIMcont").css("padding", "0.26666666rem");
            },
            questDetail: function () {
                $(".Search").empty();
                let ids = $(this).attr("id");
                $(".tab-container:nth-of-type(3) .s-pull").empty();
                questDetail(ids);
                stopEven();
            },
            more: function () {
                $(this).parents('.question_list').siblings(".question_list").children(".question_content").children(".layui-project-btn").slideUp("100");
                $(this).parents('.More').siblings(".layui-project-btn").slideToggle("100");
                stopEven();
            },
            firm: function () {
                firm();
            },
            close:function(){
                $(".tab-container:nth-of-type(3) .s-pull").empty();
                QuestDiv();
            },
            iosselect: function () {
                $(".grade").show();
                $(".currentStaff").slideUp("100");
                $(".iosselect").slideToggle("100");
                $(".iosselect ul li").click(function (event) {
                    switch ($(this).html()) {
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
                    $(".grade").css("color", gradeColor);
                    $(".grade").html($(this).html())
                    $(".iosselect").slideUp();
                    event.stopPropagation();
                })
            },
            currentStaff:function(){
                $(".iosselect").slideUp("100");
                $(".currentStaff").slideToggle("100");
                $(".currentStaff ul li").click(function(){
                    $(".sending").html($(this).html());
                    $(".sending").attr("name",$(this).val());
                    $(".currentStaff").slideUp("100");
                })
            }
        }

    });

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
                        if (data.data[i] == "Problem:create"){
                            $(".questionSearch .BIMxinzeng").css("display","inline-block");
                            $(".questionSearch input").css("width","80%");
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

    function uploaderIMG() {
        var GUID = WebUploader.Base.guid();
        var $list = $('#uploader');
        var uploader = WebUploader.create({
            server: getRootPath() + '/bim/problem/create',
            formData: {
                "guid": GUID
            },
            pick: '.add',
            resize: false,
            duplicate: false,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            method: 'POST'
        });
        // 当有文件被添加进队列的时候
        uploader.on('fileQueued', function (file) {
            let $li = $( //<img src=' + getRootPath() + item.img + ' id=' + item.id + ' alt="" />
                    '<li id="' + file.id + '" class="screenshotIMG"><img><span class="BIM-iconfont BIMguanbi" data-type="del" style="display: inline;"></span>' +
                    '<div class="state">等待上传</div>' +
                    '</li>'),
                $img = $li.find('img');
            $list.append($li);
            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr('src', src);
            }, 100, 100);
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active percentage"></div>').appendTo($li).find('.progress-bar');
            }
            $li.find('div.state').html('上传中');
            $('#' + file.id).find(".percentage").html(parseInt(percentage * 100) + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, response) {
            if(response.success == true){
                problemId = response.data;
                return false;
            }
            $('#' + file.id).find('div.state').html('已上传');
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('div.state').html('上传出错');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('div.state').fadeOut();
            $('#' + file.id).find('.progress').fadeOut();
        });

        //所有文件上传完毕
        uploader.on("uploadFinished", function () {
            addNewlyParame();
            $('.BIMguanbi').click(function (event) {
                event.stopPropagation();
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            BIM.open({
                content: '添加成功',
                skin: 'msg',
                time: 3
            });
        });


        firm = function () {
            if ($("input[name='QuestionName']").val() == "" || $("input[name='QuestionName']").val().length == 15) {
                BIM.open({
                    content: '请填写不超过15个字的项目名称',
                    skin: 'msg',
                    time: 3
                });
            } else if ($(".grade").html() == "") {
                BIM.open({
                    content: '请选择重要等级',
                    skin: 'msg',
                    time: 3
                });
            } else if ($("textarea[name='QuestionDescribe']").val() == "" || $("textarea[name='QuestionDescribe']").val().length == 80) {
                BIM.open({
                    content: '请填写不超过80个字的项目简介',
                    skin: 'msg',
                    time: 3
                });
            } else {
                //开始上传
                uploader.option('formData', {
                    problemName: $("input[name='QuestionName']").val(),
                    grade: $(".grade").html(),
                    describe: $("textarea[name='QuestionDescribe']").val(),
                    problemDescribeRecording: audioMP3
                })
                uploader.upload();

                $(".tab-container:nth-of-type(3) .s-pull").empty();
                QuestDiv();
            }
        }
    }

    function getCurrentStaff(){
        //询当前项目成员
        $.ajax({
            url: getRootPath() + "/bim/api/user/selectUserByProject",
            type: "post",
            cache: false,
            async: false,
            data: {
                projectId: GetQueryString("id")
            },
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (res) {
                $(".currentStaff ul li").remove();
                if (res.data != "" || res.data != null) {
                    let str = "";
                    $.each(res.data, function (index, item) {
                        str += "<li value=" + item.id + " >" + item.userName + "</li>";
                    });
                    $(".currentStaff ul").append(str);
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

    function addNewlyParame(){
        if (problemId != ""){
            $.ajax({
                url: getRootPath() + "/bim/api/message/insert",
                type: "post",
                cache: false,
                async: false,
                data: {
                    receivePerson: $(".sending").attr("name"),
                    info: $("textarea[name='QuestionDescribe']").val(),
                    problemId: problemId
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (res) {
                    debugger
                },
                error: function () {
                    BIM.open({
                        content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                        skin: 'msg',
                        time: 2
                    });
                }
            })
        }else{
            BIM.open({
                content: 'ID\u4e22\u5931\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458',
                skin: 'msg',
                time: 2
            });
        }
    }

    document.addEventListener("touchmove", function (event) {
        $(".layui-project-btn").slideUp();
        event.stopPropagation();
    })
})