$(function(){
    layui.use(['layer'], function () {
        var layer = layui.layer;

        $.ajax({
            url: getRootPath() +"/bim/queryUserInfo",
            type: "post",
            cache: false,
            async: false,
            beforeSend: function () {
                layer.load(2);
            },
            complete: function () {
                layer.closeAll('loading');
            },
            success: function (data) {
                sessionStorage.Jurisdiction = (data.message);
                sessionStorage.userName = (data.data.userName);
                sessionStorage.phoneNumber = (data.data.phoneNumber);
                sessionStorage.department = (data.data.department);
                sessionStorage.icon = (data.data.icon);

            },
            error: function () {
                BIM.open({
                    content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
                    skin: 'msg',
                    time: 2
                });
            }
        });
    })
})