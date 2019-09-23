var ZhiUTech_UI;
var tileset = null;

function Initialize_ZhiUTech_UI(core) {
    ZhiUTech_UI = {
        // region 成员
        _zhiu: core,
        zhiu_rightNav: {},
        zhiu_leftNav: {},
        bg: {},
        zhiu_right: {},
        zhiu_left: {},
        ZhiUTech_ModelStructureTree: {},
        ZhiUTech_Features: {},
        ZhiUTech_FullScreen: {},
        ZhiUTech_ToolBar_Right: {},
        ZhiUTech_ToolBar_Left: {},
        //特性筛选 用于默认显示的特性
        ZhiUTech_Features_Filter: ["模型参数", "尺寸标注", "自定义参数"],
        //标注
        ZhiUTech_Features_MarkUp: null,
        isEnterEditMode: false,
        editModeColor: null,
        currentView: null,
        svgstr: null,
        viewstr: null,
        properties: undefined,
        _lastTimeStamp: 0,
        // 用于设置 revit自定义属性 的名称
        _revitPropertyName: "模型参数",
        // 用户自定义特性 的名称
        _customPropertyName: "自定义参数",
        // 甲方限制的文字Key
        limitNameList: undefined,
        // 自定义属性成员
        _customPropertiesMember: undefined,
        // 体积详情的复制内容
        _copyContent:"",
        // 二维码详情页面地址
        _QRCodeHTMLUrl:"http://47.110.44.226:8006/ZhiUTech_QRCode.html",
        // endregion
        /**
         * 初始化按钮
         * @function Init
         */
        Init: function () {
            ZhiUTech_UI.AddToobarRight();
            ZhiUTech_UI.AddToobarLeft();
            ZhiUTech_UI.AddFullScreenButton();
            ZhiUTech_UI.AddFeaturesButton();
            ZhiUTech_UI.AddModelStructureTree();
            ZhiUTech_UI.AddRegionPopup();
            ZhiUTech_UI.AddVolumePopup();
            //初始化标注
            ZhiUTech_UI.InitMarkUp();
            ZhiUTech_UI.AddMarkupBottomToobar();
            ZhiUTech_UI.AddMeasureBottomToobar();
            ZhiUTech_UI.AddSectionBottomToobar();
            ZhiUTech_UI.AddExplodeBottomToobar();
            ZhiUTech_UI.AddVisualAngleSpinner();
            ZhiUTech_UI.GenerateQRCode();
            Initialize_ZhiUTech_FilterWindow(ZhiUTech_UI);
            ZhiUTech_MsgCenter.L_AddListener("特性面板构件选择变更", function (properties) {
                _PropertiesPanel_BackToMainpage();
                _PropertiesPanel_ResetSettings();
                _PropertiesPanel_SortPropertiesArray(properties);
                $(".VisualAngleSpinner_Box_content").hide();
                if (properties) {
                    // properties.splice(2, 0, {
                    //     parent: {name: ZhiUTech_UI._customPropertyName},
                    //     children: [{
                    //         name: "正在加载...",
                    //         value: "请稍后..."
                    //     }],
                    // });
                    _PropertiesPanel_SetCustomPropertiesButtonActive(true);
                    _PropertiesPanel_SetDefaultQRCodeButtonVisible(true);
                } else {
                    _PropertiesPanel_SetCustomPropertiesButtonActive(false);
                    _PropertiesPanel_SetDefaultQRCodeButtonVisible(false);
                }
                ZhiUTech_UI.properties = properties;
                ZhiUTech_UI._PropertiesPanelAction();
                _PropertiesPanel_CustomPropertiesRefresh(properties);
            });
            ZhiUTech_MsgCenter.L_AddListener("首次模型加载成功", (Model) => {
                ZhiUTech_UI.CssCode()
            });// Model为该模型句柄
            ZhiUTech_MsgCenter.L_AddListener("方旋弹窗", function (arg) {
                let msg = arg[0];
                let delay = arg[1];
                let isOpenBackground = arg[2];
                ZhiUTech_UI.PublicWindow(msg, delay, isOpenBackground);
            });
        },
        CssCode: function () {
            if ($(".canvas-wrap").height() <= 850) {
                $(".filterWindow").css("margin-top", "5vh")
                $(".filterWindow").css("height", "47%")
                $(".filterWindow").css("min-height", "588px")
                $(".filter-box").css("margin-bottom", "6px")

            }
            if ($(".canvas-wrap").height() <= 1100) {
                $(".filterWindow").css("margin-top", "15vh")
                $(".filter-box").css("margin-bottom", "13px")
                $(".filterWindow").css("height", "48%")
                $(".filterWindow").css("min-height", "630px")
            }
        },
        //一级菜单部分
        /**
         * Notes:添加全屏按钮
         * @param data 参数
         * @constructor
         */
        AddFullScreenButton: function () {
            ZhiUTech_UI.ZhiUTech_FullScreen = document.createElement('div');
            ZhiUTech_UI.ZhiUTech_FullScreen.className = "zhiu_fullscreen zhiu-button-icon  ZhUfont icon-zuidahua-";
            ZhiUTech_UI._IsFullScreen = false;
            ZhiUTech_UI.ZhiUTech_FullScreen.onclick = () => {
                ZhiUTech_UI._IsFullScreen = !ZhiUTech_UI._IsFullScreen;
                ZhiUTech_MsgCenter.L_SendMsg("全屏开关", ZhiUTech_UI._IsFullScreen);
                ZhiUTech_UI.CssCode()
            };
            ZhiUTech_UI._zhiu.viewer.container.appendChild(ZhiUTech_UI.ZhiUTech_FullScreen);
        },
        /**
         * Notes:添加模型结构树按钮
         * @param data 参数
         * @constructor
         */
        AddModelStructureTree: function () {
            ZhiUTech_UI.ZhiUTech_ModelStructureTree = document.createElement('div');
            ZhiUTech_UI.ZhiUTech_ModelStructureTree.className = "zhiu_leftNav";
            var ModelStructureTree_Button = document.createElement('div');
            ModelStructureTree_Button.className = "zhiu_model_structure_tree ZhUfont icon-qianjin zhiu_left";
            //按钮提示
            var button_tip = document.createElement('div');
            button_tip.className = "zhiu-control-tooltip zhiu-structuretip";
            button_tip.innerHTML = '模型结构树'
            ZhiUTech_UI.ZhiUTech_ModelStructureTree.appendChild(ModelStructureTree_Button);
            ModelStructureTree_Button.appendChild(button_tip);
            var ModelStructureTree_content = document.createElement('div');
            ModelStructureTree_content.className = "ModelStructureTree_content";
            var title = document.createElement('div');
            title.innerHTML =
                '<div class="ModelStructureTree_content_title">' +
                '<div >结构</div>' +
                '<div class="active">分部分项</div>' +
                '</div>' +
                '<div class="ModelStructureTree_search_fix">' +
                '<div class="ModelStructureTree_search">' +
                ' <input oninput="ZhiUTech_UI._ModelStructureTree_OnSearchAction(event)" type="text" placeholder="搜索从这里开始...">' +
                ' <span class="ZhUfont icon-jiansuo-"></span>' +
                '</div>' +
                '</div>' +
                ModelStructureTree_content.appendChild(title);

            var ModelStructureTree_box = document.createElement('div');
            ModelStructureTree_box.className = "ModelStructureTree_box";
            var ModelStructureTree_other = document.createElement('div');
            ModelStructureTree_other.className = "ModelStructureTree_other";
            ModelStructureTree_content.appendChild(ModelStructureTree_box);
            ModelStructureTree_content.appendChild(ModelStructureTree_other);
            var zhiuZTree = document.createElement('div');
            zhiuZTree.className = "ztree";
            zhiuZTree.id = "zhiuZTree";
            ModelStructureTree_other.appendChild(zhiuZTree);
            let zhiuZTreeNormal = document.createElement('div');
            zhiuZTreeNormal.className = "ztree";
            zhiuZTreeNormal.id = "zhiuZTreeNormal";
            ModelStructureTree_box.appendChild(zhiuZTreeNormal);
            ZhiUTech_UI.ZhiUTech_ModelStructureTree.appendChild(ModelStructureTree_content);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(ZhiUTech_UI.ZhiUTech_ModelStructureTree);
            ZhiUTech_MsgCenter.L_SendMsg("ZTREE初始化成功");
            ZhiUTech_UI.zhiu_left = $('.zhiu_left');
            ZhiUTech_UI.zhiu_leftNav = $('.zhiu_leftNav');
            ZhiUTech_UI.showNav(ZhiUTech_UI.zhiu_left, ZhiUTech_UI.zhiu_leftNav, "zhiu_left");
            //
            $('.ModelStructureTree_content_title div:nth-child(1)').click(function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                $('.ModelStructureTree_other').hide();
                $('.ModelStructureTree_box').show();
                ZhiUTech_MsgCenter.L_SendMsg("刷新树状图聚焦位置");
            });
            $('.ModelStructureTree_content_title div:nth-child(2)').click(function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                $('.ModelStructureTree_other').show();
                $('.ModelStructureTree_box').hide();
                ZhiUTech_MsgCenter.L_SendMsg("刷新树状图聚焦位置");
            });
            /*浮动显示tips*/
            $(".zhiu_left").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });
        },
        /**
         * Notes:添加特性按钮
         * @param data 参数
         * @constructor
         */
        AddFeaturesButton: function () {
            ZhiUTech_UI.ZhiUTech_Features = document.createElement('div');
            ZhiUTech_UI.ZhiUTech_Features.className = "zhiu_rightNav";
            var Features_Button = document.createElement('div');
            Features_Button.className = "zhiu_features ZhUfont icon-2fanhui zhiu_right";
            //按钮提示
            var button_tip = document.createElement('div');
            button_tip.className = "zhiu-control-tooltip zhiu-Featurestip";
            button_tip.innerHTML = '特性'
            ZhiUTech_UI.ZhiUTech_Features.appendChild(Features_Button);
            Features_Button.appendChild(button_tip);
            var Features_Content = document.createElement('div');
            Features_Content.className = "Features_Content";
            Features_Content.innerHTML =
                '<div style="height:45px;width: 100%;display: grid;grid-template-columns: 7.5fr 2.5fr">' +
                '<div class="Features_Content_title" id="_PropertiesPanel_TitleName">特性</div>' +
                '<div  id="_PropertiesPanel_DefaultQRCodeButton" >二维码</div>' +
                '</div>' +
                '<div class="Features_Content_title_list">' +
                '<div class="col c2">' +
                '  <div id="custom-show-hide-example"></div>' +
                '</div>' +
                '<div class="Features_Content_bottom">' +
                '<div class="ZhUfont icon-erweima" id="_PropertiesPanel_QRCodeButton" style="font-size: 25px; grid-column-start:1;grid-column-end:2;"></div>' +
                '<div class="ZhUfont icon-bi" id="_PropertiesPanel_CustomPropertiesButton" style="font-size: 20px; grid-column-start:5;grid-column-end:6;pointer-events: none;color: #000000;"></div>' +
                '<div class="ZhUfont icon-chilun" id="_PropertiesPanel_SettingButton" style="font-size: 25px; grid-column-start:6;grid-column-end: 7;"></div>' +
                '</div>' +
                '</div>' +
                '<div class="Features_Content_title_set">' +
                '<div class="Features_set_list">' +
                '<div class="Features_set_list_content"></div>' +
                '<div class="_PropertiesPanel_Button" id="_PropertiesPanel_SettingCanelButton" style="background: #969696; left: 50px;">取消</div>' +
                '<div class="_PropertiesPanel_Button" id="_PropertiesPanel_SettingEnterButton" style="background: #1b2c48; right: -3px;">确定</div>' +
                '</div>' +
                '</div>' +
                '<div class="QRCode_Content_title_set">' +
                '<div class="QRCode_set_list">' +
                '<div class="QRCode_set_list_top">' +
                '<div>名称 <input class="QRCode_set_input" type="text" ></div>' +
                '<div>内容</div>' +
                '</div>' +
                '<div class="QRCode_set_list_content"></div>' +
                '<div id="_PropertiesPanel_QRCodeCanelButton">取消</div>' +
                '</div>' +
                '<div id="_PropertiesPanel_QRCodeEnterButton">确定</div>' +
                '</div>' +
                '<div id="_PropertiesPanel_CustomPropertiesPanel"  style="display: none;height:100%">' +
                '<div id="_PropertiesPanel_CustomPropertiesList" "></div>' +
                '<div class="_PropertiesPanel_Button" id="_PropertiesPanel_CustomPropertiesCanelButton" style="background: #969696; left: 50px;">取消</div>' +
                '<div class="_PropertiesPanel_Button" id="_PropertiesPanel_CustomPropertiesEnterButton" style="background: #1b2c48; right: -3px;">确定</div>' +
                '</div>' +
                '</div>';
            setTimeout(function () {
                _PropertiesPanel_ResetSettings();
                // 初始二维码按键
                $("#_PropertiesPanel_DefaultQRCodeButton").click(function () {
                    console.warn(" >LJason< 警告：");
                    let projectId = undefined;
                    let cookies = document.cookie.split(";");
                    for (let i = 0; i < cookies.length; i++) {
                        if (cookies[i].indexOf("CurrProject") !== -1) {
                            projectId = cookies[i].split("=")[1];
                            break;
                        }
                    }
                    if (projectId) {
                        let temp = [];
                        ZhiUTech_MsgCenter.L_SendMsg("获取当前构件ID", temp);
                        let url = ZhiUTech_UI._QRCodeHTMLUrl;
                        let projectIdString = "ProjectId=" + projectId;
                        let StructureIdString = "StructureId=" + temp[0][0];
                        url = url + "?" + projectIdString + "&" + StructureIdString;
                        console.warn(" >LJason< 警告：要访问的地址", url);
                        $('#ZhiUTech_QRCode_Content').html("");
                        ZhiUTech_UI._zhiu.ZhiUTech_QRCode.L_GetQRCode("ZhiUTech_QRCode_Content", "二维码", url);
                        $(" #QRCodeDivBig").show();
                    } else {
                        ZhiUTech_MsgCenter.L_SendMsg("警告", "该项目目前不支持生成默认二维码功能");
                    }
                });
                //二维码按键
                $("#_PropertiesPanel_QRCodeButton").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName("二维码");
                    $(".Features_Content_title_list").hide()
                    $(".QRCode_Content_title_set").show()
                    $(".Features_Content_title_set").hide()
                    ZhiUTech_MsgCenter.L_SendMsg("获取当前构件子属性", function (arg) {
                        $('.QRCode_set_list_content').html('')
                        $('.QRCode_set_input').val('')
                        if (arg != undefined) {
                            for (var a in arg) {
                                $('.QRCode_set_list_content').append(
                                    '<div class="common-row"> ' +
                                    '  <div class="cell-left">' + '  <div class="cell-left-left" title="' + a + '">' + a + '</div> ' + '  <div class="cell-left-right" title="' + arg[a] + '">' + arg[a] + '</div> ' + '</div> ' +
                                    '  <div class="cell-right"><span class="switch-off " id="QRCode-switch" themeColor="#000" ></span></div> ' +
                                    '</div>')
                            }
                            honeySwitch.init();
                            // switchEvent("#right-switch,#QRCode-switch", function () {
                            // }, function () {
                            // });
                        }

                    });
                });
                //二维码确定
                $(" #_PropertiesPanel_QRCodeEnterButton").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName();
                    $(".QRCode_Content_title_set").hide()
                    $(".Features_Content_title_set").hide()
                    $(".Features_Content_title_list").show()
                    var filter_set_list = $(".QRCode_set_list .switch-on").parent().siblings()
                    var QRCode_Filter = []
                    for (var i = 0; i < filter_set_list.length; i++) {
                        QRCode_Filter.push(filter_set_list[i].innerText)
                    }
                    console.log(QRCode_Filter)//选择的内容
                    var QRCodeVal = $('.QRCode_set_input').val()
                    console.log(QRCodeVal)//input 里的内容
                    //二维码弹窗显示
                    ZhiUTech_UI._QRCode_SetQRCodeContent("ZhiUTech_QRCode_Content", QRCodeVal, QRCode_Filter);
                    $(" #QRCodeDivBig").show()
                    $('.QRCode_set_list_content').html('')
                    // honeySwitch.init();
                });
                //二维码取消
                $(" #_PropertiesPanel_QRCodeCanelButton").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName();
                    $(".QRCode_Content_title_set").hide()
                    $(".Features_Content_title_set").hide()
                    $(".Features_Content_title_list").show()
                    $('.QRCode_set_list_content').html('')
                    // honeySwitch.init();
                    // switchEvent("#right-switch,#QRCode-switch", function () {
                    // }, function () {
                    // });
                })

                // 特性设置按键
                $("#_PropertiesPanel_SettingButton").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName("特性设置");
                    $(".Features_Content_title_list").hide();
                    $(".QRCode_Content_title_set").hide();
                    $(".Features_Content_title_set").show();
                    _PropertiesPanel_ResetSettings();
                    honeySwitch.init();
                });
                // 特性设置确定
                $("#_PropertiesPanel_SettingEnterButton ").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName();
                    $(".QRCode_Content_title_set").hide()
                    $(".Features_Content_title_set").hide()
                    $(".Features_Content_title_list").show()
                    let filter_set_list = $(".Features_set_list .switch-on").parent().siblings();

                    ZhiUTech_UI.ZhiUTech_Features_Filter = []
                    for (let i = 0; i < filter_set_list.length; i++) {
                        ZhiUTech_UI.ZhiUTech_Features_Filter.push(filter_set_list[i].innerText)
                    }

                    ZhiUTech_UI._PropertiesPanelRefresh();
                    $('.Features_set_list_content').html("")
                    // honeySwitch.init();
                });
                // 特性设置取消
                $("#_PropertiesPanel_SettingCanelButton ").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName();
                    $(".QRCode_Content_title_set").hide();
                    $(".Features_Content_title_set").hide();
                    $(".Features_Content_title_list").show();
                    $('.Features_set_list_content').html("")
                    // honeySwitch.init();
                });

                _PropertiesPanel_SetCustomPropertiesButtonActive(false);
                _PropertiesPanel_SetDefaultQRCodeButtonVisible(false);
                // 自定义特性按键
                $("#_PropertiesPanel_CustomPropertiesButton ").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName("自定义参数");
                    $(".QRCode_Content_title_set").hide();
                    $(".Features_Content_title_set").hide();
                    $(".Features_Content_title_list").hide();
                    $("#_PropertiesPanel_CustomPropertiesPanel").show();
                    let temp = [];
                    ZhiUTech_MsgCenter.L_SendMsg("获取当前构件ID", temp);
                    _PropertiesPanel_MakeCustomPropertiesPanelContent(undefined, temp[0][0]);
                    ZhiUTech_MsgCenter.L_SendMsg("根据构件ID获取自定义特性", [temp[0][0], function (arg) {
                        if (arg) {
                            let nowID = [];
                            ZhiUTech_MsgCenter.L_SendMsg("获取当前构件ID", nowID);
                            if (temp[0][0] !== nowID[0][0]) return;
                            _PropertiesPanel_MakeCustomPropertiesPanelContent(arg, temp[0][0]);
                        }
                    }]);
                });
                // 自定义特性确定
                $("#_PropertiesPanel_CustomPropertiesEnterButton ").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName();
                    $(".QRCode_Content_title_set").hide();
                    $(".Features_Content_title_set").hide();
                    $(".Features_Content_title_list").show();
                    $("#_PropertiesPanel_CustomPropertiesPanel").hide();
                    let data = _PropertiesPanel_AssemblyCustomPropertiesData(ZhiUTech_UI._customPropertiesMember);
                    if (data._propertiesAddList.length > 0) {
                        ZhiUTech_MsgCenter.L_SendMsg("添加自定义特性", data._propertiesAddList);
                    }
                    if (data._propertiesDeleteList.length > 0) {
                        ZhiUTech_MsgCenter.L_SendMsg("根据自定义特性GUID删除自定义特性", data._propertiesDeleteList);
                    }
                    ZhiUTech_UI._PropertiesPanelRefresh();
                });
                // 自定义特性取消
                $("#_PropertiesPanel_CustomPropertiesCanelButton ").click(function () {
                    _PropertiesPanel_ChangePropertiesPanelTitleName();
                    $(".QRCode_Content_title_set").hide();
                    $(".Features_Content_title_set").hide();
                    $(".Features_Content_title_list").show();
                    $("#_PropertiesPanel_CustomPropertiesPanel").hide();
                    ZhiUTech_UI._customPropertiesMember = undefined;
                });

            }, 800);

            ZhiUTech_UI.ZhiUTech_Features.appendChild(Features_Content);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(ZhiUTech_UI.ZhiUTech_Features);
            ZhiUTech_UI.zhiu_right = $('.zhiu_right');
            ZhiUTech_UI.zhiu_rightNav = $('.zhiu_rightNav');
            ZhiUTech_UI.showNav(ZhiUTech_UI.zhiu_right, ZhiUTech_UI.zhiu_rightNav, "zhiu_right");
            /*浮动显示tips*/
            $(".zhiu_right").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });

        },
        /**
         * Notes: 添加右边toobar栏
         * @param data 参数
         * @constructor
         */
        AddToobarRight: function () {
            ZhiUTech_UI.ZhiUTech_ToolBar_Right = document.createElement('div');
            ZhiUTech_UI.ZhiUTech_ToolBar_Right.className = "zhiu_toobar_right";
            ZhiUTech_UI._zhiu.viewer.container.appendChild(ZhiUTech_UI.ZhiUTech_ToolBar_Right);

            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_selection', '框选', 'icon-kuangxuan-', ZhiUTech_UI.OpenRegionPopup)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_volume', '体积', 'icon-tiji-', ZhiUTech_UI.OpenVolumePopup)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_markup', '标注', 'icon-xiaoxi1', ZhiUTech_UI.OpenMarkupBottomToobar)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_measure', '测量', 'icon-celiang1', ZhiUTech_UI.OpenMeasureBottomToobar)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_section', '截面', 'icon-jiemian', ZhiUTech_UI.OpenSectionBottomToobar)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_explode', '分解', 'icon-fenjie', ZhiUTech_UI.OpenExplodeBottomToobar)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_retrieval', '检索', 'icon-sousuo', ZhiUTech_UI.OpenRetrievalPopup)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_problem', '增加问题', 'icon-winfo-icon-fankuiwenti', ZhiUTech_UI.OpenAddProblem)
            // ZhiUTech_UI.ToobarAddButtonRight('Zhiu_screenshot', '截图', 'icon-762bianjiqi_jietu', ZhiUTech_UI.OpenScreenshotToobar)
            ZhiUTech_UI.ToobarAddButtonRight('Zhiu_color', '改色', 'icon-yanse', ZhiUTech_UI.OpenColorToobar)
        },
        /**icon-celiang--iconceliang
         * Notes:右边栏添加按钮
         * @param  参数 id ：按钮id ， tips ： 标注 ， iconclass ：按钮类名 ，buttonevent ： 按钮事件
         * @constructor
         */
        ToobarAddButtonRight: function (id, tips, iconClass, buttonEvent) {
            //按钮
            var button = document.createElement('div');
            button.className = "zhiu_toobar_button";
            button.id = id;
            //按钮提示
            var button_tip = document.createElement('div');
            button_tip.className = "zhiu-control-tooltip";
            button_tip.innerHTML = tips
            //按钮图标
            var button_icon = document.createElement('div');
            button_icon.className = "zhiu-button-icon  ZhUfont  " + iconClass;
            //按钮添加提示和图标
            button.appendChild(button_tip);
            button.appendChild(button_icon);
            ZhiUTech_UI.ZhiUTech_ToolBar_Right.appendChild(button);
            //按钮添加事件
            button.onclick = buttonEvent

            /*浮动显示tips*/
            $(".zhiu_toobar_button").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });
            //点击陷入
            $("#Zhiu_retrieval").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                } else {
                    $(this).addClass('boxShadow')
                }

            })

        },
        /**
         * Notes: 添加左边toobar栏
         * @param data 参数
         * @constructor
         */
        AddToobarLeft: function () {
            ZhiUTech_UI.ZhiUTech_ToolBar_Left = document.createElement('div');
            ZhiUTech_UI.ZhiUTech_ToolBar_Left.className = "zhiu_toobar_left";
            ZhiUTech_UI._zhiu.viewer.container.appendChild(ZhiUTech_UI.ZhiUTech_ToolBar_Left);

            ZhiUTech_UI._member = {};
            ZhiUTech_UI._member._toggleMilePost = false;
            ZhiUTech_UI._member._toggleArea = false;

            ZhiUTech_UI.ToobarAddButtonLeft('Zhiu_GIS', 'GIS', 'icon-diqiu', ZhiUTech_UI.GIS);
            // ZhiUTech_UI.ToobarAddButtonLeft('Zhiu_milepost', '里程碑', 'icon-lichengbei2', () => {
            //     ZhiUTech_UI._member._toggleMilePost = !ZhiUTech_UI._member._toggleMilePost;
            //     ZhiUTech_MsgCenter.L_SendMsg("开关里程碑", ZhiUTech_UI._member._toggleMilePost);
            // });
            // ZhiUTech_UI.ToobarAddButtonLeft('Zhiu_workarea', '工区', 'icon-gongqu-', () => {
            //     ZhiUTech_UI._member._toggleArea = !ZhiUTech_UI._member._toggleArea;
            //     ZhiUTech_MsgCenter.L_SendMsg("开关工区", ZhiUTech_UI._member._toggleArea);
            // });

        },
        /**
         * Notes:左边栏添加按钮
         * @param  参数 id ：按钮id ， tips ： 标注 ， iconclass ：按钮类名 ，buttonevent ： 按钮事件
         * @constructor
         */
        ToobarAddButtonLeft: function (id, tips, iconClass, buttonEvent) {
            //按钮
            var button = document.createElement('div');
            button.className = "zhiu_toobar_button";
            button.id = id;
            //按钮提示
            var button_tip = document.createElement('div');
            button_tip.className = "zhiu-control-tooltip";
            button_tip.innerHTML = tips
            //按钮图标
            var button_icon = document.createElement('div');
            button_icon.className = "zhiu-button-icon  ZhUfont  " + iconClass;
            //按钮添加提示和图标
            button.appendChild(button_tip);
            button.appendChild(button_icon);
            ZhiUTech_UI.ZhiUTech_ToolBar_Left.appendChild(button);
            //按钮添加事件
            button.onclick = buttonEvent

            /*浮动显示tips*/
            $(".zhiu_toobar_button").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });

            //点击陷入
            $("#Zhiu_workarea").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                } else {
                    $(this).addClass('boxShadow')
                }

            })
            //点击陷入
            var num = 1
            $("#Zhiu_milepost").click(function () {
                // $(this).siblings().removeClass('boxShadow')
                if (num % 2 == 1) {
                    $("#Zhiu_milepost").addClass('boxShadow')

                } else {
                    $("#Zhiu_milepost").removeClass('boxShadow')
                }
                num++
            })

        },
        //二级菜单弹窗部分
        /**
         * Notes:打开框选
         * @param data 参数
         * @constructor
         */
        OpenRegionPopup: function () {
            ZhiUTech_UI._CloseAllSecondMenu();
            ZhiUTech_UI._BoxSelection_Open(function () {
                $('#regionDivBig').show();
                $("#Zhiu_selection").removeClass('boxShadow');

            });
        },
        /**
         * Notes:添加框选后的体积筛选框
         * @param data 参数
         * @constructor
         */
        AddRegionPopup: function () {
            let regionDiv = document.createElement("div");
            let regionDivBig = document.createElement("div");
            let regionclose = document.createElement("div");
            let regiontext = document.createElement("div");
            let buttonV = document.createElement("div");
            let buttonN = document.createElement("div");
            let regionsure = document.createElement("div");
            let regioncancel = document.createElement("div");
            buttonV.innerHTML = '<input type="checkbox" id ="_boxSelection_volumeFilterCheckBox" style="display: inline; width:16px;  height:16px;"/>' +
                '<span>&nbsp;体积大于&nbsp;&nbsp;&nbsp;</span><input type="text" disabled="true"  id="btnVvalue" placeholder="0" />&nbsp;&nbsp;m³<p id="btnVtip">未输入筛选体积</p>';

            buttonN.innerHTML = '<input type="checkbox" id ="_boxSelection_nameFilterCheckBox" style="display: inline; width:16px;  height:16px;"/>' +
                '<span>&nbsp;忽略构件&nbsp;&nbsp;&nbsp;</span><input type="text" disabled="true"  id="btnNvalue" placeholder="输入构件名称" /><p id="btnNtip">未输入筛选名称</p>';
            regionsure.innerHTML = "确定";
            regioncancel.innerHTML = "取消";
            regionDiv.setAttribute("id", "regionDiv");
            regiontext.setAttribute("id", "regiontext");
            regionDivBig.setAttribute("id", "regionDivBig");
            buttonV.setAttribute("id", "buttonV");
            buttonN.setAttribute("id", "buttonN");

            buttonV.style.display = "flex";
            buttonV.style.alignItems = "center";
            buttonV.style.flexWrap = "wrap";
            buttonN.style.display = "flex";
            buttonN.style.alignItems = "center";
            buttonN.style.flexWrap = "wrap";


            regionclose.setAttribute("id", "regionclose");
            regionsure.setAttribute("id", "regionsure");
            regioncancel.setAttribute("id", "regioncancel");
            regionclose.setAttribute("class", "docking-panel-close ZhUfont icon-cha2");
            regionDivBig.appendChild(regionDiv);
            var regiontitle = document.createElement("div");
            regiontitle.innerHTML = '<div>构件筛选</div>';
            regiontitle.setAttribute("id", "regiontitle");
            regionDiv.appendChild(regiontitle);
            regionDiv.appendChild(regionclose);
            regionDiv.appendChild(regiontext);
            regionDiv.appendChild(regionsure);
            regionDiv.appendChild(regioncancel);
            regiontext.appendChild(buttonV);
            regiontext.appendChild(buttonN);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(regionDivBig);

            // 框选设置 体积筛选 复选框
            $("#_boxSelection_volumeFilterCheckBox").change(function () {
                if (this.checked) {
                    $("#btnVvalue").removeAttr("disabled");
                } else {
                    $("#btnVtip").hide();
                    $("#btnVvalue").attr("disabled", true);
                }
            });
            // 框选设置 名称筛选 复选框
            $("#_boxSelection_nameFilterCheckBox").change(function () {
                if (this.checked) {
                    $("#btnNvalue").removeAttr("disabled");
                } else {
                    $("#btnNtip").hide();
                    $("#btnNvalue").attr("disabled", true);
                }
            });

            $("#btnVvalue").blur(function () {
                if (this.value === "") {
                    $("#btnVtip").show();
                } else {
                    $("#btnVtip").hide();
                }
            });
            $("#btnNvalue").blur(function () {
                if (this.value === "") {
                    $("#btnNtip").show();
                } else {
                    $("#btnNtip").hide();
                }
            });

            regionclose.onclick = function () {
                regionDivBig.style.display = 'none';
                document.getElementById("btnVvalue").value = '';
                document.getElementById("btnNvalue").value = '';
                $("#btnNvalue").attr("disabled", true);
                $("#btnVvalue").attr("disabled", true);
                $("#_boxSelection_volumeFilterCheckBox").prop("checked", false);
                $("#_boxSelection_nameFilterCheckBox").prop("checked", false);
                $("#btnVtip").hide()
                $("#btnNtip").hide()
            }
            regionsure.onclick = function () {
                let IsVchecked = $("#_boxSelection_volumeFilterCheckBox").prop("checked");
                let IsNchecked = $("#_boxSelection_nameFilterCheckBox").prop("checked");

                let elementV = document.getElementById("btnVvalue").value;
                let elementN = document.getElementById("btnNvalue").value;

                if (IsVchecked === false && IsNchecked === false) {
                    regionDivBig.style.display = 'none';
                    document.getElementById("btnVvalue").value = '';
                    document.getElementById("btnNvalue").value = '';
                    $("#btnVtip").hide();
                    $("#btnNtip").hide();
                    $("#btnNvalue").attr("disabled", true);
                    $("#btnVvalue").attr("disabled", true);
                    $("#_boxSelection_volumeFilterCheckBox").attr("checked", false);
                    $("#_boxSelection_nameFilterCheckBox").attr("checked", false);
                    return;
                }

                if (IsVchecked === true) {
                    if (elementV === '') {
                        $("#btnVtip").show();
                    } else {
                        $("#btnVtip").hide()
                        elementV = Number(elementV);
                        ZhiUTech_MsgCenter.L_SendMsg("过滤体积", [elementV, true, true]);
                        $("#btnVvalue").attr("disabled", true);
                        document.getElementById("btnVvalue").value = '';
                        $("#_boxSelection_volumeFilterCheckBox").prop("checked", false);
                        regionDivBig.style.display = 'none';
                    }
                }

                if (IsNchecked === true) {
                    if (elementN === '') {
                        $("#btnNtip").show();
                    } else {
                        $("#btnNtip").hide();
                        setTimeout(function () {
                            ZhiUTech_MsgCenter.L_SendMsg("过滤名称", [elementN, true]);
                        }, 100);
                        $("#btnNvalue").attr("disabled", true);
                        document.getElementById("btnNvalue").value = '';
                        $("#_boxSelection_nameFilterCheckBox").prop("checked", false);
                        regionDivBig.style.display = 'none';
                    }
                }
            };
            regioncancel.onclick = function () {
                regionDivBig.style.display = 'none';
                document.getElementById("btnVvalue").value = '';
                document.getElementById("btnNvalue").value = '';
                $("#btnNvalue").attr("disabled", true);
                $("#btnVvalue").attr("disabled", true);

                $("#_boxSelection_volumeFilterCheckBox").prop("checked", false);
                $("#_boxSelection_nameFilterCheckBox").prop("checked", false);

                $("#btnVtip").hide()
                $("#btnNtip").hide()
            }
            //点击陷入
            $("#Zhiu_selection").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                } else {
                    $(this).addClass('boxShadow')
                }

            })


        },
        /**
         * Notes:打开体积
         * @param data 参数
         * @constructor
         */
        OpenVolumePopup: function () {
            ZhiUTech_UI._CloseAllSecondMenu();
            ZhiUTech_UI._VolumeAction(function (volume) {
                $('#volumeDivBig').show();
                $('#_volumeSummationDiv').html(volume.toFixed(3) + 'm³');
                if (volume === 0) {
                    $('#volumeTablePanel').hide();
                    $('#_volumePanel_CopyToClipboard').hide();
                } else {
                    let copyContent = "分部工程\t分项工程\t构件名称\t构件体积\n";
                    let div = $('#volumeTablePanel');
                    div.show();
                    $('#_volumePanel_CopyToClipboard').show();
                    div.html("");
                    ZhiUTech_MsgCenter.L_SendMsg("获取当前构件体积表格", function (arg) {
                        for (let i = 0; i < arg.length; i++) { //遍历一下json数据 
                            let volume = arg[i].objVolume;
                            if (volume) {
                                volume = parseFloat(volume).toFixed(3) + "m³";
                            } else {
                                volume = "0.000m³"
                            }
                            let fenbugongcheng=arg[i].fenbugongcheng === undefined ? " " : arg[i].fenbugongcheng;
                            let fenxianggongcheng=arg[i].fenxianggongcheng === undefined ? " " : arg[i].fenxianggongcheng;
                            let objName=arg[i].objName === undefined ? " " : arg[i].objName;
                            copyContent += fenbugongcheng + "\t" + fenxianggongcheng + "\t" + objName + "\t" + volume + "\n";
                            let row = _MakeGridRow(fenbugongcheng, fenxianggongcheng, objName, volume); //定义一个方法,返回tr数据  
                            div.append(row);
                        }
                        copyContent+=new Date().toLocaleString();
                        ZhiUTech_UI._copyContent=copyContent;
                    });

                    div.css("width", "500px");
                }
            });

            function _MakeGridRow(fenbugongcheng, fenxianggongcheng, name, volume) {


                let row = document.createElement('tr'); //创建行 
                row.style.display = "grid";
                row.style.gridTemplateColumns = " 1fr 1fr 1fr 1fr";
                row.style.gridTemplateRows = " 1fr 1px";
                row.style.alignItems = "center";

                let temp = document.createElement('div');
                temp.innerHTML = fenbugongcheng;
                temp.style.gridColumn = "1/2";
                row.appendChild(temp);

                temp = document.createElement('div');
                temp.innerHTML = fenxianggongcheng;
                temp.style.gridColumn = "2/3";
                row.appendChild(temp);

                temp = document.createElement('div');
                temp.innerHTML = name;
                temp.style.gridColumn = "3/4";
                row.appendChild(temp);

                temp = document.createElement('div');
                temp.innerHTML = volume;
                temp.style.gridColumn = "4/5";
                row.appendChild(temp);

                temp = document.createElement("div");
                temp.style.background = "#dddddd";
                temp.style.gridRow = "2/3";
                temp.style.gridColumn = "1/5";
                temp.style.height = "100%";
                row.appendChild(temp);

                return row;
            }
        },
        /**
         * Notes: 添加体积框
         * @param data 参数
         * @constructor
         */
        AddVolumePopup: function () {
            var volumeDiv = document.createElement("div");
            var volumeDivBig = document.createElement("div");
            volumeDivBig.setAttribute("id", "volumeDivBig");
            volumeDivBig.setAttribute("class", "popupDivBig");
            volumeDiv.setAttribute("id", "volumeDiv");
            volumeDiv.setAttribute("class", "popupDiv");
            volumeDiv.style.left = "50%";
            volumeDiv.style.top = "50%";
            volumeDiv.style.width = "540px";
            volumeDiv.style.marginTop = "-190.5px";
            volumeDiv.style.marginLeft = "-270px";
            volumeDiv.innerHTML = '<div id="volumetitle" class="popuptitle"><div>体积详情</div></div>' +
                '<div id="volumeclose"  class="popup-close ZhUfont icon-cha2"></div>' +
                '<div id="volumeTablePanelTitle" style="font-size: 14px; display: grid; grid-template-columns: ' + "20px 1fr 1fr 1fr 1fr 20px" + '; grid-template-rows: ' + "1fr 1px" + ';">' +
                '<div style="grid-column:' + "2/3" + '">分部工程</div>' +
                '<div style="grid-column:' + "3/4" + '">分项工程</div>' +
                '<div style="grid-column:' + "4/5" + '">构件名称</div>' +
                '<div style="grid-column:' + "5/6" + '">构件体积</div>' +
                '<div style="grid-column:' + "1/7" + ';grid-row:' + "2/3" + ';height: 100%;background: #dddddd;"></div>' +
                '</div>' +
                '<div  style="width:500px;height:300px; overflow: auto; padding: 20px; padding-top: 0px ">' +
                '<div id="volumeTablePanel" width="500px" style="font-size: 14px; display: grid; grid-auto-rows: auto"></div>' +
                '<div style="text-align: left;">所选构件体积总和：</div>' +
                '<div id="_volumeSummationDiv" style="text-align: center"  >1000m³</div>'+
                '<div id="_volumePanel_CopyToClipboard" >复制到剪切板</div>';

            volumeDivBig.appendChild(volumeDiv);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(volumeDivBig);
            $('#volumeclose').click(function () {
                $('#volumeDivBig').hide()
                $("#Zhiu_volume").removeClass('boxShadow')
            });
            //点击陷入
            $("#Zhiu_volume").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                } else {
                    $(this).addClass('boxShadow')
                }

            });

            $("#_volumePanel_CopyToClipboard").click(function () {
                _CopyToClipboard(ZhiUTech_UI._copyContent);
                ZhiUTech_MsgCenter.L_SendMsg("方旋弹窗",["已复制到剪切板",500,true]);
            });
        },
        /**
         * Notes:打开检索弹框
         * @param data 参数
         * @constructor
         */
        OpenRetrievalPopup: function () {
            ZhiUTech_UI.ZhiUTech_FilterWindow.show();
            ZhiUTech_UI._CloseAllSecondMenu();

        },
        /**
         * Notes:生成二维码弹框 generate QR Code.
         * @param data 参数
         * @constructor
         */
        GenerateQRCode: function () {
            var QRCodeDiv = document.createElement("div");
            var QRCodeDivBig = document.createElement("div");
            QRCodeDivBig.setAttribute("id", "QRCodeDivBig")
            QRCodeDivBig.setAttribute("class", "popupDivBig")
            QRCodeDiv.setAttribute("id", "QRCodeDiv")
            QRCodeDiv.setAttribute("class", "popupDiv")
            QRCodeDiv.innerHTML = '<div id="QRCodetitle" class="popuptitle"><div>二维码</div></div>' +
                '<div id="QRCodeclose"  class="popup-close ZhUfont icon-cha2"></div>' +
                '<div id="ZhiUTech_QRCode_Content" class="QRCodecontent">' +
                // '<div id="erweima"></div>' +
                '</div>'

            QRCodeDivBig.appendChild(QRCodeDiv);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(QRCodeDivBig);
            $('#QRCodeclose').click(function () {
                $('#QRCodeDivBig').hide()
            })
        },
        //二级菜单底部toolbar部分
        /**
         * Notes:打开标注底部二级菜单
         * @param data 参数
         * @constructor
         */
        OpenMarkupBottomToobar: function () {
            ZhiUTech_UI._CloseAllSecondMenu();
            $(".mark_up_toolbar_big").show()

        },
        /**
         * Notes:添加标注底部二级菜单
         * @param data 参数
         * @constructor
         */
        AddMarkupBottomToobar: function () {
            var markuptoolbar = document.createElement("div");
            markuptoolbar.setAttribute("class", "mark_up_toolbar_big")
            markuptoolbar.innerHTML = '<div class="mark_up_toolbar">\n' +
                '            <div id="markupTools" class="" style="">\n' +
                '                <div id="toolbar-markupTool-EditModeFreehand"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-pan_icon ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeFreehand-tooltip" class="zhiu-control-tooltip" >细笔</div>\n' +
                '                </div>\n' +
                '                <div id="newBoxPan" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-bi ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-newBoxPan-tooltip" class="zhiu-control-tooltip" >粗笔</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-EditModeArrow"   class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-ai37 ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeArrow-tooltip" class="zhiu-control-tooltip" >箭头</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-EditModePolyline"   class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-xiantiao ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModePolyline-tooltip" class="zhiu-control-tooltip">线条</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-EditModeRectangle"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-xingzhuang-juxing ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeRectangle-tooltip" class="zhiu-control-tooltip">矩形</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-EditModeCircle" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-yuanxingweixuanzhong ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeCircle-tooltip" class="zhiu-control-tooltip" >圆形</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-EditModeText"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-wenzishezhi- ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeText-tooltip" class="zhiu-control-tooltip" >文字</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-EditModeColor" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon myEditColor ZhUfont"><input type="text" class="editColor" id="picker" style="height:19px;width:27px;border:1px solid #B6B4B6;background-color: #ff8800" readonly=""></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeColor-tooltip" class="zhiu-control-tooltip">选色</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-cancel1" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-chehui ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeCircle1-tooltip" class="zhiu-control-tooltip" >撤销上一步</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-cancelall" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-quanbuchehui- ZhUfont"></div>\n' +
                '                    <div id="toolbar-markupTool-EditModeCircle2-tooltip" class="zhiu-control-tooltip" >撤销全部</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-markupTool-Cancel" class="zhiu_toobar_button zhiu-label-button">\n' +
                '                    <div class="zhiu-button-icon" style="display: none;"></div>\n' +
                '                    <div id="toolbar-markupTool-Cancel-tooltip" class="zhiu-control-tooltip">退出标记</div>\n' +
                '                    <label>退出标记</label>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>'
            ZhiUTech_UI._zhiu.viewer.container.appendChild(markuptoolbar);
            /*浮动显示tips*/
            $(".zhiu_toobar_button").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });
            //标注点击陷入
            $("#Zhiu_markup").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                    $(".mark_up_toolbar_big").hide()
                } else {
                    $(this).addClass('boxShadow')
                    $(".mark_up_toolbar_big").show()
                }

            })
            //close
            $("#toolbar-markupTool-Cancel").click(function () {
                $(".mark_up_toolbar_big").hide()
            })
            //各种点击事件
            //细画笔
            $("#toolbar-markupTool-EditModeFreehand").click(function () {
                ZhiUTech_UI.Markup_DiffType("EditModeFreehand")
            })
            //粗画笔
            $("#newBoxPan").click(function () {
                ZhiUTech_UI.Markup_DiffTypeWeight("EditModeFreehand")
            })
            //箭头
            $("#toolbar-markupTool-EditModeArrow").click(function () {
                ZhiUTech_UI.Markup_DiffType("EditModeArrow")
            })
            //线条
            $("#toolbar-markupTool-EditModePolyline").click(function () {
                ZhiUTech_UI.Markup_DiffTypeWeight("EditModePolyline")
            })
            //矩形
            $("#toolbar-markupTool-EditModeRectangle").click(function () {
                ZhiUTech_UI.Markup_DiffTypeWeight("EditModeRectangle")
            })
            //圆
            $("#toolbar-markupTool-EditModeCircle").click(function () {
                ZhiUTech_UI.Markup_DiffTypeWeight("EditModeCircle")
            })
            //文字
            $("#toolbar-markupTool-EditModeText").click(function () {
                ZhiUTech_UI.Markup_DiffTypeWeight("EditModeText")
            })
            //撤销上一步
            $("#toolbar-markupTool-cancel1").click(function () {
                ZhiUTech_UI.ZhiUTech_Features_MarkUp.undo()
            })
            //撤销全部
            $("#toolbar-markupTool-cancelall").click(function () {
                ZhiUTech_UI.ZhiUTech_Features_MarkUp.clear()
            })
            //退出标记
            $("#toolbar-markupTool-Cancel").click(function () {
                ZhiUTech_UI.ZhiUTech_Features_MarkUp.leaveEditMode();
                ZhiUTech_UI.ZhiUTech_Features_MarkUp.hide()
                $(".mark_up_toolbar_big").hide()
                $("#Zhiu_markup").removeClass('boxShadow')
                $("#toolbar-markupTool-Cancel").removeClass('boxShadow')
                ZhiUTech_UI.Markup_Leave()
            })
            //颜色拾取器
            var editColor = document.getElementsByClassName("myEditColor")[0]
            editColor.innerHTML = '<input type="text" class="editColor" id="picker" style="height:19px;width:27px;border:1px solid #B6B4B6;background-color: #ff8800" readonly></input>'
            $('#picker').ColorPicker({
                layout: 'rgbhex',
                color: 'ff8800',
                onSubmit: function (hsb, hex, rgb, el) {
                    $(el).css('background-color', '#' + hex);
                    $(el).ColorPickerHide();
                    var thisColor = $("#hex")[0].value
                    console.log(thisColor)
                    var style = {};
                    style["stroke-color"] = "#" + thisColor;
                    ZhiUTech_UI.editModeColor = style
                    ZhiUTech_UI.ZhiUTech_Features_MarkUp.setStyle(style);

                }
            });


        },
        InitMarkUp: function () {
            // debugger

            ZhiUTech_UI.ZhiUTech_Features_MarkUp = new ZhiUTech.Viewing.Extensions.Markups.Core.MarkupsCore(ZhiUTech_UI._zhiu.viewer);
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.load();//标注初始化
            ZhiUTech_UI.isEnterEditMode = false
            var style = {};
            style["stroke-color"] = "#ff8800";
            ZhiUTech_UI.editModeColor = style //标注默认颜色
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.show();
        },
        /**
         * Notes:标注方法
         * @param data 参数
         * @constructor
         */
        Markup_DiffType: function (type) {
            if (ZhiUTech_UI.isEnterEditMode == false) {
                ZhiUTech_UI.ZhiUTech_Features_MarkUp.enterEditMode();
                ZhiUTech_UI.isEnterEditMode = true
            }
            var className = type;
            var editMode = new ZhiUTech.Viewing.Extensions.Markups.Core[className](ZhiUTech_UI.ZhiUTech_Features_MarkUp);
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.changeEditMode(editMode);
            var currentView = ZhiUTech_UI._zhiu.viewer.autocam.getCurrentView();
            ZhiUTech_UI.currentView = currentView;
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.setStyle(ZhiUTech_UI.editModeColor);
        },
        /**
         * Notes:标注加粗方法
         * @param data 参数
         * @constructor
         */
        Markup_DiffTypeWeight: function (type) {
            if (ZhiUTech_UI.isEnterEditMode == false) {
                ZhiUTech_UI.ZhiUTech_Features_MarkUp.enterEditMode();
                ZhiUTech_UI.isEnterEditMode = true
            }
            var className = type;
            var editMode = new ZhiUTech.Viewing.Extensions.Markups.Core[className](ZhiUTech_UI.ZhiUTech_Features_MarkUp);
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.changeEditMode(editMode);
            var currentView = ZhiUTech_UI._zhiu.viewer.autocam.getCurrentView();
            ZhiUTech_UI.currentView = currentView;
            var style = {};
            style["stroke-width"] = 16.802721088435533;
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.setStyle(ZhiUTech_UI.editModeColor);
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.setStyle(style);
        },
        /**
         * Notes:标注保存
         * @param data 参数
         * @constructor
         */
        Markup_Save: function () {
            var svgstr = ZhiUTech_UI.ZhiUTech_Features_MarkUp.generateData();
            var viewstr = ZhiUTech_UI._zhiu.viewer.autocam.getCurrentView();
            ZhiUTech_UI.svgstr = svgstr;
            ZhiUTech_UI.viewstr = JSON.stringify(viewstr);
            console.log(ZhiUTech_UI.viewstr)
        },
        /**
         * Notes:退出标注
         * @param data 参数
         * @constructor
         */
        Markup_Leave: function () {
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.leaveEditMode();
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.hide()
            $(".mark_up_toolbar_big").hide()
            ZhiUTech_UI.isEnterEditMode = false
        },
        /**
         * Notes:标注获取
         * @param data 参数
         * @constructor
         */
        Markup_Get: function () {
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.show();
            var view = JSON.parse(ZhiUTech_UI.viewstr);
            var position = new THREE.Vector3(view.position.x, view.position.y, view.position.z);
            var up = new THREE.Vector3(view.up.x, view.up.y, view.up.z);
            var center = new THREE.Vector3(view.center.x, view.center.y, view.center.z);
            var pivot = new THREE.Vector3(view.pivot.x, view.pivot.y, view.pivot.z);
            var worldUp = new THREE.Vector3(view.worldUp.x, view.worldUp.y, view.worldUp.z);

            // 产生新相机信息
            var newView = {
                position: position.clone(),                     //!<<< 相机的新位置
                up: up.clone(),
                center: center.clone(),                            //!<<< 相机的新焦点
                pivot: pivot.clone(),                             //!<<< 相机的新环绕（Orbit）中心
                fov: view.fov,
                worldUp: worldUp.clone(),
                isOrtho: view.isOrtho
            };
            ZhiUTech_UI._zhiu.viewer.autocam.goToView(newView);
            ZhiUTech_UI.ZhiUTech_Features_MarkUp.loadMarkups(svgstr, "mylayer");
        },
        /**
         * Notes:打开测量底部二级菜单
         * @param data 参数
         * @constructor
         */
        OpenMeasureBottomToobar: function () {
            ZhiUTech_UI._CloseAllSecondMenu();
            $(".measure_toolbar_big").show()
        },
        /**
         * Notes:添加测量底部二级菜单
         * @param data 参数
         * @constructor
         */
        AddMeasureBottomToobar: function () {
            var measuretoolbar = document.createElement("div");
            measuretoolbar.setAttribute("class", "measure_toolbar_big")
            measuretoolbar.innerHTML = '<div class="measure_toolbar">\n' +
                '            <div id="measureTools_zhiu" class="" style="">\n' +
                '                <div id="toolbar-measureTool-EditModeFreehand" onclick="ZhiUTech_UI._Measure_DistanceAction()" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-xianxing- ZhUfont"></div>\n' +
                '                    <div id="toolbar-measureTool-EditModeFreehand-tooltip" class="zhiu-control-tooltip" >距离</div>\n' +
                '                </div>\n' +
                '                <div id="newBoxPan" onclick="ZhiUTech_UI._Measure_Angle()"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-jiaodu- ZhUfont"></div>\n' +
                '                    <div id="toolbar-measureTool-newBoxPan-tooltip" class="zhiu-control-tooltip" >角度</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-measureTool-EditModeArrow" style=" background-color: #dddddd; pointer-events: none;" onclick="ZhiUTech_UI._Measure_Calibration()"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-noun__cc ZhUfont"></div>\n' +
                '                    <div id="toolbar-measureTool-EditModeArrow-tooltip" class="zhiu-control-tooltip" >校准</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-measureTool-EditModemeasure" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-shezhi-wangye- ZhUfont"></div>\n' +
                '                    <div id="toolbar-measureTool-EditModemeasure-tooltip" class="zhiu-control-tooltip">测量设置</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-measureTool-EditModeRectangle" onclick="ZhiUTech_UI._Measure_DeleteCurrent()"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-shanchu1 ZhUfont"></div>\n' +
                '                    <div id="toolbar-measureTool-EditModeRectangle-tooltip" class="zhiu-control-tooltip">删除测量</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-measureTool-Save" onclick="ZhiUTech_UI._Measure_Close()" class="zhiu_toobar_button zhiu-label-button">\n' +
                '                    <div class="zhiu-button-icon" style="display: none;"></div>\n' +
                '                    <div id="toolbar-measureTool-Save-tooltip" class="zhiu-control-tooltip" >完成</div>\n' +
                '                    <label>完成</label>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>'
            //测量设置
            var measureSetBox = document.createElement("div");
            measureSetBox.setAttribute("class", "measureSetBox")
            measureSetBox.innerHTML =
                '<div id="measureSetBox" class="popupDiv">' +
                '<div id="measureSetBoxtitle" class="popuptitle">' +
                '<div>测量设置</div>' +
                '</div>' +
                '<div id="measureSetBoxclose" class="popup-close ZhUfont icon-cha2"></div>' +
                '<div class="measureSetBoxcontent">' +
                '<div class="measureSetfilter">' +
                '<div  class="filter-label">单位</div>' +
                '<div class="filter-box"  id="filter-box-dw">' +
                '   <div class="filter-text">  ' +
                '    <input class="filter-title" type="text" readonly placeholder="请选择" />  ' +
                '    <i class="icon icon-filter-arrow"></i>  ' +
                '   </div>  ' +
                '  <select name="filter">\n' +
                '   <option value="decimal-ft">十进制英尺</option>' +
                '   <option value="ft">英尺和分数英寸</option>' +
                '   <option value="ft-and-decimal-in">英尺和小数英寸</option>' +
                '   <option value="decimal-in">小数英寸</option>' +
                '   <option value="fractional-in">分数英寸</option>' +
                '   <option selected="selected" value="m">米</option>' +
                '   <option value="cm">厘米</option>' +
                '   <option value="mm">毫米</option>' +
                '   <option value="m-and-cm">米和厘米</option>' +
                '  </select>' +
                '</div>' +
                '</div>' +
                '<div class="measureSetfilter">' +
                '<div  class="filter-label">精度</div>' +
                '<div class="filter-box" id="filter-box-jd">' +
                '   <div class="filter-text">  ' +
                '    <input class="filter-title" type="text" readonly placeholder="请选择" />  ' +
                '    <i class="icon icon-filter-arrow"></i>  ' +
                '   </div>  ' +
                '  <select name="filter">\n' +
                '   <option value="0">0</option>' +
                '   <option  value="1">0.1</option>' +
                '   <option value="2">0.01</option>' +
                '   <option  selected="selected" value="3">0.001</option>' +
                '   <option value="4">0.0001</option>' +
                '   <option value="5">0.00001</option>' +
                '   <option value="6">0.000001</option>' +
                '  </select>' +
                '</div>' +
                '</div>' +
                '<div class="filter-switch">确认</div>' +
                '</div>' +
                '</div>'
            //测量校准
            var measureCalibratetBox = document.createElement("div");
            measureCalibratetBox.setAttribute("class", "measureCalibratetBox")
            measureCalibratetBox.innerHTML =
                '<div id="measureCalibratetBox" class="popupDiv">' +
                '<div id="measureCalibratetBoxtitle" class="popuptitle">' +
                '<div>校准</div>' +
                '</div>' +
                '<div id="measureCalibratetBoxclose" class="popup-close ZhUfont icon-cha2"></div>' +
                '<div class="measureCalibratetBoxcontent">' +
                '<div class="measureCalibratetfilter">' +
                '<div  class="filter-label">尺寸</div>' +
                '<div class="filter-box" >' +
                '   <div class="filter-text">  ' +
                '    <input class="filter-measureCalibratet" type="text" placeholder="请选择" />  ' +
                '   </div>  ' +
                '</div>' +
                '</div>' +
                '<div class="measureCalibratetfilter">' +
                '<div  class="filter-label">单位</div>' +
                '<div class="filter-box"  id="filter-box-Calibratet">' +
                '   <div class="filter-text">  ' +
                '    <input class="filter-title" type="text" readonly placeholder="请选择" />  ' +
                '    <i class="icon icon-filter-arrow"></i>  ' +
                '   </div>  ' +
                '  <select name="filter">\n' +
                '   <option value="decimal-ft">十进制英尺</option>' +
                '   <option value="ft">英尺和分数英寸</option>' +
                '   <option value="ft-and-decimal-in">英尺和小数英寸</option>' +
                '   <option value="decimal-in">小数英寸</option>' +
                '   <option value="fractional-in">分数英寸</option>' +
                '   <option value="m">米</option>' +
                '   <option value="cm">厘米</option>' +
                '   <option value="mm">毫米</option>' +
                '   <option value="m-and-cm">米和厘米</option>' +
                '  </select>' +
                '</div>' +
                '</div>' +
                '<div class="Calibratet-switch">确认校准</div>' +
                '</div>' +
                '</div>'
            ZhiUTech_UI._zhiu.viewer.container.appendChild(measureSetBox);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(measureCalibratetBox);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(measuretoolbar);
            /*浮动显示tips*/
            $(".zhiu_toobar_button").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });
            $("#Zhiu_measure").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                    $(".measure_toolbar_big").hide()
                    ZhiUTech_UI._CloseAllSecondMenu();
                } else {
                    $(this).addClass('boxShadow')
                    $(".measure_toolbar_big").show()
                }

            })
            //close
            $("#toolbar-measureTool-Save").click(function () {
                $(".measure_toolbar_big").hide()
            })
            $("#toolbar-measureTool-EditModemeasure").click(function () {
                $(".measureSetBox").show()

            })
            $("#measureSetBoxclose").click(function () {
                $(".measureSetBox").hide()
            })
            $("#toolbar-measureTool-EditModeArrow").click(function () {
                $(".measureCalibratetBox").show()
            })
            $("#measureCalibratetBoxclose").click(function () {
                $(".measureCalibratetBox").hide()
            })
            //确认校准
            $(".Calibratet-switch").click(function () {
                $(".measureCalibratetBox").hide()
            })
            //确认测量
            $(".filter-switch").click(function () {
                console.log("确认测量")
                $(".measureSetBox").hide()
            })
            //确认
            $("#toolbar-measureTool-Save").click(function () {
                $("#Zhiu_measure").removeClass('boxShadow')
            })


            //这里是初始化
            $('#filter-box-Calibratet').selectFilter({
                callBack: function (val) {
                    //返回选择的值
                    console.log(val + '-是返回的值')
                }
            });
            //这里是初始化
            $('#filter-box-dw').selectFilter({
                callBack: function (val) {
                    ZhiUTech_MsgCenter.L_SendMsg("设置当前测量单位", val);
                }
            });
            //这里是初始化
            $('#filter-box-jd').selectFilter({
                callBack: function (val) {
                    ZhiUTech_MsgCenter.L_SendMsg("设置当前测量精度", parseInt(val));
                }
            });
            switchEvent("#filter-switch-btn", function () {
                //$("#network").slideUp();//开了
                console.log(111)
            }, function () {
                // $("#network").slideDown();//关了
                console.log(111222)
            });

        },
        /**
         * Notes:打开截面底部二级菜单
         * @param data 参数
         * @constructor
         */
        OpenSectionBottomToobar: function () {
            ZhiUTech_UI._CloseAllSecondMenu();
            if ($(".section_toolbar_big").css("display") == "none") {
                $(".section_toolbar_big").show()
            } else {
                $(".section_toolbar_big").hide()
                ZhiUTech_UI._Section_Close();
            }
        },
        /**
         * Notes:添加截面底部二级菜单
         * @param data 参数
         * @constructor
         */
        AddSectionBottomToobar: function () {
            var sectiontoolbar = document.createElement("div");
            sectiontoolbar.setAttribute("class", "section_toolbar_big")
            sectiontoolbar.innerHTML = '<div class="section_toolbar">\n' +
                '            <div id="sectionTools" class="" style="">\n' +
                '                <div id="toolbar-sectionTool-EditModeFreehand" onclick="ZhiUTech_UI._Section_OpenXPlane()" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-x- ZhUfont"></div>\n' +
                '                    <div id="toolbar-sectionTool-EditModeFreehand-tooltip" class="zhiu-control-tooltip" >添加x平面</div>\n' +
                '                </div>\n' +
                '                <div id="newBoxPan" onclick="ZhiUTech_UI._Section_OpenYPlane()" class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-Y- ZhUfont"></div>\n' +
                '                    <div id="toolbar-sectionTool-newBoxPan-tooltip" class="zhiu-control-tooltip" >添加y平面</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-sectionTool-EditModeArrow" onclick="ZhiUTech_UI._Section_OpenZPlane()"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-z- ZhUfont"></div>\n' +
                '                    <div id="toolbar-sectionTool-EditModeArrow-tooltip" class="zhiu-control-tooltip" >添加z平面</div>\n' +
                '                </div>\n' +
                '                <div id="toolbar-sectionTool-EditModePolyline" onclick="ZhiUTech_UI._Section_OpenBox()"  class="zhiu_toobar_button">\n' +
                '                    <div class="zhiu-button-icon icon-- ZhUfont"></div>\n' +
                '                    <div id="toolbar-sectionTool-EditModePolyline-tooltip" class="zhiu-control-tooltip">添加框</div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>'
            ZhiUTech_UI._zhiu.viewer.container.appendChild(sectiontoolbar);
            /*浮动显示tips*/
            $(".zhiu_toobar_button").hover(function () {
                $(this).children(".zhiu-control-tooltip").css("visibility", "visible");
            }, function () {
                $(this).siblings().children(".zhiu-control-tooltip").css("visibility", "hidden");
                $(this).children(".zhiu-control-tooltip").css("visibility", "hidden");
            });
            //点击陷入
            $("#Zhiu_section").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                    ZhiUTech_UI._CloseAllSecondMenu()
                } else {
                    $(this).addClass('boxShadow')
                }

            })
        },
        /**
         * Notes:打开分解模型底部二级菜单
         * @param data 参数
         * @constructor
         */
        OpenExplodeBottomToobar: function () {
            ZhiUTech_UI._CloseAllSecondMenu();
            if ($(".explode_toolbar_big").css("display") == "none") {
                $(".explode_toolbar_big").show();
            } else {
                $(".explode_toolbar_big").hide();
                ZhiUTech_UI._Explode_Close();
            }
            //0
            $('.explode-slider').val(0)
        },
        /**
         * Notes:添加分解模型底部二级菜单
         * @param data 参数
         * @constructor
         */
        AddExplodeBottomToobar: function () {
            var explodetoolbar = document.createElement("div");
            explodetoolbar.setAttribute("class", "explode_toolbar_big")
            explodetoolbar.innerHTML = '<div class="explode_toolbar">\n' +
                '            <div id="explodeTools" class="explodeTools" style="">\n' +
                '                <div id="toolbar-explodeTool" class="">\n' +
                '                    <input class="explode-slider" type="range" min="0" max="1" step="0.01" value="0">\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>'
            ZhiUTech_UI._zhiu.viewer.container.appendChild(explodetoolbar);
            var change = function (event) {
                /*内容可自行定义*/
                ZhiUTech_UI._Explode_SetScale(event.value);
            };

            $('.explode-slider').RangeSlider({
                min: 0,
                max: 1,
                step: 0.01,
                callback: change
            });
            //点击陷入
            $("#Zhiu_explode").click(function () {
                $(this).siblings().removeClass('boxShadow')
                if ($(this).hasClass("boxShadow")) {
                    $(this).removeClass('boxShadow')
                    ZhiUTech_UI._CloseAllSecondMenu();
                } else {
                    $(this).addClass('boxShadow')
                }

            })
        },

        /**
         * Notes:增加问题
         * @param data 参数
         * @constructor
         */
        OpenAddProblem: function () {
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
                    var ProblemCreate = ""
                    if (data.success == true) {
                        $.each(data.data, function (key, value) {
                            if(value == "Problem:create"){
                                ProblemCreate = value;
                                return false;
                            }else{
                                ProblemCreate = "";
                            }
                        });
                        if (ProblemCreate == "Problem:create") {
                            $maskon();
                            layer.open({
                                type: 2,
                                title: "创建问题",
                                closeBtn: 0,
                                shade: [.5],
                                area: ['800px', '680px'],
                                content: ['../problem/addProblem', 'no']
                            });
                        }else{
                            layer.msg("您暂无权限新增问题", {
                                icon: 5,
                                anim:6
                            });
                        }
                    }
                },
                error: function () {
                    layer.msg("请求失败，请稍后再试", {
                        icon: 5,
                        anim: 6
                    });
                }
            })
        },

        /**
         * Notes:修改颜色选择器
         * @param data 参数
         * @constructor
         */
        OpenColorToobar: function(){
            zhiu_Viewer.L_SetNowSelectionColor(255, 0, 0, 255);
        },

        //小房子下拉列表(视角)部分
        AddVisualAngleSpinner: function () {
            var VisualAngleSpinner_Box = document.createElement("div");
            VisualAngleSpinner_Box.setAttribute("class", "VisualAngleSpinner_Box")
            VisualAngleSpinner_Box.innerHTML =
                '<div class="VisualAngleSpinner_Box_button ZhUfont icon-buzhidao2"></div>' +
                '<div class="VisualAngleSpinner_Box_content">' +
                '<div  class="Box_content_gotohome">转至主视图</div>' +
                '<div  class="Box_content_orthogonal">正交视图</div>' +
                '<div  class="Box_content_perspective">透视视图</div>' +
                '<div  class="Box_content_sethome">将当前视图设为主视图</div>' +
                '<div  class="Box_content_focusinghome">聚焦并设为主视图</div>' +
                '<div  class="Box_content_resethome">重置主视图</div>' +
                '</div>'
            ZhiUTech_UI._zhiu.viewer.container.appendChild(VisualAngleSpinner_Box);
            //点击三角显示隐藏
            $('.VisualAngleSpinner_Box_button').click(function () {
                if ($(".VisualAngleSpinner_Box_content").css("display") == "none") {
                    $(".VisualAngleSpinner_Box_content").show()
                } else {
                    $(".VisualAngleSpinner_Box_content").hide()
                }
            })
            //转至主视图
            $('.Box_content_gotohome').click(function () {
                ZhiUTech_MsgCenter.L_SendMsg("转至主视图");
                $(".VisualAngleSpinner_Box_content").hide();
            })
            //正交视图
            $('.Box_content_orthogonal').click(function () {
                ZhiUTech_MsgCenter.L_SendMsg("正交视图");
                $(".VisualAngleSpinner_Box_content").hide()
            })
            //透视视图
            $('.Box_content_perspective').click(function () {
                ZhiUTech_MsgCenter.L_SendMsg("透视视图");
                $(".VisualAngleSpinner_Box_content").hide()
            })
            //将当前视图设为主视图
            $('.Box_content_sethome').click(function () {
                ZhiUTech_MsgCenter.L_SendMsg("将当前视图设为主视图");
                $(".VisualAngleSpinner_Box_content").hide()
            })
            //聚焦并设为主视图
            $('.Box_content_focusinghome').click(function () {
                ZhiUTech_MsgCenter.L_SendMsg("聚焦并设为主视图");
                $(".VisualAngleSpinner_Box_content").hide()
            })
            //重置主视图
            $('.Box_content_resethome').click(function () {
                ZhiUTech_MsgCenter.L_SendMsg("重置主视图");
                $(".VisualAngleSpinner_Box_content").hide()
            })


        },
        //获取两个数组之间的差异
        esdDIff: function (arr1, arr2) {
            var newArr = [];
            var _arr1 = [];
            var _arr2 = [];

            //获取第一个数组的差异元素 存放到_arr1数组中
            _arr1 = arr1.filter(function (v) {
                if (arr2.indexOf(v) == -1) {
                    return v;
                }
            });

            //获取第二个数组的差异元素 存放到_arr2数组中
            _arr2 = arr2.filter(function (v) {
                if (arr1.indexOf(v) == -1) {
                    return v;
                }
            });
            //合并两个包含差异元素的数组
            newArr = _arr1.concat(_arr2);
            return newArr;
        },
        //测试方法
        GIS() {
            if ($("#gisdiv").length > 0) {
                $("#" + ZhiUTech_UI._zhiu.div.id).hide();
                $("#gisdiv").show();
                $("#gisdivsearch").show();
            } else {
                var html = "<div id='gisdiv' ></div>";
                html += "<div id='gisdivsearch' > <span>经度</span> <input id='lon' type='text'> <span>纬度</span> <input id='lat' type='text'><button class='btncc'  onclick='ZhiUTech_UI.location3Dtiles()'>倾斜</button> <button class='btnaa'  onclick='ZhiUTech_UI.location()'>定位</button> <button class='btnbb'   onclick='ZhiUTech_UI.back2bim()'>返回</button> </div>";
                $("body").append(html);
                $("#" + ZhiUTech_UI._zhiu.div.id).hide();

                var worldTerrain = Cesium.createWorldTerrain({
                    requestWaterMask: true,
                    requestVertexNormals: true
                });
                var viewer = new Cesium.Viewer("gisdiv", {
                    baseLayerPicker: false,
                    terrainProvider: worldTerrain
                });
                ZhiUTech_UI.gisViewer = viewer;
            }
            $("#div_days").hide()
            $("#slct_status").hide()

            ZhiUTech_UI.locationStart();
            ZhiUTech_UI.load3Dtiles();

        },
        back2bim() {
            $("#gisdiv").hide();
            $("#gisdivsearch").hide();
            $("#" + ZhiUTech_UI._zhiu.div.id).show();
            $("#div_days").show()
            $("#slct_status").show()
        },
        //起始跳转  --昌江
        locationStart() {
            $.post("/ProjectGIS/Select", {Type: 1},
                function (data) {
                    let ret = JSON.parse(data);
                    if (ret.Code == 500) {
                        layer.msg(ret.Message);
                    } else {
                        ret = JSON.parse(ret.Message);
                        let Datas = JSON.parse(ret[0].Datas);
                        //console.log(Datas);
                        let lon = Datas.lon;
                        let lat = Datas.lat;
                        ZhiUTech_UI.gisViewer.entities.removeAll();
                        let entity = new Cesium.Entity({
                            id: 'flyTmp',
                            position: Cesium.Cartesian3.fromDegrees(lon, lat),
                            point: {
                                pixelSize: 10,
                                color: Cesium.Color.WHITE.withAlpha(0.9),
                                outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
                                outlineWidth: 1
                            }
                        });
                        ZhiUTech_UI.gisViewer.entities.add(entity);
                        ZhiUTech_UI.gisViewer.flyTo(entity, {
                            offset: {
                                heading: Cesium.Math.toRadians(0.0),
                                pitch: Cesium.Math.toRadians(-25),
                                range: 10000
                            }
                        });
                    }
                })
        },
        //倾斜模型加载  --昌江
        load3Dtiles() {
            $.post("/ProjectGIS/Select", {Type: 0},
                function (data) {
                    let ret = JSON.parse(data);
                    if (ret.Code == 500) {
                        layer.msg(ret.Message);
                    } else {
                        ret = JSON.parse(ret.Message);
                        if (ret.length > 0) {
                            var Datas = ret[0].GIS;
                            console.log(Datas);
                            try {
                                // 加载3Dtils
                                tileset = new Cesium.Cesium3DTileset({
                                    url: Datas,
                                });
                                ZhiUTech_UI.gisViewer.scene.primitives.add(tileset);
                            } catch (e) {
                                alert("倾斜模型源存在错误,请确认!");
                            }
                        }
                    }
                }
            );
        },
        //倾斜模型跳转  --昌江
        location3Dtiles() {
            if (tileset !== null) {
                ZhiUTech_UI.gisViewer.zoomTo(tileset);
            } else {
                alert("项目未拥有倾斜模型服务!");
            }
        },
        location() {
            var lon = Number.parseFloat($("#lon").val());
            var lat = Number.parseFloat($("#lat").val());
            if (isNaN(lon)) {
                lon = 0;
                $("#lon").val(lon)
            }
            if (isNaN(lat)) {
                lat = 0;
                $("#lat").val(lat)
            }
            if (lon > 180 || lon < -180) {
                alert("请输入正确的经度");
                return;
            }
            if (lat > 90 || lon < -90) {
                alert("请输入正确的纬度");
                return;
            }

            ZhiUTech_UI.gisViewer.entities.removeAll();
            var entity = new Cesium.Entity({
                id: 'flyTmp',
                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.WHITE.withAlpha(0.9),
                    outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
                    outlineWidth: 1
                }
            });
            ZhiUTech_UI.gisViewer.entities.add(entity);
            ZhiUTech_UI.gisViewer.flyTo(entity, {
                offset: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-25),
                    range: 10000
                }
            });

            var data = {
                lon: lon,
                lat: lat
            }
            datas = JSON.stringify(data);
            //添加用户的定位记录 --昌江
            $.post("/ProjectGIS/AddGIS",
                {
                    Datas: datas,
                    Type: 1
                },
                function (data) {
                    var ret = JSON.parse(data);
                    if (ret.Code == 500) {
                        layer.msg(ret.Message);
                    } else {
                        ret = JSON.parse(ret.Message);
                        console.log(ret);
                    }
                })
        },
        showNav(btn, navDiv, direction) {
            btn.on('click', function () {
                btn.unbind("click");
                if (direction === "zhiu_right") {
                    navDiv.css({
                        right: "0px",
                        transition: "right 1s"
                    });
                    $(".zhiu_features").removeClass("icon-2fanhui");
                    $(".zhiu_features").addClass("icon-qianjin");
                    ZhiUTech_UI.zhiu_right.click(function () {
                        ZhiUTech_UI.zhiu_right.unbind("click");
                        ZhiUTech_UI.hideNav("zhiu_right");
                    })
                    $('.zhiu_toobar_right').addClass("toobar_right_position");
                } else if (direction === "zhiu_left") {
                    navDiv.css({
                        left: "0px",
                        transition: "left 1s"
                    });
                    ZhiUTech_UI.zhiu_leftNav.css("width","auto");
                    $(".zhiu_model_structure_tree").removeClass("icon-qianjin");
                    $(".zhiu_model_structure_tree").addClass("icon-2fanhui");
                    ZhiUTech_UI.zhiu_left.click(function () {
                        ZhiUTech_UI.zhiu_left.unbind("click");
                        ZhiUTech_UI.hideNav("zhiu_left");
                    })
                }
            });
        },
        hideNav(direction) {
            if (direction == "zhiu_right") {
                ZhiUTech_UI.zhiu_rightNav.css({
                    right: "-300px",
                    transition: "right .5s"
                });
                $(".zhiu_features").removeClass("icon-qianjin");
                $(".zhiu_features").addClass("icon-2fanhui");
                ZhiUTech_UI.showNav(ZhiUTech_UI.zhiu_right, ZhiUTech_UI.zhiu_rightNav, "zhiu_right")
                $('.zhiu_toobar_right').removeClass("toobar_right_position");
            } else if (direction == "zhiu_left") {
                _TreePanel_ResetPanelWidth(true);
                $(".zhiu_model_structure_tree").removeClass("icon-2fanhui");
                $(".zhiu_model_structure_tree").addClass("icon-qianjin");
                ZhiUTech_UI.showNav(ZhiUTech_UI.zhiu_left, ZhiUTech_UI.zhiu_leftNav, "zhiu_left")
            }

        },
        GisHide() {
            $('#Zhiu_GIS').hide()
        },
        GisShow() {
            $('#Zhiu_GIS').show()
        },
        // region LJason 各类点击事件
        _VolumeAction(callback) {
            ZhiUTech_MsgCenter.L_SendMsg("获取当前选中构件体积", callback);// volume 体积总和
        },
        _Measure_DistanceAction() {
            ZhiUTech_MsgCenter.L_SendMsg("日志", "进入长度测量状态");
            ZhiUTech_MsgCenter.L_SendMsg("打开距离测量");
        },
        _Measure_Angle() {
            ZhiUTech_MsgCenter.L_SendMsg("日志", "进入角度测量状态");
            ZhiUTech_MsgCenter.L_SendMsg("打开角度测量");
        },
        _Measure_Calibration() {
            ZhiUTech_MsgCenter.L_SendMsg("日志", "进入校准测量状态");
            ZhiUTech_MsgCenter.L_SendMsg("打开校准测量");
        },
        _Measure_DeleteCurrent() {
            ZhiUTech_MsgCenter.L_SendMsg("日志", "删除上一个测量");
            ZhiUTech_MsgCenter.L_SendMsg("删除当前测量");
        },
        _Measure_Close() {
            ZhiUTech_MsgCenter.L_SendMsg("日志", "关闭测量");
            ZhiUTech_MsgCenter.L_SendMsg("关闭测量");
        },
        _Section_Close() {
            ZhiUTech_MsgCenter.L_SendMsg("关闭截面");
        },
        _Section_OpenXPlane() {
            ZhiUTech_MsgCenter.L_SendMsg("设置截面", "x");
        },
        _Section_OpenYPlane() {
            ZhiUTech_MsgCenter.L_SendMsg("设置截面", "y");
        },
        _Section_OpenZPlane() {
            ZhiUTech_MsgCenter.L_SendMsg("设置截面", "z");
        },
        _Section_OpenBox() {
            ZhiUTech_MsgCenter.L_SendMsg("设置截面", "box");
        },
        _Explode_Close() {
            ZhiUTech_MsgCenter.L_SendMsg("关闭分解模型");
        },
        _Explode_SetScale(scale) {
            ZhiUTech_MsgCenter.L_SendMsg("设置分解模型", scale);// scale 类型float 0-1
        },
        _BoxSelection_Open(callback) {
            ZhiUTech_MsgCenter.L_SendMsg("打开框选", callback);
        },
        _PropertiesPanelAction() {
            $('#custom-show-hide-example').html('');
            if (ZhiUTech_UI.properties === undefined) return;
            // region 筛选出需要显示的特性
            let obj = [];
            for (let i = 0; i < ZhiUTech_UI.properties.length; i++) {
                for (let d = 0; d < ZhiUTech_UI.ZhiUTech_Features_Filter.length; d++) {
                    if (ZhiUTech_UI.ZhiUTech_Features_Filter[d] === ZhiUTech_UI.properties[i].parent.name) {
                        obj.push(ZhiUTech_UI.properties[i])
                    }
                }
            }
            // endregion


            for (let i = 0; i < obj.length; i++) {
                $('#custom-show-hide-example').append('    <h3>' + obj[i].parent.name + '</h3>' +
                    '    <div class="Features_detail' + i + '">' +
                    '    </div>')
                for (let j = 0; j < obj[i].children.length; j++) {
                    $('.Features_detail' + i).append('<p>' + obj[i].children[j].name + '<span  class="obflow" title=' + obj[i].children[j].value + '  >' + obj[i].children[j].value + '</span></p>')
                }
            }
            new jQueryCollapse($("#custom-show-hide-example"), {
                open: function () {
                    this.slideDown(150);
                },
                close: function () {
                    this.slideUp(150);
                }
            });
            $("#custom-show-hide-example h3 a").click()//默认打开

        },
        /**
         * 用于特性设置后刷新特性面板
         * @private
         */
        _PropertiesPanelRefresh() {
            ZhiUTech_MsgCenter.L_SendMsg("获取当前构件特性", (properties) => {
                _PropertiesPanel_SortPropertiesArray(properties);
                if (properties) {
                    properties.splice(2, 0, {
                        parent: {name: ZhiUTech_UI._customPropertyName},
                        children: [{
                            name: "正在加载...",
                            value: "请稍后..."
                        }],
                    });
                }
                ZhiUTech_UI.properties = properties;
                ZhiUTech_UI._PropertiesPanelAction();
                _PropertiesPanel_CustomPropertiesRefresh(properties);
            });
        },
        _QRCode_SetQRCodeContent(divid, name, stringArray) {
            $('#' + divid).html("");
            let qrstring = name + "\n\n";
            for (let i = 0; i < stringArray.length; i++) {
                qrstring += stringArray[i] + "\n";
            }
            qrstring += "\n<施工数据集成管理系统>";
            ZhiUTech_UI._zhiu.ZhiUTech_QRCode.L_GetQRCode(divid, name, qrstring);
        },
        _ModelStructureTree_OnSearchAction(value) {
            ZhiUTech_UI._lastTimeStamp = Date.now();
            if (value.target.value === "") {
                ZhiUTech_MsgCenter.L_SendMsg("树状图模糊查询", "");
                return;
            }
            setTimeout(() => {
                let now = Date.now() - ZhiUTech_UI._lastTimeStamp;
                if (now > 490) {
                    ZhiUTech_MsgCenter.L_SendMsg("树状图模糊查询", value.target.value);
                }
            }, 500);
        },
        // endregion

        //提供公共弹窗
        PublicWindow(content, delay, IsOpenBG) {
            $("#PublicWindowDivBig").remove();
            var PublicWindowDiv = document.createElement("div");
            var PublicWindowDivBig = document.createElement("div");
            PublicWindowDivBig.setAttribute("id", "PublicWindowDivBig")
            PublicWindowDivBig.setAttribute("class", "popupDivBigLJ")
            PublicWindowDiv.setAttribute("id", "PublicWindowDiv")
            PublicWindowDiv.setAttribute("class", "popupDivLJ")
            PublicWindowDiv.innerHTML =
                '<div  style="padding: 20px">' +
                '<div>' + content + '</div>' +
                '</div>'
            PublicWindowDivBig.appendChild(PublicWindowDiv);
            ZhiUTech_UI._zhiu.viewer.container.appendChild(PublicWindowDivBig);
            if (IsOpenBG == false) {
                $("#PublicWindowDivBig").css('background-color', 'transparent')
                $("#PublicWindowDivBig").css('z-index', '0')
            }
            setTimeout(function () {
                $("#PublicWindowDivBig").fadeOut(delay, function () {
                    $("#PublicWindowDivBig").remove();
                });
            }, delay);
        }

    };

    /**
     * 数组内元素交换 (直接修改原数组)
     * @param {Array} array 目标数组
     * @param {number} oldIndex 旧的下标
     * @param {number} newIndex 新的下标
     * @private
     */
    function _SwapArrayElement(array, oldIndex, newIndex) {
        array[newIndex] = array.splice(oldIndex, 1, array[newIndex])[0];
    }
    /**
     * 特性数组按照甲方意思整理
     * @param {Array} properties 特性数组
     * @private
     */
    function _PropertiesPanel_SortPropertiesArray(properties) {
        if (ZhiUTech_UI.limitNameList === undefined) {
            let limitMsg = {};
            limitMsg.limitNameList = [];
            limitMsg.limitDic = [];
            limitMsg.objectTotal = 0;
            ZhiUTech_MsgCenter.L_SendMsg("获取索引信息", limitMsg);
            ZhiUTech_UI.limitNameList = limitMsg.limitNameList;
        }
        if (properties) {
            for (let i = 0; i < properties.length; i++) {
                if (properties[i].parent.name === "文字") {

                    // region 整理字段顺序
                    let list = properties[i].children;
                    let result = [];
                    for (let j = 0; j < ZhiUTech_UI.limitNameList.length; j++) {
                        result.push({
                            name: ZhiUTech_UI.limitNameList[j],
                            value: "",
                        });
                    }
                    for (let j = 0; j < list.length; j++) {
                        if (ZhiUTech_UI.limitNameList.indexOf(list[j].name) !== -1) {
                            result[ZhiUTech_UI.limitNameList.indexOf(list[j].name)].value = list[j].value;
                        } else {
                            result.push({
                                name: "* " + list[j].name,
                                value: list[j].value,
                            });
                        }
                    }
                    properties[i].children = result;
                    // endregion

                    properties[i].parent.name = ZhiUTech_UI._revitPropertyName;
                    if (i !== 0) {
                        _SwapArrayElement(properties, i, 0);
                        i = 0;
                    }
                }
                if (properties[i].parent.name === "尺寸标注") {
                    if (i !== 1) {
                        _SwapArrayElement(properties, i, 1);
                        i = 1;
                    }
                }
            }
        }
    }
    /**
     * 设置特性面板的抬头名称
     * @param {string} name 名称
     * @private
     */
    function _PropertiesPanel_ChangePropertiesPanelTitleName(name = "特性") {
        $("#_PropertiesPanel_TitleName").text(name);
    }
    /**
     * 制作自定义面板内容
     * @param {Array} recursionList 需要还原的自定义特性列表
     * @param {string} nowSelectId 当前选中的构件id
     * @private
     */
    function _PropertiesPanel_MakeCustomPropertiesPanelContent(recursionList, nowSelectId) {
        let listPanel = $("#_PropertiesPanel_CustomPropertiesList");
        listPanel.empty();
        _RecursionCustomProperties(recursionList);
        ZhiUTech_UI._customPropertiesMember = {};
        ZhiUTech_UI._customPropertiesMember._propertiesAddList = [];
        ZhiUTech_UI._customPropertiesMember._propertiesDeleteList = [];

        _MakeCutstomPropertiesAddPanel();

        /**
         * 创建自定义属性条
         * @private
         */
        function _MakeCutstomPropertiesAddPanel() {
            let item = document.createElement("div");
            item.className = "_PropertiesPanel_CustomPropertiesListItem";
            item.id = "_PropertiesPanel_CustomProperties_AddPanel";

            // 属性名输入框
            let temp = document.createElement("input");
            temp.id = "_PropertiesPanel_PropertyNameInput";
            temp.className = "PropertiesPanel_InputItem";
            temp.oninput = function (value) {
                let result = value.target.value;
                if (result === "") {
                    $("#_PropertiesPanel_CustomProperties_ErrorMessagePanel").show();
                } else {
                    $("#_PropertiesPanel_CustomProperties_ErrorMessagePanel").hide();
                }
            };
            temp.setAttribute("type", "text");
            temp.setAttribute("placeholder", "输入名称...");
            temp.style.gridColumn = "2/3";
            item.appendChild(temp);
            // 自定义特性值
            temp = document.createElement("input");
            temp.id = "_PropertiesPanel_PropertyValueInput";
            temp.className = "PropertiesPanel_InputItem";
            temp.setAttribute("type", "text");
            temp.setAttribute("placeholder", "输入特性值...");
            temp.style.gridColumn = "3/4";
            item.appendChild(temp);
            // 标志
            temp = document.createElement("div");
            temp.className = "ZhUfont icon-gou";
            temp.onclick = function () {
                let prop = {};
                prop.StructureId = nowSelectId;
                prop.Key = $("#_PropertiesPanel_PropertyNameInput").val();
                prop.Value = $("#_PropertiesPanel_PropertyValueInput").val();

                if (!prop.Key || prop.Key === "") {
                    $("#_PropertiesPanel_CustomProperties_ErrorMessagePanel").show();
                    console.warn(" >LJason< 警告：有毒吧小伙子", prop);
                } else {
                    prop.Id = _GetGUID();
                    ZhiUTech_UI._customPropertiesMember._propertiesAddList.push(prop);
                    let newItem = _MakeCustomPropertiesItemDiv(prop.Key, prop.Value, prop.Id);
                    listPanel.append(newItem);
                    console.warn(" >LJason< 警告：保存自定义属性,来看看~~~", ZhiUTech_UI._customPropertiesMember);
                    $("#_PropertiesPanel_CustomProperties_AddPanel").remove();
                    $("#_PropertiesPanel_CustomProperties_ErrorMessagePanel").remove();
                    _MakeCutstomPropertiesAddPanel();
                }
            };
            temp.style.fontSize = "20px";
            temp.style.gridColumn = "4/5";
            item.appendChild(temp);

            listPanel.append(item);

            // region 错误提示行
            item = document.createElement("div");
            item.className = "_PropertiesPanel_CustomPropertiesListItem";
            item.id = "_PropertiesPanel_CustomProperties_ErrorMessagePanel";

            temp = document.createElement("div");
            temp.innerText = "  请输入名称";
            temp.style.color = "#ff0006";
            temp.style.gridColumn = "2/3";
            item.appendChild(temp);

            listPanel.append(item);
            $("#_PropertiesPanel_CustomProperties_ErrorMessagePanel").hide();
            // endregion


        }

        /**
         * 制作自定义特性的item
         * @param {string} key 特性名称
         * @param {string} value 特性值
         * @param {string} guid 唯一id
         * @returns {HTMLDivElement}
         * @private
         */
        function _MakeCustomPropertiesItemDiv(key, value, guid) {
            let item = document.createElement("div");
            item.className = "_PropertiesPanel_CustomPropertiesListItem";
            item._ZhiUTech_GUID = guid;

            // 自定义特性名称
            let temp = document.createElement("div");
            temp.innerText = key;
            temp.style.gridColumn = "2/3";
            item.appendChild(temp);
            // 自定义特性值
            temp = document.createElement("div");
            temp.innerText = value;
            temp.style.gridColumn = "3/4";
            item.appendChild(temp);
            // 标志
            temp = document.createElement("div");
            temp.className = "ZhUfont icon-cha1";
            temp.onclick = function () {
                ZhiUTech_UI._customPropertiesMember._propertiesDeleteList.push($(this).parent().prop("_ZhiUTech_GUID"));
                $(this).parent().remove();
            };
            temp.style.fontSize = "20px ";
            temp.style.gridColumn = "4/5";
            item.appendChild(temp);

            return item;
        }

        /**
         * 还原自定义特性
         * @param {Array} list 需要还原的列表
         * @private
         */
        function _RecursionCustomProperties(list) {
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    let temp = _MakeCustomPropertiesItemDiv(list[i].Key, (list[i].Value === null ? "" : list[i].Value), list[i].Id);
                    listPanel.append(temp);
                }
            }
        }
    }
    /**
     * 组装自定义特性数据包
     * @param {Object} data 自定义特性组
     * @return {Object} 整理好的数据包
     * @private
     */
    function _PropertiesPanel_AssemblyCustomPropertiesData(data) {
        let newData = {};
        newData._propertiesAddList = [];
        newData._propertiesDeleteList = [];
        let list = [];
        if (data._propertiesDeleteList.length > 0) {
            for (let i = 0; i < data._propertiesAddList.length; i++) {
                if (data._propertiesDeleteList.indexOf(data._propertiesAddList[i].Id) === -1) {
                    newData._propertiesAddList.push(data._propertiesAddList[i]);
                } else {
                    list.push(data._propertiesAddList[i].Id);
                }
            }
            for (let i = 0; i < data._propertiesDeleteList.length; i++) {
                if (list.indexOf(data._propertiesDeleteList[i]) === -1) {
                    newData._propertiesDeleteList.push(data._propertiesDeleteList[i]);
                }
            }
            return newData;
        } else {
            return data;
        }
    }
    /**
     * 刷新自定义特性并且刷新特性面板
     * @param {Array} properties 特性
     * @private
     */
    function _PropertiesPanel_CustomPropertiesRefresh(properties) {
        if (properties) {
            let temp = [];
            ZhiUTech_MsgCenter.L_SendMsg("获取当前构件ID", temp);
            ZhiUTech_MsgCenter.L_SendMsg("根据构件ID获取自定义特性", [temp[0][0], function (arg) {
                if (arg) {
                    let nowID = [];
                    ZhiUTech_MsgCenter.L_SendMsg("获取当前构件ID", nowID);
                    if (temp[0][0] !== nowID[0][0]) return;
                    for (let i = 0; i < properties.length; i++) {
                        if (properties[i].parent.name === ZhiUTech_UI._customPropertyName) {
                            properties[i].children = [];
                            for (let k = 0; k < arg.length; k++) {
                                properties[i].children.push({
                                    name: arg[k].Key,
                                    value: (arg[k].Value === null ? "" : arg[k].Value)
                                });
                            }
                            break;
                        }
                    }
                    ZhiUTech_UI.properties = properties;
                    ZhiUTech_UI._PropertiesPanelAction();
                }
            }]);
        }
    }
    /**
     * 设置自定义特性按键激活状态
     * @param {boolean} isActive 是否激活
     * @private
     */
    function _PropertiesPanel_SetCustomPropertiesButtonActive(isActive) {
        let btn = $("#_PropertiesPanel_CustomPropertiesButton");
        if (isActive) {
            btn.css("color", "#000000");
            btn.css("pointer-events", "auto");
        } else {
            btn.css("color", "#0000002b");
            btn.css("pointer-events", "none");
        }

    }
    /**
     * 设置初始二维码按键显示状态
     * @param {boolean} isVisible 是否可见
     * @private
     */
    function _PropertiesPanel_SetDefaultQRCodeButtonVisible(isVisible) {
        let btn = $("#_PropertiesPanel_DefaultQRCodeButton");
        if (isVisible) {
            btn.show();
        } else {
            btn.hide();
        }
    }
    /**
     * 特性面板返回主页面
     * @private
     */
    function _PropertiesPanel_BackToMainpage() {
        _PropertiesPanel_ChangePropertiesPanelTitleName();
        $(".QRCode_Content_title_set").hide();
        $(".Features_Content_title_set").hide();
        $(".Features_Content_title_list").show();
        $("#_PropertiesPanel_CustomPropertiesPanel").hide();
        $('.QRCode_set_list_content').html('')
        $('.Features_set_list_content').html("")
    }
    /**
     * 特性面板 重置设置
     * @private
     */
    function _PropertiesPanel_ResetSettings() {
        ZhiUTech_MsgCenter.L_SendMsg("获取父级属性名", function (arg) {
            if (arg !== undefined) {
                let newList = [ZhiUTech_UI._revitPropertyName];
                for (let i = 0; i < arg.length; i++) {
                    if (arg[i] !== "__name__" && arg[i] !== "__category__" && arg[i] !== "文字") {
                        newList.push(arg[i]);
                    }
                }
                arg = newList;
                arg.unshift(ZhiUTech_UI._customPropertyName);
                let dic = {};
                for (let i = 0; i < arg.length; i++) {
                    dic[arg[i]] = ZhiUTech_UI.ZhiUTech_Features_Filter.indexOf(arg[i]) !== -1;
                }
                _PropertiesPanel_ChangeSettingsToggle(dic);
            }
        });
    }
    /**
     * 特性面板 控制设置内开关
     * @param {Object} dic 特性类名为key 是否开启为value的键值对
     * @private
     */
    function _PropertiesPanel_ChangeSettingsToggle(dic) {
        let div = $('.Features_set_list_content');
        div.html("");
        for (let key in dic) {
            let isOn = dic[key];
            let toggle = "switch-off";
            if (isOn) {
                toggle = "switch-on";
            }
            div.append(
                '<div class="common-row"> ' +
                '  <div class="cell-left">' + key + '</div> ' +
                '  <div class="cell-right"><span class="' + toggle + '" id="right-switch" themeColor="#000" ></span></div> ' +
                '</div>');
        }
    }
    /**
     * 获取GUID
     * @return {string} GUID
     * @private
     */
    function _GetGUID() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    /**
     * 树状图重置面板宽度
     * @param {boolean} haveAnimation 是否带有动画
     * @private
     */
    function _TreePanel_ResetPanelWidth(haveAnimation){
        if(haveAnimation){
            ZhiUTech_UI.zhiu_leftNav.css({
                width:"300px",
                left: "-300px",
                transition: "left .5s"
            });
        }else{
            ZhiUTech_UI.zhiu_leftNav.css({
                width:"300px",
                left: "-300px",
            });
        }
    }
    /**
     * 复制到剪切板
     * @param {string} content 内容
     * @private
     */
    function _CopyToClipboard(content){
        let temp = document.createElement('textarea');
        temp.value = content;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("Copy"); // 执行浏览器复制命令
        temp.remove();
    }
    ZhiUTech_UI.Init();
    // region LJason UI内部方法
    ZhiUTech_UI._CloseAllSecondMenu = function () {
        //测量
        $(".measure_toolbar_big").hide();
        //截面
        $(".section_toolbar_big").hide();
        //标注
        $(".mark_up_toolbar_big").hide();
        //分解
        $(".explode_toolbar_big").hide();


        // 测量关闭
        ZhiUTech_MsgCenter.L_SendMsg("关闭测量");
        ZhiUTech_MsgCenter.L_SendMsg("关闭截面");
        ZhiUTech_MsgCenter.L_SendMsg("关闭分解模型");
    }
    // endregion
}

function Initialize_ZhiUTech_FilterWindow(core) {
    let ZhiUTech_FilterWindow = {
        callbackArray: [],
        _isInitialized: false,
        Init: function (keys, value, componentNum) {
            ZhiUTech_FilterWindow.callbackArray = [];
            for (let i = 0; i < keys.length; i++) {
                ZhiUTech_FilterWindow.callbackArray.push(undefined);
            }
            /*弹窗结构*/
            $(document.body).append(
                '<div class="filterWindowBG">' +
                '</div>'
            )
            ZhiUTech_FilterWindow._isInitialized = true;
            ZhiUTech_FilterWindow.refresh(keys, value, componentNum)

        },
        refresh: function (keys, value, componentNum) {
            $('.filterWindowBG').html('')
            $('.filterWindowBG').append('<div  class="filterWindow">' +
                '<div class="filtername"><div class="search-box-icon"></div><span>高级筛选</span><div class="docking-panel-close myclosefilter"></div></div>' +
                /*确认取消按钮*/
                '<div class="componentNum">目标个数：<span>' + componentNum + '</span></div>' +
                '<div class="isSureBtn">' +
                '<div class="sureFilter">确认并选中</div>' +
                '<div class="cancelFilter">取消</div>' +
                '</div>' +
                '</div>')
            for (var i = 0; i < keys.length; i++) {
                $('.filterWindow').append(
                    ' <div class="filter-box ' + 'filter-box' + i + '" >  ' +
                    '   <div  class="filter-label">' + keys[i] + '</div>' +
                    '   <div class="filter-text">  ' +
                    '    <input class="filter-title" type="text" readonly placeholder="请选择" />  ' +
                    '    <i class="icon icon-filter-arrow"></i>  ' +
                    '   </div>  ' +

                    ' </div>'
                )

                if (value.length > 0) {
                    for (var j = 0; j < value[i].length; j++) {
                        $('.filter-box' + i).append('  <select name="filter">  ' +
                            '   <option value="' + value[i][j] + '">' + value[i][j] + '</option>  ' +
                            '  </select>  ')
                        if (ZhiUTech_FilterWindow.callbackArray[i] == value[i][j]) {
                            $('.filter-box' + i + ' select').append('   <option selected value="' + value[i][j] + '">' + value[i][j] + '</option>  ')

                        }
                    }
                } else {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", "高级筛选的value为空请查看");
                }

                //这里是初始化筛选
                $('.filter-box' + i).selectFilter({

                    callBack: function (val, num) {
                        //返回选择的值
                        if (val === "请选择") {
                            val = undefined;
                        }

                        ZhiUTech_FilterWindow.callbackArray[num] = val;

                        // list: {Array} 装有关键字的数组; needSelect: {boolean} 是否需要选中筛选结果; obj.limitDic 符合要求的名称 数组套数组; obj.resultArray 符合要求的构件id数组
                        ZhiUTech_MsgCenter.L_SendMsg("获取索引结果", [ZhiUTech_FilterWindow.callbackArray, false, (obj) => {
                            ZhiUTech_FilterWindow.refresh(keys, obj.limitDic, obj.resultArray.length);
                        }]);

                        // let resultDic = viewer.ZhiUTech_TreeDBCtrl.L_GetLimitResult(ZhiUTech_FilterWindow.callbackArray, false);
                        // ZhiUTech_FilterWindow.refresh(keys, resultDic[0], resultDic[1]);

                        $('.filter-box .filter-selected').remove();
                    }
                });

            }
            /*
            select   --  name 可以接收选择的值【用于表单提交  名称自定义】
            option   --  1.  value    传给后台的参数
            1.  selected 设置默认选中
            2.  disabled 设置禁止选则
            */
            /*确认点击事件*/
            $('.sureFilter').click(function () {


                ZhiUTech_MsgCenter.L_SendMsg("获取索引结果", [ZhiUTech_FilterWindow.callbackArray, true, (obj) => {
                    ZhiUTech_FilterWindow.hide(keys);
                    $('#Zhiu_retrieval').removeClass('boxShadow');
                }]);


            });
            /*取消点击事件*/
            $('.cancelFilter').click(function () {
                ZhiUTech_FilterWindow.hide(keys);
                $('#Zhiu_retrieval').removeClass('boxShadow')
            })
            /*关闭事件*/
            $('.myclosefilter').click(function () {
                ZhiUTech_FilterWindow.hide(keys);
                $('#Zhiu_retrieval').removeClass('boxShadow')
            })
        },
        show: function () {
            let limitMsg = {};
            limitMsg.limitNameList = [];
            limitMsg.limitDic = [];
            limitMsg.objectTotal = 0;
            ZhiUTech_MsgCenter.L_SendMsg("获取索引信息", limitMsg);
            if (ZhiUTech_FilterWindow._isInitialized) {
                ZhiUTech_FilterWindow.refresh(limitMsg.limitNameList, limitMsg.limitDic, limitMsg.objectTotal);
            } else {
                ZhiUTech_FilterWindow.Init(limitMsg.limitNameList, limitMsg.limitDic, limitMsg.objectTotal);
            }
            $('.filterWindowBG').show()

        },
        hide: function (keys) {
            ZhiUTech_FilterWindow.callbackArray = [];
            for (let i = 0; i < keys.length; i++) {
                ZhiUTech_FilterWindow.callbackArray.push(undefined);
            }
            $('.filterWindowBG').hide()
            $('.filter-title').val('')

        },

    };
    core.ZhiUTech_FilterWindow = ZhiUTech_FilterWindow;

}




















