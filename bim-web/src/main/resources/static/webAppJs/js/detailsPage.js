$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;



        active = {
            edit: function () { //编辑
                $("span.projext_name").attr("contenteditable", true);
                $("span.projectAddress").attr("contenteditable", true);
                $("p.projectDescription").attr("contenteditable", true);
                $(".replace").show();

                uploaderIMG();

                $(".layui-form-item button:eq(0)").remove();
                $(".layui-form-item").append('<button class="layui-btn layui-btn-indigo" data-type="firm">确定</button>');
                $(".layui-form-item").append('<button class="layui-btn layui-btn-primary" data-type="close">取消</button>');
                reset();
                layer.tips('可以修改咯~', '.projext_name', {
                    tips: [4, '#01529f'],
                    time: 500
                });
            },
            close: function () { //取消
                $("span.projext_name").removeAttr("contenteditable");
                $("span.projectAddress").removeAttr("contenteditable");
                $("p.projectDescription").removeAttr("contenteditable");
                $(".replace").hide();

                $(".layui-form-item button:eq(0)").before('<button class="layui-btn layui-btn-indigo" data-type="edit">编辑</button>');
                $(".layui-form-item button:eq(1)").remove();
                $(".layui-form-item button:eq(1)").remove();
                $(".layui-btn").css("padding", "0 0.8rem");
                reset();
            },
            firm: function () { //确定
                $("span.projext_name").removeAttr("contenteditable");
                $("span.projectAddress").removeAttr("contenteditable");
                $("p.projectDescription").removeAttr("contenteditable");
                $(".replace").hide();

                $(".layui-form-item button:eq(0)").before('<button class="layui-btn layui-btn-indigo" data-type="edit">编辑</button>');
                $(".layui-form-item button:eq(1)").remove();
                $(".layui-form-item button:eq(1)").remove();
                $(".layui-btn").css("padding", "0 0.8rem");

                BIM.open({
                    title: false,
                    anim: 'up',
                    content: '确定修改？',
                    btn: ['确认', '取消'],
                    yes: function (index) {
                        let src = $(".porject_img img").attr("src");
                        if (src.indexOf('data:image')>-1) {
                            debugger
                            appUpate();
                        } else {
                            debugger
                            edit();
                        }
                    }
                });
                reset();
            }
        }

        $('.layui-form-item button').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

        function reset() {
            $('.layui-form-item button').on('click', function () {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
        }

        //上传
        function uploaderIMG() {
            var GUID = WebUploader.Base.guid();
            var $list = $('#uploader');
            var uploader = WebUploader.create({
                server: getRootPath() + "/bim/project/update",
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
                $(".porject_img img:first-child").remove();
                let $li = $( //<img src=' + getRootPath() + item.img + ' id=' + item.id + ' alt="" />
                        '<li id="' + file.id + '" class="screenshotIMG"><img>' +
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
                }, $('#' + file.id).width(), $('#' + file.id).width() / 1.5);
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

            appUpate = function () {
                //开始上传
                uploader.option('formData', {
                    projectId: GetQueryString("id"),
                    projectName: $("span.projext_name").html(),
                    projectDescription: $("p.projectDescription").text(),
                    ProjectAddress: $("span.projectAddress").html()
                })
                uploader.upload();
            }
        }

        // 修改
        function edit() {
            $.ajax({
                url: getRootPath() + "/bim/project/update",
                type: "post",
                cache: false,
                async: false,
                data: {
                    projectId: GetQueryString("id"),
                    projectName: $("span.projext_name").html(),
                    projectDescription: $("p.projectDescription").text(),
                    ProjectAddress: $("span.projectAddress").html()
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
                            content: '更新成功',
                            skin: 'msg',
                            time: 3
                        });
                    } else if ((res.success == false)) {
                        BIM.open({
                            content: '\u53d1\u751f\u9519\u8bef',
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

    });
})