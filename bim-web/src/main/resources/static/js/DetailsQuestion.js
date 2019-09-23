$(function () {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var projectID = getParameterFromUrl("id");

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
                        if (value == "Problem:edition") {
                            $(".btnClass").append(
                                '<button type="button" class="layui-btn" id="edit">编辑</button><button type="button" class="layui-btn" id="hold">保存</button>'
                            );
                            return false;
                        }
                    })
                    deed();
                } else {
                    layer.msg(data.message, {
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

        /**
         * 一系列操作
         */
        function deed() {
            /**
             * 获取操作项目
             */
            if (projectID == "") {
                layer.msg("项目ID不存在，请联系管理员", {
                    icon: 5,
                    anim: 6
                });
            } else {
                $(".layui-fluid").show();
                /**
                 * 获取问题详情和人员列表
                 */
                $.ajax({
                    url: getRootPath() + "/bim/problem/findOne",
                    type: "post",
                    data: {
                        id: projectID
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        if (data.success == true) {
                            /**
                             * 判断判断问题的紧急情况更换图表显示
                             */
                            window.HTMLgrade  = data.data.problemOne.grade;
                            switch (data.data.problemOne.grade) {
                                case "十分重要":
                                    $(".grade").html("<span class='iconfont icon-jinggaotianchong' style='color:#D43031'></span>");
                                    break;
                                case "重要":
                                    $(".grade").html("<span class='iconfont icon-jinggaotianchong' style='color:#FFC325'></span>");
                                    break;
                                case "不重要":
                                    $(".grade").html("<span class='iconfont icon-jinggaotianchong' style='color:#1890FB'></span>");
                                    break;
                                case "普通":
                                    $(".grade").html("<span class='iconfont icon-jinggaotianchong' style='color:#00B8AC'></span>");
                                    break;
                            }
                            $(".projectName").html(data.data.problemOne.problemName == null ? "暂无数据" : data.data.problemOne.problemName);
                            $(".problemScreenshots").html(data.data.problemOne.problemScreenshots == null ? "暂无数据" : data.data.problemOne.problemScreenshots);
                            $(".createTime").html(data.data.problemOne.createTime == null ? "暂无数据" : data.data.problemOne.createTime);
                            $(".describe").html(data.data.problemOne.describes == null ? "暂无数据" : data.data.problemOne.describes);
                            edit();
                            // 问题截图
                            let HorizontalRolling = "";
                            $.each(data.data.problemImg, function (key, value) {
                                HorizontalRolling += '<div class="screenshotIMG"><div class="cmdlist-container"><a href="javascript:;"></span><div class="imgDiv"><img id=' + value.id + ' src="' + getRootPath() + value.img + '"></div></a></div></div>'
                            })
                            $(".HorizontalRolling").append(HorizontalRolling);

                            /**
                             * 图片全屏显示
                             */
                            $('.imgDiv img').click(function () {
                                //获取图片路径
                                var imgsrc = $(this).attr("src");
                                window.open(imgsrc);
                            });

                            if (data.data.problemImg.length > 6) {
                                BeautifyScroll(".HorizontalRolling");
                            }
                        } else {
                            layer.msg("请求失败", {
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

                /**
                 * 编辑
                 */
                function edit() {
                    $("#edit").click(function () {
                        let selectGrade = '<div class="layui-form"><div class="layui-form-item"><div class="layui-input-block"><select name="grade"><option value="十分重要">十分重要</option><option value="重要">重要</option><option value="普通">普通</option><option value="不重要">不重要</option></select></div></div></div>'
                        $("span.projectName").attr("contenteditable", true);
                        $(".layui-div span.grade ").empty();
                        $(".cmdlist-text .price:last-child() .layui-div").append(selectGrade);
                        form.render('select');
                        var selectOption = 'dd[lay-value=' + HTMLgrade + ']';
                        $("select[name='grade']").siblings("div.layui-form-select").find("dl").find(selectOption).click();
                        form.render();
                        $("p.describe").attr("contenteditable", true);
                        layer.tips('开始修改吧~', 'span.projectName');
                        $("span.projectName").addClass("modify");
                        $("select[name='grade']").addClass("modify");
                        $("p.describe").addClass("modify");
                        $("#hold").show();
                        $(".screenshotIMG .cmdlist-container a").append("<span class='iconfont icon-shanchu remove_this'>")
                        $(".add").show();
                        uploaderIMG(); /** 上传*/
                        remove_this(); /**删除图片 */
                        $("#hold").click(function () {
                            if ($("select[name='grade'] option:selected").val() == "") {
                                layer.msg("请选择重要性！",{
                                    icon: 5,
                                    anim: 6
                                })
                            }else{
                                layer.msg('你确定修改？', {
                                    time: 0,
                                    btn: ['是', '否'],
                                    yes: function (index) {
                                        layer.close(index);
                                        $.ajax({
                                            url: getRootPath() + "/bim/problem/update",
                                            type: "post",
                                            data: {
                                                id: projectID,
                                                problemName: $("span.projectName").html(),
                                                grade: $("select[name='grade'] option:selected").text(),
                                                describe: $(".describe").html()
                                            },
                                            beforeSend: function () {
                                                layer.load(2);
                                            },
                                            complete: function () {
                                                layer.closeAll('loading');
                                            },
                                            success: function (data) {
                                                if (data.success == true) {
                                                    window.HTMLgrade  = $("select[name='grade'] option:selected").text();
                                                    /**
                                                     * 判断判断问题的紧急情况更换图表显示
                                                     */
                                                    switch ($("select[name='grade'] option:selected").text()) {
                                                        case "十分重要":
                                                            $(".grade").append("<span class='iconfont icon-jinggaotianchong' style='color:#D43031'></span>");
                                                            $("select[name='grade']").remove();
                                                            break;
                                                        case "重要":
                                                            $(".grade").append("<span class='iconfont icon-jinggaotianchong' style='color:#FFC325'></span>");
                                                            $("select[name='grade']").remove();
                                                            break;
                                                        case "不重要":
                                                            $(".grade").append("<span class='iconfont icon-jinggaotianchong' style='color:#1890FB'></span>");
                                                            $("select[name='grade']").remove();
                                                            break;
                                                        case "普通":
                                                            $(".grade").append("<span class='iconfont icon-jinggaotianchong' style='color:#00B8AC'></span>");
                                                            $("select[name='grade']").remove();
                                                            break;
                                                    }
                                                    layer.msg("\u4fee\u6539\u6210\u529f", {
                                                        icon: 6
                                                    });
                                                    debugger
                                                    $(".layui-div div.layui-form").remove();
                                                    $(".add").hide();
                                                    $(".screenshotIMG .cmdlist-container a span.icon-shanchu").remove();
                                                    $("#hold").hide();
                                                    $("span.projectName").attr("contenteditable", false);
                                                    $("p.describe").attr("contenteditable", false);
                                                    $("span.projectName").removeClass("modify");
                                                    $("select[name='grade']").removeClass("modify");
                                                    $("p.describe").removeClass("modify");
                                                } else if (data.success == false) {
                                                    layer.msg(data.message, {
                                                        icon: 5
                                                    });
                                                    $(".layui-div div.layui-form").remove();
                                                    $(".add").hide();
                                                    $(".screenshotIMG .cmdlist-container a span.icon-shanchu").remove();
                                                    $("#hold").hide();
                                                    $("span.projectName").attr("contenteditable", false);
                                                    $("p.describe").attr("contenteditable", false);
                                                    $("span.projectName").removeClass("modify");
                                                    $("select[name='grade']").removeClass("modify");
                                                    $("p.describe").removeClass("modify");
                                                }
                                            },
                                            error: function () {
                                                layer.msg("请求失败，请稍后再试", {
                                                    icon: 5,
                                                    anim: 6
                                                });
                                            }
                                        })
                                    },
                                    btn2: function () {
                                        $(".add").hide();
                                        $(".screenshotIMG .cmdlist-container a span.iconfont").remove();
                                        $("#hold").hide();
                                        $("span.projectName").attr("contenteditable", false);
                                        $("p.describe").attr("contenteditable", false);
                                        $("span.projectName").removeClass("modify");
                                        $("select[name='grade']").removeClass("modify");
                                        $("p.describe").removeClass("modify");
                                    }
                                });
                            }
                        })
                    })
                }

                /**
                 * 上传
                 */
                function uploaderIMG() {
                    var GUID = WebUploader.Base.guid();
                    var $list = $('#uploader');
                    var uploader = WebUploader.create({
                        server: getRootPath() + '/bim/problem/createImg',
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
                        let $li = $(
                                '<div id="' + file.id + '" class="screenshotIMG"><img>' +
                                '<p class="state">等待上传</p>' +
                                '</div>'),
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
                        }, 240, 240);

                        //开始上传
                        uploader.option('formData', {
                            iad: getParameterFromUrl("id")
                        })
                        uploader.upload();
                    });

                    // 文件上传过程中创建进度条实时显示。
                    uploader.on('uploadProgress', function (file, percentage) {
                        var $li = $('#' + file.id),
                            $percent = $li.find('.progress .progress-bar');
                        // 避免重复创建
                        if (!$percent.length) {
                            $percent = $('<div class="progress progress-striped active percentage"></div>')
                                .appendTo($li).find('.progress-bar');
                        }
                        $li.find('p.state').text('上传中');
                        $('#' + file.id).find(".percentage").html(parseInt(percentage * 100) + '%');
                    });

                    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                    uploader.on('uploadSuccess', function (file, response) {
                        $('#' + file.id).find('p.state').text('已上传');
                    });

                    // 文件上传失败，显示上传出错。
                    uploader.on('uploadError', function (file) {
                        $('#' + file.id).find('p.state').text('上传出错');
                    });

                    // 完成上传完了，成功或者失败，先删除进度条。
                    uploader.on('uploadComplete', function (file) {
                        $('#' + file.id).find('.progress').fadeOut();
                    });

                    //所有文件上传完毕
                    uploader.on("uploadFinished", function () {
                        if ($("input[name='QuestionName']").val() == "" || $("select[name='ImportantLevel']").val() == "" || $("textarea[name='QuestionDescribe']").val() == "" || $(".screenshotIMG").length < 1) {

                        } else {
                            layer.msg('添加成功', {
                                icon: 6,
                                anim: 6
                            });
                        }
                    });
                }

                /**
                 * 删除图片
                 */
                function remove_this() {
                    $(".remove_this").click(function () {
                        let remove_thisid = $(this).prev("div.imgDiv").children("img").attr("id");
                        let THIS_IMG = $(this).parent("a").parent("div.cmdlist-container").parent('.screenshotIMG');
                        if (remove_thisid == "") {
                            layer.msg("图片信息丢失，请联系管理员", {
                                icon: 5,
                                anim: 6
                            });
                        } else {
                            $.ajax({
                                url: getRootPath() + "/bim/problem/deleteOneImg",
                                type: "post",
                                data: {
                                    id: remove_thisid
                                },
                                beforeSend: function () {
                                    layer.load(2);
                                },
                                complete: function () {
                                    layer.closeAll('loading');
                                },
                                success: function (data) {
                                    if (data.success == false) {
                                        layer.msg(data.message, {
                                            icon: 5,
                                            anim: 6
                                        });
                                    } else {
                                        layer.msg("删除成功", {
                                            icon: 6,
                                            anim: 6,
                                            time: 800
                                        }, function () {
                                            THIS_IMG.remove()
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
                    })
                }
            }

            $("#Drawing div,#Model div").mouseover(function () {
                $(this).children("em").css("display", "block");
            }).mouseout(function () {
                $(this).children("em").css("display", "none");
            })
            $("i.layui-icon-delete").click(function () {
                //alert("删除")
            })

            let heightList = $(".ParkManagement").height();
            // alert(heightList - (heightList*0.22))
            $("#Drawing").css("height", heightList)
            $(".Model div.cmdlist-text").css("height", heightList - (heightList * 0.16))
            BeautifyScroll("#Drawing")
            BeautifyScroll("#Model")
        }
    })
})