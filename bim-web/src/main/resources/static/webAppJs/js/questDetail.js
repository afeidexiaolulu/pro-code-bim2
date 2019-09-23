$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var element = layui.element;

        active = {
            del: function () {
                let remove_thisid = $(this).prev("img").attr("id");
                let THIS_IMG = $(this).parent("li");
                $.ajax({
                    url: getRootPath() + "/bim/problem/deleteOneImg",
                    type: "post",
                    cache: false,
                    async: false,
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
                            BIM.open({
                                content: data.message,
                                skin: 'msg',
                                time: 3
                            });
                        } else {
                            BIM.open({
                                content: '删除成功',
                                skin: 'msg',
                                time: 3
                            });
                            THIS_IMG.remove();
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
            questEdit: function () {
                $(".layui-form-item button:eq(0)").remove();
                $(".layui-form-item button").before('<button class="layui-btn layui-btn-indigo" data-type="firm">确定</button>');
                $(".grade").attr("data-type", "grade");
                $(".BIMguanbi").show();
                $(".BIMdeleteluyin").show();

                if ($(".problemImg ul li").length > 0) {
                    $(".add").show();
                    questButton();
                } else {
                    $(".problemImg").empty();
                    let problemImg = '<ul id="uploader"><li data-type="addImg"><span class="BIM-iconfont BIMxinzeng"></span></li></ul>';
                    $(".problemImg ").append(problemImg);
                    questButton();
                }

                uploaderIMG();
            },
            firm: function () {
                $(".layui-form-item button:eq(0)").remove();
                $(".layui-form-item button").before('<button class="layui-btn layui-btn-indigo" data-type="questEdit">编辑</button>');
                $(".grade").removeAttr("data-type");
                $(".add").hide();
                $(".BIMguanbi").hide();
                $(".BIMdeleteluyin").hide();

                questButton();

                // 修改问题
                BIM.open({
                    title: false,
                    anim: 'up',
                    content: "是否修改本问题？",
                    btn: ['是', '否'],
                    yes: function () {
                        $.ajax({
                            url: getRootPath() + "/bim/problem/update",
                            type: "post",
                            cache: false,
                            async: false,
                            data: {
                                id: $(".questDetail").attr("id"),
                                problemName: $("span.projectName").html(),
                                grade: $(".grade").html(),
                                describe: $(".describe").html(),
                                problemDescribeRecording:audioMP3
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (res) {
                                debugger
                                if (res.success == true) {
                                    BIM.open({
                                        content: res.message,
                                        skin: 'msg',
                                        time: 2
                                    });
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
                        BIM.close(index);
                    },
                    no:function(index){
                        BIM.close(index);
                    }
                })

            },
            questclose: function () {
                $(".BIMdeleteluyin").hide();
                $(".tab-container:nth-of-type(3) .s-pull").empty();
                removejscssfile("questionPage", "css");
                removejscssfile("questionPage", "js");
                QuestDiv();
                stopEven();
            },
            grade: function () {
                $(".iosselect").slideToggle("100");
                let gradeColor = "";
                $(".iosselect ul li").click(function (event) {
                    debugger
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
                    $(".grade").css("color",gradeColor);
                    $(".grade").html($(this).html())
                    $(".iosselect").slideUp();
                    event.stopPropagation();
                })
            },
            BIMdeleteluyin:function(){
                $("audio source").attr("src","");
                $("audio embed").attr("src","");
                $(".send ").hide();
                $(".BIMdeleteluyin").hide();
                $(".BIMhuatong").show();
            }
        }

        function questButton() {
            $('.layui-form-item button,.BIMxinzeng').click(function (event) {
                event.stopPropagation();
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
        }

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

                //开始上传
                uploader.option('formData', {
                    iad: $(".questDetail").attr("id")
                })
                uploader.upload();
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
        }
    });
})