$(function () {
    layui.use(['table', 'layer', 'form'], function () {
        eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('0 2=1.2;0 3=1.3;0 4=1.4;0 $=1.$;',5,5,'var|layui|table|layer|form'.split('|'),0,{}))

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
                    deed();
                } else {
                    layer.msg(data.message, {
                        icon: 5
                    });
                }
            },
            error: function () {
                layer.msg("获取权限失败，请联系管理员", {
                    icon: 5
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
            if (parent.$('.ENTRYNAME').attr("id") == null) {
                layer.msg("请选择您要操作的项目哦", {
                    icon: 4
                });
            } else {
                $(".layui-fluid").show();
                /**
                 * 操作
                 */
                active = {
                    // 搜索
                    reload: function () {
                        // 重载
                        let index_ = layer.msg('查询中，请稍后', {
                            icon: 16,
                            time: false,
                            shade: 0
                        });
                        setTimeout(function () {
                            table.reload('test-table-height', {
                                where: {
                                    modelName: $("input[name='fileName']").val()
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
                            layer.msg('是否删除当前所选数据？', {
                                time: 0, //不自动关闭
                                btn: ['是', '否'],
                                yes: function (index) {
                                    $.ajax({
                                        url: getRootPath() +
                                            "/bim/modelShare/deleteModelShareBatch?abc=1" +
                                            ids.join(""),
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
                                                layer.msg("批量删除模型成功", {
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
                                            layer.msg("请求失败");
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
                            layer.msg('是否下载当前所选页模型？', {
                                time: 0, //不自动关闭
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
                        let checkStatus = table.checkStatus('test-table-height'),
                            data = checkStatus.data;
                        layer.methodConfig = {data:data,success:true};
                        if (data != ""){
                            $maskon();
                            layer.open({
                                type: 2,
                                title: "模型分享",
                                closeBtn: 0,
                                shade: [.5],
                                area: ['800px', '550px'],
                                content: ['../model/linkTwo', 'no'],
                                end: function () {
                                    location.reload();
                                }
                            });
                        }else{
                            layer.msg('请选择模型后再进行分享！')
                        }
                    }
                }

                /**
                 * table
                 */
                var modeTable = table.render({
                    elem: '#test-table-height',
                    height: 'full-140',
                    url: getRootPath() + '/bim/modelShare/modelShareList',
                    skin: 'line',
                    even: true,
                    autoSort: false,
                    where: {
                        modelName: $("input[name='fileName']").val() == undefined ? "" : $("input[name='fileName']").val()
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
                                type: 'checkbox'
                            }, {
                                field: 'id',
                                title: 'id',
                                align: 'center',
                                hide: true
                            }, {
                                field: 'modelName',
                                title: '分享文件',
                                sort: true,
                                align: 'left'
                            }, {
                                field: 'SubordinateProjects',
                                title: '所属项目',
                                align: 'center'
                            }, {
                                field: 'createPersonName',
                                title: '创建人',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'startSharingTime',
                                title: '分享时间',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'shareDay',
                                title: '链接有效期',
                                sort: true,
                                align: 'center'
                            }, {
                                field: 'endSharingTime',
                                title: '结束分享时间',
                                align: 'center',
                                sort: true,
                            }, {
                                field: 'shareStatu',
                                title: '分享状态',
                                align: 'center',
                                templet: '#switchTpl',
                                sort: true,
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
                        /**
                         * 获取所属项目
                         */
                        $.each($(".laytable-cell-1-0-3"), function (index_, item) {

                            if ($(this).html() == "") {
                                $(this).html(parent.parent.$('.ENTRYNAME').html())
                            }
                        });
                        /**
                         * 重新赋值有效期
                         */
                        $.each($(".laytable-cell-1-0-6"), function (index_, item) {
                            if ($(this).html() != "36500" && $(this).html() != "3" && $(this).html() != "5" && $(this).html() != "7"){
                                $(this).html($(this).html());
                            }else if(Number($(this).html()) == "36500"){
                                $(this).html("永久");
                            } else {
                                $(this).html($(this).html() + "天");
                            }
                        });
                        /**
                         * 重新赋值结束时间
                         */
                        $.each($(".laytable-cell-1-0-7"), function (index_, item) {
                            if($(this).html().slice(0,4) == "2999"){
                                $(this).html("--")
                            }
                        });
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

                    /**
                     * 获取所属项目
                     */
                    $.each($(".laytable-cell-1-0-3"), function (index_, item) {
                        if ($(this).html() == "") {
                            $(this).html(parent.parent.$('.ENTRYNAME').html())
                        }
                    });
                    /**
                     * 重新赋值有效期
                     */
                    $.each($(".laytable-cell-1-0-6"), function (index_, item) {
                        if ($(this).html() != "36500" && $(this).html() != "3" && $(this).html() != "5" && $(this).html() != "7"){
                            $(this).html($(this).html());
                        }else if(Number($(this).html()) == "36500"){
                            $(this).html("永久");
                        } else {
                            $(this).html($(this).html() + "天");
                        }
                    });
                    /**
                     * 重新赋值结束时间
                     */
                    $.each($(".laytable-cell-1-0-7"), function (index_, item) {
                        if($(this).html().slice(0,4) == "2999"){
                            $(this).html("--")
                        }
                    });
                });

                /**
                 * 监听工具条
                 */
                table.on('tool(test-table-height)', function (obj) {
                    var data = obj.data;
                    if (obj.event === 'shanchu') {
                        layer.msg('是否删除？', {
                            time: 0, //不自动关闭
                            btn: ['是', '否'],
                            yes: function (index) {
                                $.ajax({
                                    url: getRootPath() + "/bim/modelShare/deleteModelShareBatch",
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
                        var i = $.base64.encode("id="+data.id);
                        $("input[name='fenxiangUrl']").val("");
                        $("input[name='fenxiangUrl']").val(getRootPath() + "/bim/modelShare/modelLightWeightShare?" + i)
                        $("input[name='fenxiangUrl']").select();
                        document.execCommand("copy");
                        layer.msg("复制成功",{icon:6,anim:6,time:800});
                    }
                });

                //监听分享状态
                form.on('switch(shareStatu)', function (data) {
                    // console.log(data.elem); //得到checkbox原始DOM对象
                    // console.log(data.elem.checked); //开关是否开启，true或者false
                    // console.log(data.value); //开关value值，也可以通过data.elem.value得到
                    // console.log(data.othis); //得到美化后的DOM对象
                    let selectIfKey = data.othis;
                    let parentTr = selectIfKey.parents("tr");
                    let dataField = $(parentTr).find("td:eq(1)").find(".layui-table-cell").text();
                    let x = data.elem.checked;
                    $.ajax({
                        url: getRootPath() + "/bim/modelShare/modelShareStatuChange",
                        type: "post",
                        data: {
                            modelShareId: dataField
                        },
                        beforeSend: function () {
                            layer.load(2);
                        },
                        complete: function () {
                            layer.closeAll('loading');
                        },
                        success: function (obj) {
                            if (obj.success == true) {
                                if (obj.message == "链接更新成功") {
                                    layer.msg(obj.message);
                                } else if (obj.message == "链接已到期,无法开启") {
                                    data.elem.checked = !x;
                                    form.render();
                                    layer.msg( obj.message + '，是否修改有效期？', {
                                        time: 0, //不自动关闭
                                        btn: ['是', '否'],
                                        yes: function (index) {
                                            $maskon();
                                            let dataId = $(parentTr).find("td:eq(1)").find(".layui-table-cell").text();
                                            let dataName = $(parentTr).find("td:eq(2)").find(".layui-table-cell").text();
                                            dataList={dataName:dataName,dataId:dataId}
                                            layer.methodConfig = dataList;
                                            layer.close(index);
                                            layer.open({
                                                type: 2,
                                                title: "修改链接有效期",
                                                closeBtn: 0,
                                                shade: [.5],
                                                area: ['800px', '350px'],
                                                content: ['validPeriod', 'no'],
                                                end: function () {
                                                    location.reload();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    layer.msg(obj.message);
                                    data.elem.checked = !x;
                                    form.render();
                                }
                            } else if (obj.success == false) {
                                layer.msg(obj.message);
                                data.elem.checked = !x;
                                form.render();
                            }
                        },
                        error: function () {
                            layer.msg("请求失败");
                        }
                    })
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