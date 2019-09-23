$(function () {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var i = getCaption($.base64.decode(getCaption(document.URL, '?')), "=");
        var k = '\u4e2d\u51b6\u5efa\u7b51\u7814\u7a76\u603b\u9662\u6709\u9650\u516c\u53f8';
        __canvasWM({
            content:k
        })
            if (i == "") {
                layer.msg("项目ID不存在，请联系管理员", {
                    icon: 5,
                    anim: 6
                });
            } else {
                $(".layui-fluid").show();

                $.ajax({
                    url: getRootPath() + "/bim/problem/findOne",
                    type: "post",
                    data: {
                        id: i
                    },
                    beforeSend: function () {
                        layer.load(2);
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    },
                    success: function (data) {
                        if (data.success == true) {
                            switch (data.data.problemOne.grade) {
                                case "十分重要":
                                    $(".grade").html(
                                        "<span class='iconfont icon-jinggaotianchong' style='color:#D43031'></span>"
                                    );
                                    break;
                                case "重要":
                                    $(".grade").html(
                                        "<span class='iconfont icon-jinggaotianchong' style='color:#FFC325'></span>"
                                    );
                                    break;
                                case "不重要":
                                    $(".grade").html(
                                        "<span class='iconfont icon-jinggaotianchong' style='color:#1890FB'></span>"
                                    );
                                    break;
                                case "普通":
                                    $(".grade").html(
                                        "<span class='iconfont icon-jinggaotianchong' style='color:#00B8AC'></span>"
                                    );
                                    break;
                            }
                            $(".projectName").html(data.data.problemOne.problemName == null ?
                                "暂无数据" : data.data.problemOne.problemName);
                            $(".problemScreenshots").html(data.data.problemOne.problemScreenshots ==
                                null ? "暂无数据" : data.data.problemOne.problemScreenshots
                            );
                            $(".createTime").html(data.data.problemOne.createTime == null ?
                                "暂无数据" : data.data.problemOne.createTime);
                            $(".describe").html(data.data.problemOne.describes == null ?
                                "暂无数据" : data.data.problemOne.describes);

                            // 问题截图
                            let HorizontalRolling = "";
                            $.each(data.data.problemImg, function (key, value) {
                                HorizontalRolling +=
                                    '<div class="screenshotIMG"><div class="cmdlist-container"><a href="javascript:;"></span><div class="imgDiv"><img id=' +
                                    value.id + ' src="' + getRootPath() + value.img +
                                    '"></div></a></div></div>'
                            })
                            $(".HorizontalRolling").append(HorizontalRolling);

                            /**
                             * 图片全屏显示
                             */
                            $('.imgDiv img').click(function () {
                                //获取图片路径
                                var imgsrc = $(this).attr("src");
                                window.open(imgsrc)
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
            }

            let heightList = $(".ParkManagement").height();
            // alert(heightList - (heightList*0.22))
            $("#Drawing").css("height", heightList)
            $(".Model div.cmdlist-text").css("height", heightList - (heightList * 0.16))
            BeautifyScroll("#Drawing")
            BeautifyScroll("#Model")

    })
})