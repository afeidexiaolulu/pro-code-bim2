$(function () {
    // 声明主句柄
    var zhiu_Viewer = {};
    ZhiUTech_ResourcesLoader(_SuccessAction);
    // 加载所需资源 参数为加载成功后的回调
    // 请确定所有操作在回调后执行
    function _SuccessAction() {
        // region 初始化教程
        // 初始化主句柄
        zhiu_Viewer = InitializeZhiUViewer(); // 如果传参数false可以关闭所有内部DebugLog
        // 创建所需div
        let div = document.getElementById('MyViewerDiv');
        let modelPath = 'sesd/zhiu3d.esd'; // 请放入模型地址
        // 初始化viewer结构  参数详见API 该func返回模型GUID
        let model1Index = zhiu_Viewer.L_Initialize(div, modelPath);
        // 根据上述信息生成viewer浏览器
        zhiu_Viewer.L_Build();
        ZhiUTech_MsgCenter.L_AddListener("初始化成功", function () {
            Initialize_ZhiUTech_BoxSelection(zhiu_Viewer);
            Initialize_ZhiUTech_ProgressAnimation(zhiu_Viewer);
            Initialize_ZhiUTech_NewTree(zhiu_Viewer, true);
            Initialize_ZhiUTech_UI(zhiu_Viewer);
            Initialize_ZhiUTech_QRCode(zhiu_Viewer);
            Initialize_ZhiUTech_ThreeJsMaker(zhiu_Viewer);
            Initialize_ZhiUTech_Settings(zhiu_Viewer);
            Initialize_ZhiUTech_CloneGeometry(zhiu_Viewer);
            // ZhiUTech_MsgCenter.L_AddListener("二维码数据页面专用数据",function (arg) {
            //     console.log(" >LJason< 日志：",arg);
            // });
        });
    }

    // region 树状图按键功能
    window._isTreeDivOpen = false;

    function btn_ToggleTreeDivision() {
        window._isTreeDivOpen = !window._isTreeDivOpen;
        zhiu_Viewer.ZhiUTech_NewTree._member.SetDivisionVisibility(window._isTreeDivOpen);
    }
})