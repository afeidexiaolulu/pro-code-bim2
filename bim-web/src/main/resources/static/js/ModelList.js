$(function () {
    layui.use(['table', 'layer'], function () {
        var table = layui.table;
        var layer = layui.layer;
        var $ = layui.$

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
                    window.btnList = ['<span class="iconfont icon-xiazai" lay-event="xiazai"></span>','<span class="iconfont icon-fenxiang" lay-event="fenxiang"></span>'];
                    $.each(data.data, function (key, value) {
                        if (value == "Model:delete") {
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


        function deed() {
            if (parent.$('.ENTRYNAME').attr("id") == null) {
                layer.msg("请选择您要操作的项目哦", {
                    icon: 4
                });
            } else {
                $(".layui-fluid").show();
                active = {
                    reload: function () {
                        let index_ = layer.msg('查询中，请稍后', {
                            icon: 6,
                            time: false,
                            shade: 0
                        });
                        setTimeout(function () {
                            table.reload('test-table-height', {
                                where: {
                                    modelName: $("input[name='QuestionName']").val()
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
                            layer.msg('是否删除当前页所选数据？', {
                                time: 0,
                                btn: ['是', '否'],
                                yes: function (index) {
                                    $.ajax({
                                        url: getRootPath() + "/bim/model/deleteModelBatch?abc=1" + ids.join(""),
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
                                                layer.msg(data.message, {
                                                    icon: 6
                                                });
                                                table.reload(
                                                    'test-table-height', {
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
                            return value.modelImg
                        })
                        for (key in arr) {
                            ids.push("&modelImg=" + arr[key])
                        }
                        if (ids != "") {
                            layer.msg('是否下载当前页所选模型？', {
                                time: 0,
                                btn: ['是', '否'],
                                yes: function (index) {
                                    layer.close(index);
                                    window.open(getRootPath() +
                                        "/bim/file/download?abc=1" + ids.join(""));
                                }
                            });
                        } else {
                            layer.msg('请选择模型后再进行下载！')
                        }
                    },
                    batch_fenxiang: function () {
                        let ids = [];
                        let checkStatus = table.checkStatus('test-table-height'),
                            data = checkStatus.data;
                        let arr = data.map(function (value, index, array) {
                            return value.id
                        })
                        for (key in arr) {
                            ids.push("&ids=" + arr[key])
                        }
                        if (ids != ""){
                            $.ajax({
                                url: getRootPath() + "/bim/modelShare/checkModelShareRepetition?abc=1" + ids.join(""),
                                type: "post",
                                beforeSend: function () {
                                    layer.load(2);
                                },
                                complete: function () {
                                    layer.closeAll('loading');
                                },
                                success: function (data_) {
                                    layer.methodConfig = data;
                                    if (data_.success == true) {
                                        $maskon();
                                        layer.open({
                                            type: 2,
                                            title: "模型分享",
                                            closeBtn: 0,
                                            shade: [.5],
                                            area: ['800px', '550px'],
                                            content: ['shareTwo', 'no'],
                                            end: function () {
                                                location.reload();
                                            }
                                        });
                                    } else {
                                        layer.msg(data_.message);
                                    }
                                },
                                error: function () {
                                    layer.msg("请求失败，请稍后再试", {
                                        icon: 5,
                                        anim: 6
                                    });
                                }
                            })

                        }else{
                            layer.msg('请选择模型后再进行分享！')
                        }
                    }
                }
                $(".newBuild").click(function () {
                    $maskon();
                    layer.open({
                        type: 2,
                        title: "添加模型",
                        closeBtn: 0,
                        shade: [.5],
                        area: ['800px', '550px'],
                        content: ['newBuild', 'no'],
                        end: function () {
                            location.reload();
                        }
                    });
                })
                var modeTable = table.render({
                    elem: '#test-table-height',
                    height: 'full-140',
                    url: getRootPath() + '/bim/model/modelList',
                    skin: 'line',
                    even: true,
                    autoSort: false,
                    where: {
                        modelName: $("input[name='QuestionName']").val() == undefined ? "" : $("input[name='QuestionName']").val()
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
                        pageName: 'pageNo', //页码的参数名称，默认：page
                        limitName: 'pageSize' //每页数据量的参数名，默认：limit
                    },
                    cols: [
                        [ //表头
                            {
                                checkbox: true,
                                LAY_CHECKED: false
                            }, {
                                field: 'id',
                                title: 'id',
                                align: 'center',
                                hide: true
                            }, {
                                field: 'modelImg',
                                title: 'modelImg', //模型地址主键ID
                                align: 'center',
                                hide: true
                            }, {
                                field: 'modelName',
                                title: '模型名称',
                                event: 'setSign',
                                sort: true,
                                align: 'left'
                            }, {
                                field: 'SubordinateProjects',
                                title: '所属项目',
                                align: 'center'
                            }, {
                                field: 'modelSize',
                                title: '模型大小',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'isOpen',
                                title: '是否公开',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'currentVersion',
                                title: '当前版本',
                                align: 'center'
                            }, {
                                field: 'createTime',
                                title: '创建时间',
                                sort: true,
                                align: 'center'
                            },{
                                field: 'createPersonName',
                                title: '创建人',
                                sort: true,
                                align: 'center'
                            },{
                                field: 'score',
                                title: '操作',
                                align: 'center',
                                toolbar: '#barDemo'
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
                            "count": res.data.totalsize, //解析数据长度
                            "data": res.data.datas //解析数据列表
                        };
                    },
                    done: function (res, curr, count) {
                        //如果是异步请求数据方式，res即为你接口返回的信息。
                        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                        // console.log(res);
                        // console.log(curr); //得到当前页码
                        // console.log(count); //得到数据总量
                        $.each($(".laytable-cell-1-0-4"), function (index_, item) {
                            if ($(this).html() == "") {
                                $(this).html(parent.parent.$('.ENTRYNAME').html())
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
                            orderField: obj.field, //排序字段
                            type: obj.type //排序方式
                        },
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });

                    $.each($(".laytable-cell-1-0-4"), function (index_, item) {
                        if ($(this).html() == "") {
                            $(this).html(parent.parent.$('.ENTRYNAME').html())
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
                            content: ['ModelDetails?id=' + data.id, 'no'],
                            end: function () {
                                location.reload();
                            }
                        });
                    } else if (obj.event === 'xiazai') {
                        layer.msg('是否下载？', {
                            time: 0, //不自动关闭
                            btn: ['是', '否'],
                            yes: function (index) {
                                layer.close(index);
                                window.open(getRootPath() + "/bim/file/download?modelImg=" + data.modelImg);
                            }
                        });
                    } else if (obj.event === 'shanchu') {
                        layer.msg('是否删除？', {
                            time: 0, //不自动关闭
                            btn: ['是', '否'],
                            yes: function (index) {
                                $.ajax({
                                    url: getRootPath() + "/bim/model/deleteModelBatch",
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
                                        layer.msg("请求失败，请稍后再试", {
                                            icon: 5,
                                            anim: 6
                                        });
                                    }
                                })
                            }
                        });
                    } else if (obj.event === 'fenxiang') {
                        $.ajax({
                            url: getRootPath() + "/bim/modelShare/checkModelShareRepetition",
                            type: "post",
                            data: {
                                ids: data.id
                            },
                            beforeSend: function () {
                                layer.load(2);
                            },
                            complete: function () {
                                layer.closeAll('loading');
                            },
                            success: function (data_) {
                                layer.methodConfig = data;
                                if (data_.success == true) {
                                    $maskon();
                                    layer.open({
                                        type: 2,
                                        title: "模型分享",
                                        closeBtn: 0,
                                        shade: [.5],
                                        area: ['800px', '350px'],
                                        content: ['shareOne', 'no'],
                                        end: function () {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    layer.msg(data_.message);
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

                /**
                 * 回车/点击查询
                 */
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