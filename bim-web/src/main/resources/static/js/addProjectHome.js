$(function () {
    layui.use(['form', 'layer', 'upload'], function () {
        var upload = layui.upload;
        var $ = layui.$;
        var layer = layui.layer;
        var form = layui.form;
        var element = layui.element;

        form.verify({
            ProjectName: function (value, item) {
                if (value.length <= 0) {
                    return '请输入项目名称';
                }
            },
            ProjectSite: function (value) {
                if (value.length <= 0) {
                    return '请输入项目地点';
                }
            },
            ProjectManager: function (value) {
                if (value.length <= 0) {
                    return '请搜索选择项目经理';
                }
            },
            ProjectProfile: function (value) {
                if (value.length <= 0) {
                    return '请输入项目简介';
                }
            },
            fileImg: function (value) {
                if (value.length <= 0) {
                    return '\u8bf7\u4e0a\u4f20\u56fe\u7247';
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

        // 搜索选择下拉框
        var val = "";
        $("input[name='ProjectManager']").bind('input propertychange', function () {
            val = $(this).val();
            $.ajax({
                url: getRootPath() + "/bim/project/user",
                type: "post",
                data: {
                    userName: val
                },
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (res) {
                    if (res.data != "" || res.data != null) {
                        str = ""
                        addStr = "<option value=''>请搜索选择项目经理</option>"
                        $("select[name='ProjectManager']").html("");
                        $.each(res.data, function (index, item) {
                            str += "<option value=" + item.id + " >" + item.name + "</option>";
                        });

                        $("select[name='ProjectManager']").append(addStr + str);
                        form.render('select');
                        $("div.layui-unselect").addClass("layui-form-selected")

                        form.on("select", function (data) {
                            $("input[name='ProjectManager']").val(data.elem[data.elem.selectedIndex].text); //html
                            $("input[name='ProjectManager']").attr("id", data.value);
                            $("div.layui-unselect").removeClass("layui-form-selected");
                            // console.log(data.elem); //得到select原始DOM对象
                            // console.log(data.value); //得到被选中的值
                            // console.log(data.othis); //得到美化后的DOM对象
                        });
                    }
                },
                error: function () {
                    layer.msg("请求失败，请稍后再试", {
                        icon: 5,
                        anim: 6
                    });
                }
            });
        });


        //上传
        //实例化
        var GUID = WebUploader.Base.guid(); //一个GUID
        var uploader = WebUploader.create({
            server: getRootPath() + '/bim/project/create', //服务器地址
            formData: {
                "guid": GUID
            },
            pick: '#add', // 选择文件的按钮。可选.
            resize: false,
            duplicate: false,
            fileNumLimit: 1,
            //只允许选择图片
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            method: 'POST'
        });
        // 当有文件被添加进队列的时候
        uploader.on('fileQueued', function (file) {
            $("input[name='fileImg']").val(file.name)
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            layer.load(2);
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, response) {
            layer.closeAll('loading');
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            layer.closeAll('loading');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            layer.closeAll('loading');
        });

        //所有文件上传完毕
        uploader.on("uploadFinished", function () {
            layer.msg('\u6dfb\u52a0\u6210\u529f', {
                icon: 6
            });
            let index = parent.layer.getFrameIndex(window.name);
            setTimeout(function () {
                parent.layer.close(index)
            }, 2000);
        });

        // 验证文件格式以及文件大小
        uploader.on("error", function (type) {
            if (type == "Q_TYPE_DENIED") {
                layer.msg("文件格式错误");
            } else if (type == "Q_EXCEED_NUM_LIMIT") {
                layer.msg("超出数量限制");
            } else {
                layer.msg("上传出错！");

            }
        });

        //开始上传
        $("#yes").click(function () {
            if ($("input[name='ProjectName']").val() == "" || $("input[name='ProjectSite']").val() == "" ||  $("textarea[name='ProjectProfile']").val() == "" || $("input[name='ProjectManager']").val() == "" || $("input[name='fileImg']").val() == "") {
                
            }else if($("input[name='ProjectManager']").attr("id") == undefined || $("input[name='ProjectManager']").attr("id") == ""){
                layer.msg('请搜索选择项目经理', {
                    icon: 5,
                    anim: 6,
                    time: 800
                },function(){
                    $("input[name='ProjectManager']").val("");
                });
            } else {
                uploader.option('formData', {
                    projectName: $("input[name='ProjectName']").val(), //名称
                    ProjectAddress: $("input[name='ProjectSite']").val(), //地址
                    projectDescription: $("textarea[name='ProjectProfile']").val(), //描述
                    project_manager: $("select[name='ProjectManager']").val() //经理 id
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