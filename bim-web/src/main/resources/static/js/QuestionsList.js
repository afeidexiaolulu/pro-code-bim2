$(function () {
    layui.use(['layer', 'table'], function () {
        var layer = layui.layer;
        var $ = layui.$;
        var table = layui.table;

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
                    window.btnList = ['<span class="iconfont icon-fuzhi1" lay-event="fenxiang"></span>'];
                    $.each(data.data, function (key, value) {
                        if (value == "Problem:create") {
                            $("#power").after('<button type="button" class="layui-btn layui-btn-sm layui-btn-normal newBuild"><span class="iconfont icon-xinjian"></span>新建</button>')
                        } else if (value == "Problem:delete") {
                            $(".icon-xiazai").after('<span class="iconfont icon-shanchu" data-type="batch_del"></span>');
                            btnList.push(
                                '<span class="iconfont icon-shanchu" lay-event="shanchu"></span>'
                            );
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

            if (parent.$('.ENTRYNAME').attr("id") == null) {
                layer.msg("请选择您要操作的项目哦", {
                    icon: 4
                });
            } else {
                $(".layui-fluid").show();

                $(".newBuild").click(function () {
                    $maskon();
                    layer.open({
                        type: 2,
                        title: "创建问题",
                        closeBtn: 0,
                        shade: [.5],
                        area: ['800px', '680px'],
                        content: ['addProblem', 'no'],
                        end: function () {
                            location.reload();
                        }
                    });
                })
                /**
                 * 操作
                 */
                active = {
                    // 搜索
                    reload: function () {
                        let index_ = layer.msg('查询中，请稍后', {
                            icon: 16,
                            time: false,
                            shade: 0
                        });
                        setTimeout(function () {
                            table.reload('test-table-height', {
                                where: {
                                    problemName: $("input[name='QuestionName']").val()
                                },
                                page: {
                                    curr: 1
                                }
                            });
                            layer.close(index_)
                        }, 200)
                    },

                    batch_del: function () {
                        let ids = [];
                        let checkStatus = table.checkStatus('test-table-height'),
                            data = checkStatus.data;
                        let arr = data.map(function (value, index, array) {
                            return value.id
                        })
                        for (key in arr) {
                            ids.push("&ids=" + arr[key])
                        }
                        if (ids != "") {
                            layer.msg('是否删除当页所选数据？', {
                                time: 0, //不自动关闭
                                btn: ['是', '否'],
                                yes: function (index) {
                                    $.ajax({
                                        url: getRootPath() + "/bim/problem/delete?abc=1" + ids.join(""),
                                        type: "post",
                                        beforeSend: function () {
                                            layer.close(index);
                                            layer.load(2);
                                        },
                                        complete: function () {
                                            layer.closeAll('loading');
                                        },
                                        success: function (data) {
                                            if (data.success == true) {
                                                table.reload('test-table-height', {
                                                    page: {
                                                        curr: 1
                                                    }
                                                });
                                            } else {
                                                layer.msg(data.message);
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
                            });
                        } else {
                            layer.msg('请选择问题后再进行删除！')
                        }
                    },

                    batch_dwo: function () {
                        let ids = [];
                        let checkStatus = table.checkStatus('test-table-height'),
                            data = checkStatus.data;
                        let arr = data.map(function (value, index, array) {
                            return value.id
                        })
                        for (key in arr) {
                            ids.push("&ids=" + arr[key])
                        }
                        if (ids != "") {
                            layer.msg('是否下载当页所选文档？', {
                                time: 0, //不自动关闭
                                btn: ['是', '否'],
                                yes: function (index) {
                                    layer.close(index);
                                    window.open(getRootPath() + "/bim/problem/PoiWord?abc=1" + ids.join(""));
                                }
                            });
                        } else {
                            layer.msg('请选择问题后再进行下载！')
                        }
                    },

                    batch_fenxiang: function () {
                        let checkStatus = table.checkStatus('test-table-height'),
                            data = checkStatus.data;
                        layer.methodConfig = {
                            data: data,
                            success: true,
                            html:"QuestionsList"
                        };
                        if (data != "") {
                            $maskon();
                            layer.open({
                                type: 2,
                                title: "问题分享",
                                closeBtn: 0,
                                shade: [.5],
                                area: ['800px', '550px'],
                                content: ['../model/linkTwo', 'no'],
                                end: function () {
                                    location.reload();
                                }
                            });
                        } else {
                            layer.msg('请选择问题后再进行分享！')
                        }
                    }
                };

                table.render({
                    elem: '#test-table-height',
                    height: 'full-140',
                    url: getRootPath() + '/bim/problem/findAll',
                    skin: 'line',
                    even: true,
                    autoSort: false,
                    where: {
                        problemName: $("input[name='QuestionName']").val() == undefined ? "" : $("input[name='QuestionName']").val()
                    },
                    // 分页配置
                    page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                        theme: '#1E9FFF',
                    },
                    limit: 30,
                    limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    text: {
                        none: '暂无相关数据' //默认：无数据。注：该属性为 layui 2.2.5 开始新增
                    },
                    request: {
                        pageName: 'pageNum', //页码的参数名称，默认：page
                        limitName: 'pageSize' //每页数据量的参数名，默认：limit
                    },
                    cols: [
                        [ //表头
                            {
                                type: 'checkbox'
                            }, {
                                field: 'id',
                                title: 'id',
                                align: 'center',
                                hide: true
                            }, {
                                field: 'problemName',
                                title: '问题名称',
                                event: 'setSign',
                                sort: true,
                                align: 'left'
                            }, {
                                field: 'parentId',
                                title: '所属项目',
                                align: 'center'
                            }, {
                                field: 'createPerson',
                                title: '创建人',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'createTime',
                                title: '创建时间',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'grade',
                                title: '重要等级',
                                sort: true,
                                align: 'center',
                            }, {
                                field: 'score',
                                title: '操作',
                                align: 'center',
                                toolbar: '#score'
                            }
                        ]
                    ],
                    response: {
                        statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                    },
                    parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                        return {
                            "code": res.success = true ? "200" : "400", //解析接口状态
                            "msg": res.success = true ? "获取数据成功" : "获取数据失败", //解析提示文本
                            "count": res.data.total, //解析数据长度
                            "data": res.data.list //解析数据列表
                        };
                    },
                    done: function (res, curr, count) {
                        //如果是异步请求数据方式，res即为你接口返回的信息。
                        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                        // console.log(res);
                        // console.log(curr); //得到当前页码
                        // console.log(count); //得到数据总量
                        $.each($(".laytable-cell-1-0-6"), function (index_, item) {
                            /**
                             * 重新判断判断问题的紧急情况
                             */
                            switch ($(this).html()) {
                                case "十分重要":
                                    $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#D43031'></span>");
                                    break;
                                case "重要":
                                    $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#FFC325'></span>");
                                    break;
                                case "不重要":
                                    $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#1890FB'></span>");
                                    break;
                                case "普通":
                                    $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#00B8AC'></span>");
                                    break;
                            }
                        })
                    }
                });
                /**
                 * 监听排序事件 
                 */
                table.on('sort(test-table-height)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                    // console.log(obj.field); //当前排序的字段名
                    // console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
                    // console.log(this); //当前排序的 th 对象
                    // 服务器排序
                    table.reload('test-table-height', {
                        initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。
                        where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                            sort: obj.field, //排序字段
                            rule: obj.type //排序方式
                        },
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });

                    $.each($(".laytable-cell-1-0-6"), function (index_, item) {
                        /**
                         * 判断判断问题的紧急情况
                         */
                        switch ($(this).html()) {
                            case "十分重要":
                                $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#D43031'></span>");
                                break;
                            case "重要":
                                $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#FFC325'></span>");
                                break;
                            case "不重要":
                                $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#1890FB'></span>");
                                break;
                            case "普通":
                                $(this).html("<span class='iconfont icon-jinggaotianchong' style='color:#00B8AC'></span>");
                                break;
                        }
                    })
                });
                /**
                 * 监听工具条
                 */
                table.on('tool(test-table-height)', function (obj) {
                    var data = obj.data;
                    if (obj.event === 'setSign') {
                        layer.open({
                            type: 2,
                            title: false,
                            closeBtn: 1,
                            area: ['100%', '100%'],
                            content: ['detailsQuestion?id=' + data.id, 'no'],
                            end: function () {
                                location.reload();
                            }
                        });
                    } else if (obj.event === 'xiazai') {
                        layer.msg('\u662f\u5426\u4e0b\u8f7d？', {
                            time: 0, //不自动关闭
                            btn: ['是', '否'],
                            yes: function (index) {
                                layer.close(index);
                                window.open(getRootPath() + "/bim/problem/PoiWord?ids=" + data.id);
                            }
                        });
                    } else if (obj.event === 'shanchu') {
                        layer.msg('是否删除？', {
                            time: 0, //不自动关闭
                            btn: ['是', '否'],
                            yes: function (index) {
                                $.ajax({
                                    url: getRootPath() + "/bim/problem/delete",
                                    type: "post",
                                    data: {
                                        ids: data.id
                                    },
                                    beforeSend: function () {
                                        layer.close(index);
                                        layer.load(2);
                                    },
                                    complete: function () {
                                        layer.closeAll('loading');
                                    },
                                    success: function (data) {
                                        if (data.success == true) {
                                            obj.del();
                                        } else {
                                            layer.msg(data.message);
                                        }
                                    },
                                    error: function () {
                                        layer.msg(data.message);
                                    }
                                })
                            }
                        });
                    } else if (obj.event === 'fenxiang') {
                        let i = $.base64.encode("id=" + data.id);
                        $("input[name='fenxiangUrl']").val("");
                        $("input[name='fenxiangUrl']").val(getRootPath() + "/bim/problem/detailsShare?" + i)
                        $("input[name='fenxiangUrl']").select();
                        document.execCommand("copy");
                        layer.msg("复制成功",{icon:6,anim:6,time:800});
                    }
                });


                $(document).keydown(function (event) {
                    if (event.keyCode == 13) {
                        $('.div_search span.icon-sousuo').click();
                    }
                });
                $('.div_search span.icon-sousuo,.demoReloadTitle span.iconfont').click(function () {
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                })
            }
        }
    });
})