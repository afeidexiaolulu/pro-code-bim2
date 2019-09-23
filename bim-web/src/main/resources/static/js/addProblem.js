$(function () {
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        var $ = layui.$

        form.verify({
            QuestionName: function (value, item) {
                debugger
                if (value.length > 20) {
                    return '问题名称仅限20字';
                }else if (value.length <= 0 ) {
                    return '请输入问题名称';
                }
            },
            ImportantLevel: function (value) {
                if (value.length <= 0) {
                    return '请选择重要等级';
                }
            },
            QuestionDescribe: function (value) {
                if (value.length <= 0) {
                    return '请输入问题描述';
                }
            }
        });

        active = {
            close: function () {
                $maskof();
                let index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            }
        }

        $("input[name='SubordinateProjects']").val(parent.parent.parent.$('.ENTRYNAME').html());

        //上传
        //实例化
        var GUID = WebUploader.Base.guid();
        var $list = $('#uploader');
        var uploader = WebUploader.create({
            server: getRootPath() + '/bim/problem/create',
            formData: {
                "guid": GUID
            },
            pick: '.Add',
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
                    '<p class="state">\u7b49\u5f85\u4e0a\u4f20</p>' +
                    '<span class="iconfont icon-shanchu remove-this"></span>' +
                    '</div>'),
                $img = $li.find('img');
            $list.append($li);
            // 创建缩略图
           

            // 缩略图大小
            let ratio = window.devicePixelRatio || 1
            let thumbnailWidth = 110 * ratio
            let thumbnailHeight = 110 * ratio
            // 如果为非图片文件，可以不用调用此方法。
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr('src', src);
            }, thumbnailWidth, thumbnailHeight); // thumbnailWidth x thumbnailHeight 为 100 x 100

            //删除上传的文件
            $list.on('click', '.remove-this', function () {
                if ($(this).parent().attr('id') == file.id) {
                    uploader.removeFile(file);
                    $(this).parent().remove();
                }
            });
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            let $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active percentage"></div>').appendTo($li).find('.progress-bar');
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
            if ($("input[name='QuestionName']").val() == "" || $("select[name='ImportantLevel']").val() == "" || $("textarea[name='QuestionDescribe']").val() == "") {

            } else {
                if ($(".screenshotIMG").length <= 1) {
                    layer.msg('请上传截图', {
                        icon: 5,
                        anim: 6
                    });
                } else {
                    layer.msg('添加成功', {
                        icon: 6,
                        anim: 6
                    });
                    let index = parent.layer.getFrameIndex(window.name);
                    setInterval(function () {
                        parent.layer.close(index)
                    }, 2000);
                }
            }
        });
        //开始上传
        $("#yes").click(function () {
            if ($(".screenshotIMG").length <= 1) {
                layer.msg('请上传截图', {
                    icon: 5,
                    anim: 6
                });
            }else if ($("textarea[name='QuestionDescribe']").val() == ""){
                layer.msg('请输入问题描述', {
                    icon: 5,
                    anim: 6
                });
            }else{
                uploader.option('formData', {
                    problemName: $("input[name='QuestionName']").val(),
                    grade: $("select[name='ImportantLevel']").val(),
                    describe: $("textarea[name='QuestionDescribe']").val()
                })
                uploader.upload();
            }
        });

        $('.layui-form-item button').click(function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        })
    });
})