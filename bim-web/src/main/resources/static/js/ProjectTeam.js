$(function () {
    layui.use(['layer', 'table', 'form'], function () {
        var layer = layui.layer;
        var table = layui.table;
        var form = layui.form;
        var $ = layui.$;

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
                    window.btnList = [];
                    $.each(data.data, function (key, value) {
                        if (value == "User:add") {  //新建成员
                            $("#power").after(
                                '<button type="button" class="layui-btn layui-btn-sm layui-btn-normal newBuild"><span class="iconfont icon-xinjian"></span>添加成员</button>'
                            );
                        }else if(value == "User:delete"){ //删除成员
                            $("#power").after('<span class="iconfont icon-shanchu" data-type="batch_del"></span>');
                            btnList.push('<span class="iconfont icon-shanchu" lay-event="del"></span>');
                        }else if(value == "User:edition"){
                            btnList.push('<span class="iconfont icon-bianji" lay-event="modify"></span>');
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
                /**
                 * 添加新成员
                 */
                $(".newBuild").click(function () {
                    $maskon();
                    layer.open({
                        type: 2,
                        title: "添加新成员",
                        closeBtn: 0,
                        shade: [.5],
                        area: ['800px', '430px'],
                        content: ['addmembers', 'no'],
                        end: function () {
                            location.reload();
                        }
                    });
                })

                form.on('select(role)', function (data) {
                    table.reload('test-table-height', {
                        where: {
                            queryRole: $("select[name='role']").val()
                        },
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });
                });

                active = {
                    reload: function () {
                        let index_ = layer.msg('查询中，请稍后', {
                            icon: 16,
                            time: false,
                            shade: 0
                        });
                        setTimeout(function () {
                            table.reload('test-table-height', {
                                where: {
                                    MembershipName: $("input[name='MembershipName']").val()
                                },
                                page: {
                                    curr: 1 //重新从第 1 页开始
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
                            $.ajax({
                                url: getRootPath() + "/bim/projectMember/deleteProjectMember?abc=1" + ids.join(""),
                                type: "post",
                                beforeSend: function () {
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
                                        layer.msg(data.message,{icon:5});
                                    }
                                },
                                error: function () {
                                    layer.msg("请求失败，请稍后再试", {
                                        icon: 5,
                                        anim: 6
                                    });
                                }
                            })
                        } else {
                            layer.msg('请选择问题后再进行删除！')
                        }
                    }
                };

                table.render({
                    elem: '#test-table-height',
                    height: 'full-140',
                    url: getRootPath() + '/bim/projectMember/findAllProjectMember',
                    skin: 'line',
                    even: true,
                    autoSort: false,
                    method: "post",
                    // where: {
                    //     MembershipName: $("input[name='MembershipName']").val() == undefined ? "" : $(
                    //         "input[name='MembershipName']").val()
                    // },
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
                                type: 'checkbox'
                            }, {
                                field: 'id',
                                title: '隐藏唯一id',
                                align: 'center',
                                hide: true
                            }, {
                                field: 'userId',
                                title: 'id',
                                align: 'center',
                                hide: true
                            }, {
                                field: 'userName',
                                title: '成员名称',
                                sort: true,
                                align: 'left'
                            }, {
                                field: 'roleName',
                                title: '角色',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'projectName',
                                title: '所属项目',
                                align: 'center'
                            }, {
                                field: 'phoneNumber',
                                title: '手机号',
                                align: 'center'
                            }, {
                                field: 'email',
                                title: '邮箱',
                                align: 'center'
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
                        // console.log(res); //数据
                        // console.log(curr); //得到当前页码
                        // console.log(count); //得到数据总量
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
                            orderCondition: obj.field, //排序字段
                            orderMethod: obj.type //排序方式
                        },
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });
                });

                /**
                 * 监听工具条
                 */
                table.on('tool(test-table-height)', function (obj) {
                    let data = obj.data;
                    if (obj.event === 'del') {
                        layer.msg('\u786e\u5b9a\u5220\u9664\u4e48？', {
                            time: 0, //不自动关闭
                            btn: ['是', '否'],
                            yes: function (index) {
                                $.ajax({
                                    url: getRootPath() + "/bim/projectMember/deleteProjectMember",
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
                                    success: function (data) {
                                        if (data.success == true) {
                                            obj.del();
                                            layer.close(index);
                                        } else {
                                            layer.msg(data.message,{icon: 5});
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
                    } else if (obj.event === 'modify') {
                        layer.methodConfig = data;
                        $maskon();
                        layer.open({
                            type: 2,
                            title: "修改角色",
                            closeBtn: 0,
                            shade: [.5],
                            area: ['800px', '430px'],
                            content: ['modifyRoles', 'no'],
                            end: function () {
                                location.reload();
                            }
                        });
                    }else if (obj.event === 'NoPermission') {
                        layer.msg('您无权处理此数据', {icon: 5,anim:6});
                    }
                });
            }

            $(document).keydown(function (event) {
                if (event.keyCode == 13) {
                    $('.div_search span.icon-sousuo').click();
                }
            });
            $('.div_search span.icon-sousuo,.demoReloadTitle button.delete').click(function () {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            })
        }
    });
})