/**
 *  功能说明 : 初始化ZhiUViewer所需的所有基础
 *  @function InitializeZhiUViewer
 *  @author LJason
 *  @return {object} 核心句柄
 */
function InitializeZhiUViewer() {

    let zhiu = {
        // region 成员
        // region 外部
        /**
         * 主变量
         */
        viewer: undefined,
        /**
         * 用于viewer的div
         */
        div: undefined,
        /**
         * 通知中心
         */
        MsgCenter: undefined,
        /**
         * 核心成员
         */
        MainCore:(function () {
            if(window.ZhiUTech){
                return window.ZhiUTech;
            }
        })(),

        // endregion

        // region 内部变量
        /**
         * 成员管理
         */
        _member:{},
        // endregion

        // region ThreeJs 相关
        /**
         * 预定义名称 : 静止场景名称
         */
        _SCENE_NAME_DEAD: "ZhiuViewer_DeadScene",
        /**
         * 预定义名称 : 动态场景名称
         */
        _SCENE_NAME_LIFE: "ZhiuViewer_LifeScene",
        /**
         * 是否开启射线
         */
        _isOpenRayCast: false,
        /**
         * 3d标注的图片地址
         */
        _3dPointImagePath: ZHIU_MAINRELATIVEPATH+"zhiu_Resources/Image/RedPoint.png",
        /**
         * 3d标注的网格组
         */
        _3dPointGroup: undefined,
        /**
         * 3d标注的图片
         */
        _3dPointImage:undefined,

        /**
         * 射线相机
         */
        _Camera_Ray: undefined,
        /**
         * 动态追踪用的相机
         */
        _Camera_Dynamic: undefined,
        /**
         * 相机更新列表
         */
        _CameraUpdateList: [],

        /**
         * 是否监听点击(用于3d标注)
         */
        _isListenClick: false,
        /**
         * 点击的回调,返回位置信息(用于3d标注)
         */
        _clickPointCallback: undefined,
        /**
         * 点击的回调,返回整体信息
         */
        _clickMsgCallback: undefined,
        // endregion
        // endregion

        // region 对外功能

        // region 基础
        /**
         * 初始化Zhiu_Viewer
         * @function L_Initialize
         * @param {object} div 承载viewer 的容器
         * @param {string} path 模型地址
         */
        L_Initialize: function (div, path) {
            return _InitializeViewer(div, path);
        },
        /**
         * 根据特定格式 初始化Zhiu_Viewer
         * @function L_InitializeWithOptions
         * @param {object} div 承载viewer 的容器
         * @param {ModelOptions} modelOptions 模型的各类地址
         */
        L_InitializeWithOptions: function (div, modelOptions) {
            return _InitializeViewer(div, modelOptions);
        },
        /**
         * 创建viewer的内容 执行该方法前必须先进行 L_Initialize 来初始化承载器
         * @function L_Build
         * @param {boolean} [needShowUI=false] 是否显示ui
         */
        L_Build: function (needShowUI=false) {
            if (!zhiu._member._isReady) {
                setTimeout(function () {
                    zhiu.L_Build(needShowUI);
                }, 100);
                return;
            }
            zhiu._member._needUI=needShowUI;
            zhiu.viewer = new zhiu.MainCore.Viewing.Private.GuiViewer3D(zhiu.div);
            zhiu.viewer.start(zhiu._path, undefined, onSuccess);

            function onSuccess() {
                _OnViewerSuccess();
            }

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.GEOMETRY_LOADED_EVENT, _OnModelLoaded);

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, _OnSelectChanged);

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.AGGREGATE_ISOLATION_CHANGED_EVENT, _OnIsolateObject);

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.HIDE_EVENT, _OnHideObject);

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.MODEL_UNLOADED_EVENT, _OnModelUnloaded);

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.CAMERA_CHANGE_EVENT, _OnCameraChange);

            zhiu.viewer.addEventListener(zhiu.MainCore.Viewing.TOOLBAR_CREATED_EVENT,_OnUICreated);

            zhiu.viewer.addEventListener(zhiu.MainCore.EXTENSION_LOADED_EVENT, (id)=>{
                if(id.extensionId.indexOf("Measure")!==-1){
                    let tool=zhiu.viewer.getExtension('ZhiUTech.Measure');
                    tool.setUnits("mm");
                    tool.setPrecision(3);
                }
            });

        },
        /**
         * 卸载viewer模型 及卸载引用
         * @function L_Finish
         */
        L_Finish: function () {
            zhiu.viewer.tearDown();
            zhiu.viewer.finish();
            zhiu.viewer = undefined;
        },
        // endregion

        // region 公共API

        /**
         * 获取当前选择的id
         * @function L_GetNowSelectionId
         * @param {boolean} justArray 是否只返回数组
         * @returns {Array|object[]} 返回仅为id的数组 返回数组对象,key为模型序号
         */
        L_GetNowSelectionId: function (justArray = true) {
            if (zhiu.viewer.getAggregateSelection().length === 0) return [];
            let targets = zhiu.viewer.getAggregateSelection();
            return _GetIdWithData(targets,justArray);
        },

        /**
         * 获取当前选择id的所有属性
         * @function L_GetNowSelectionProperties
         * @param {PropertiesAction} propertiesAction 成功后的回调 参数为属性数组
         * @param {boolean} [justDictionary=true] 是否为id和属性字典  (请遵循默认值)
         */
        L_GetNowSelectionProperties: function (propertiesAction,justDictionary=true) {
            let targets = zhiu.viewer.getAggregateSelection();
            _GetPropertiesWithModels(targets, function (arg) {
                let result=arg;
                if(justDictionary){
                    result= _GetPropertiesDictionaryByNativeProperties(result);
                }
                propertiesAction(result);
            }, function (error) {
                ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取属性出现错误"]);
            })
        },

        /**
         * 获取体积总和
         * @function L_GetNowSelectionVolume
         * @param {VolumeAction} volumeAction 获取成功的回调 参数为总和
         */
        L_GetNowSelectionVolume: function (volumeAction) {
            let targets = zhiu.viewer.getAggregateSelection();
            _GetVolumeWithData(targets,volumeAction);
        },

        /**
         * 设置viewer的宽高
         * @function L_SetViewerSize
         * @param {number} width 宽 px
         * @param {number} height 高 px
         */
        L_SetViewerSize: function (width, height) {

            if(!width){
                width=zhiu.viewer.canvas.width;
            }

            if(!height){
                height=zhiu.viewer.canvas.height;
            }

            zhiu.viewer.container.style.width = `${(width)}px`;
            zhiu.viewer.container.style.height = `${(height)}px`;

            zhiu.viewer.canvas.width = width;
            zhiu.viewer.canvas.height = height;

            zhiu.viewer.resize(width, height);
        },

        /**
         * 设置viewer的位置
         * @function L_SetViewerPosition
         * @param {number} left 左 px
         * @param {number} top 上 px
         */
        L_SetViewerPosition: function (left, top) {
            zhiu.viewer.container.style.left = left;
            zhiu.viewer.container.style.top = top;
        },

        /**
         * 根据名称搜索构件id
         * @function L_SearchModelWithName
         * @param {string} name 构件名称关键字
         * @param {IdsAction} idsCallback 获取到id的回调
         * @param {boolean} justArray 仅要id数组
         */
        L_SearchModelWithName: function (name, idsCallback, justArray = true) {
            zhiu.zhiu_SearchObjectWithProperty(name, idsCallback, function (arg) {
                console.error(" >LJason< 错误：", arg);
            }, "name", justArray);
        },

        /**
         * 获取相机数据 用于还原相机
         * @function L_GetCameraData
         * @return {CameraData} cameraData 相机数据
         */
        L_GetCameraData: function () {
            return zhiu.viewer.autocam.getCurrentView();
        },

        /**
         * 获取相机是否为透视模式
         * @function L_GetCameraModePerspective
         * @return {boolean} isPerspective true为透视 false为正交
         */
        L_GetCameraModePerspective: function () {
            return zhiu.viewer.getCamera().isPerspective;
        },

        /**
         * 设置当前视角为默认视角
         * @function L_SetCameraDefaultViewState
         */
        L_SetCameraDefaultViewState: function () {
            _Camera_SetNowViewToMainView();
        },

        /**
         * 重置相机到默认视角
         * @function L_CameraGoMainView
         */
        L_CameraGoMainView: function () {
            _Camera_GoMainView();
        },

        /**
         *设置相机模式
         * @function L_SetCameraMode
         * @param {boolean} isPerspective 是否为透视相机
         */
        L_SetCameraMode: function (isPerspective) {
            _Camera_SetCameraModel(isPerspective);
        },

        /**
         * 根据相机数据还原相机
         * @function L_SetCameraWithData
         * @param {CameraData} data 相机数据
         */
        L_SetCameraWithData: function (data) {
            zhiu.viewer.autocam.goToView(data);
        },

        /**
         * 更改进度条logo图片
         * @function L_SetProgressLogo
         * @param {string} imageBase64 请使用base64码
         */
        L_SetProgressLogo: function (imageBase64) {
            $("#ZhiUTech_ProgressLogo_LJason").css("background", "no-repeat " + "url('" + imageBase64 + "')");
        },

        /**
         * 加载模型
         * @function L_LoadModelWithPath
         * @param {string} modelPath 模型位置
         * @param {function} [successCallback] 模型加载成功的回调
         * @return {string} 模型的GUID
         */
        L_LoadModelWithPath: function (modelPath,successCallback=undefined) {
            return _LoadModel(modelPath,successCallback);
        },

        /**
         * 加载模型 通过模型配置信息
         * @function L_LoadModelWithModelOptions
         * @param {ModelOptions} modelOptions 模型配置
         * @param {function} [successCallback] 模型加载成功的回调
         * @return {string} 模型的GUID
         */
        L_LoadModelWithModelOptions: function (modelOptions,successCallback=undefined) {
            return _LoadModel(modelOptions,successCallback);
        },

        /**
         * 根据模型序号卸载模型
         * @function L_UnloadModelWithIndex
         * @param {number} modelIndex 模型序号
         */
        L_UnloadModelWithIndex: function (modelIndex) {
            if (_IsLoaderFree()) {
                if (zhiu._member._modelOptionsList[modelIndex]) {
                    delete zhiu._member._modelOptionsList[modelIndex];
                    _UnloadModel(_GetModelWithModelIndex(modelIndex));
                } else {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", "卸载模型失败,序号不存在");
                }
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "在加载模型中禁止卸载模型");
            }
        },

        /**
         * 根据模型GUID卸载模型
         * @function L_UnloadModelWithModelGUID
         * @param {string} modelGUID 模型GUID
         */
        L_UnloadModelWithModelGUID: function (modelGUID) {
            if (_IsLoaderFree()) {
                for (let i = 0; i < zhiu._member._modelOptionsList.length; i++) {
                    if (zhiu._member._modelOptionsList[i].GUID === modelGUID) {
                        let guid= zhiu._member._modelOptionsList[i].GUID;
                        delete zhiu._member._modelOptionsList[i];
                        _UnloadModel(_GetModelWithModelGUID(guid));
                    }
                }
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "在加载模型中禁止卸载模型");
            }
        },

        /**
         * 根据模型名称卸载模型
         * @function L_UnloadModelWithModelName
         * @param {string} modelName 模型名称
         * @param {boolean} [unloadAll=false] 是否卸载全部符合条件的模型
         */
        L_UnloadModelWithModelName: function (modelName, unloadAll = false) {
            if (_IsLoaderFree()) {
                for (let i = 0; i < zhiu._member._modelOptionsList.length; i++) {
                    if (zhiu._member._modelOptionsList[i].FileName === modelName) {
                        let guid= zhiu._member._modelOptionsList[i].GUID;
                        delete zhiu._member._modelOptionsList[i];
                        _UnloadModel(_GetModelWithModelGUID(guid));
                        if (!unloadAll) {
                            return;
                        } else {
                            i = 0;
                        }
                    }
                }
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "在加载模型中禁止卸载模型");
            }
        },

        /**
         * 根据模型路径卸载模型
         * @function L_UnloadModelWithModelPath
         * @param {string} modelPath 模型地址
         * @param {boolean} [unloadAll=false] 是否卸载全部符合条件的模型
         */
        L_UnloadModelWithModelPath: function (modelPath, unloadAll = false) {
            if (_IsLoaderFree()) {
                for (let i = 0; i < zhiu._member._modelOptionsList.length; i++) {
                    if (zhiu._member._modelOptionsList[i].FilePath === modelPath) {
                        let guid= zhiu._member._modelOptionsList[i].GUID;
                        delete zhiu._member._modelOptionsList[i];
                        _UnloadModel(_GetModelWithModelGUID(guid));
                        if (!unloadAll) {
                            return;
                        } else {
                            i = 0;
                        }
                    }
                }
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "在加载模型中禁止卸载模型");
            }
        },

        /**
         * 卸载全部模型
         * @function L_UnloadAllMode
         */
        L_UnloadAllMode: function () {
            if (_IsLoaderFree()) {
                let list = _GetAllModels().length;
                for (let i = 0; i < list; i++) {
                    _UnloadModel(_GetAllModels()[0]);
                }
                zhiu._member._modelOptionsList = [];
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "在加载模型中禁止卸载模型");
            }
        },

        /**
         * 根据id聚焦构件
         * @function L_FocusObject
         * @param {string|string[]} id 单个构件id或者id数组
         */
        L_FocusObject: function (id) {
            let data = _GetAggregateDataWithId(id);
            _FocusObject(data);
        },

        /**
         * 聚焦当前选择
         * @function L_FocusNowSelection
         */
        L_FocusNowSelection: function () {
            _FocusObject(zhiu.viewer.getAggregateSelection());
        },

        /**
         * 根据名称聚焦构件
         * @funtion L_FocusWithObjectName
         * @param {string} objectName 构件名称
         */
        L_FocusWithObjectName: function (objectName) {
            zhiu.zhiu_SearchObjectWithProperty(objectName, function (arg) {
                _FocusObject(_GetAggregateDataWithId(arg));
            }, function (arg) {
                ZhiUTech_MsgCenter.L_SendMsg("错误", ["根据名称聚焦构件出现错误", arg]);
            }, "name", true);
        },

        /**
         * 根据id获取名称
         * @function L_GetObjectNameWithId
         * @param {string|string[]} id 目标id 可单可数组
         */
        L_GetObjectNameWithId: function (id) {
            let targets = _GetAggregateDataWithId(id);

            return _GetNameWithData(targets);
        },

        /**
         * 隔离当前选中的构件 (备注:不会触发官方回调)
         * @function L_IsolateNowSelection
         */
        L_IsolateNowSelection: function () {
            let targets = _GetSelection();
            _IsolateObject(targets);
        },

        /**
         * 根据id隔离构件 (备注:不会触发官方回调)
         * @function L_IsolateWithId
         * @param {string[]} ids id数组
         */
        L_IsolateWithId: function (ids) {
            let targets = _GetAggregateDataWithId(ids);
            _IsolateObject(targets);
        },

        /**
         * 根据名称隔离构件 (备注:不会触发官方回调)
         * @function L_IsolateWithName
         * @param {string} objectName 构件名称
         */
        L_IsolateWithName: function (objectName) {
            zhiu.zhiu_SearchObjectWithProperty(objectName, function (arg) {
                let targets = _GetAggregateDataWithId(arg);
                _IsolateObject(targets);
            }, function (arg) {
                ZhiUTech_MsgCenter.L_SendMsg("错误", ["根据名称隔离构件出现错误", arg]);
            }, "name", true);
        },

        /**
         * 设置全部模型显示隐藏
         * @function L_SetAllVisibility
         * @param {boolean} isShow 是否显示
         */
        L_SetAllVisibility: function (isShow = true) {
            _SetAllVisibility(isShow);
        },

        /**
         * 是否开启隐藏后的虚影
         * @function L_SetGhosting
         * @param {boolean} isOpen 是否开启
         */
        L_SetGhosting: function (isOpen) {
            zhiu.viewer.setGhosting(isOpen);// 是否打开虚影
        },

        /**
         * 根据hideModel返回的唯一key来显示模型
         * @function L_ShowModelWithHideKey
         * @param {string} hideKey 调用_HideModel后返回的key
         */
        L_ShowModelWithHideKey: function (hideKey) {
            _ShowModel(hideKey);
        },

        /**
         * 根据当前模型序号隐藏模型 (切记模型隐藏后等同删除,所有模型序号将往前补位;且隐藏后模型不会产生虚影)
         * @function L_HideModelWithIndex
         * @param {string} modelIndex 模型进入场景的序号
         * @return {string} 该范围值为显示模型的唯一凭证,请保留完好,一旦key丢失将无法找回隐藏的模型
         */
        L_HideModelWithIndex: function (modelIndex) {
            return _HideModel(modelIndex);
        },

        /**
         * 显示所有隐藏的模型
         * @function L_ShowAllModel
         */
        L_ShowAllModel: function () {
            ZhiUTech_MsgCenter.L_SendMsg("显示模型");
            let list = Object.keys(zhiu._member._hideModelDic);
            for (let i = 0; i < list.length; i++) {
                _ShowModel(list[i]);
            }
        },

        /**
         * 清除所有选择
         * @function L_ClearSelection
         */
        L_ClearSelection: function () {
            _ClearAllSelection();
        },

        /**
         * 设置选中颜色
         * @function L_SetSelectColor
         * @param {string|THREE.Color} color 十六进制HEX颜色("#ffffff"类似)或者three.color类型的颜色
         */
        L_SetSelectColor: function (color) {
            if (typeof(color) === "string" || color instanceof THREE.Color) {
                zhiu.viewer.setSelectionColor(color);
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "更改选中颜色失败,需要十六进制HEX颜色或者three.color类型的颜色");
            }
        },

        /**
         * 根据id设置当前选择
         * @function L_SetSelect
         * @param {string|string[]} ids 单个id或者id数组
         */
        L_SetSelect: function (ids) {
            _ClearAllSelection();
            _SetAggregateSelect(ids);
        },

        /**
         * 设置当前选中颜色
         * @function L_SetNowSelectionColor
         * @param {number} red 0-255范围
         * @param {number} green 0-255范围
         * @param {number} blue 0-255范围
         * @param {number} alpha 0-255范围
         */
        L_SetNowSelectionColor: function (red, green, blue, alpha) {
            let list = _GetSelection();
            _SetObjectColorWithData(list, new THREE.Vector4(red / 255, green / 255, blue / 255, alpha / 255));
        },

        /**
         * 根据id改颜色
         * @function L_SetColorWithId
         * @param {string|string[]} id 单个id或者id数组
         * @param {number} red 0-255范围
         * @param {number} green 0-255范围
         * @param {number} blue 0-255范围
         * @param {number} alpha 0-255范围
         */
        L_SetColorWithId: function (id, red, green, blue, alpha) {
            let data = _GetAggregateDataWithId(id);
            _SetObjectColorWithData(data, new THREE.Vector4(red / 255, green / 255, blue / 255, alpha / 255));
        },

        /**
         * 清除所有颜色
         * @function L_ClearAllColor
         */
        L_ClearAllColor: function () {
            _ClearAllColor();
        },

        /**
         * 根据id清除颜色
         * @function L_ClearColorById
         * @param {string|string[]} id 单个id或者id数组
         */
        L_ClearColorById: function (id) {
            let data = _GetAggregateDataWithId(id);
            _ClearColorWithData(data);
        },

        /**
         * 清除当前选中构件颜色
         * @function L_ClearNowSelectionColor
         */
        L_ClearNowSelectionColor: function () {
            let data = _GetSelection();
            _ClearColorWithData(data);
        },

        /**
         * 隐藏当前选中的构件
         * @function L_HideNowSelection
         */
        L_HideNowSelection: function () {
            let targets = _GetSelection();
            _HideObject(targets);
        },

        /**
         * 根据id隐藏构件
         * @function L_HideWithId
         * @param {string[]} ids id数组
         */
        L_HideWithId: function (ids) {
            let targets = _GetAggregateDataWithId(ids);
            _HideObject(targets);
        },

        /**
         * 根据名称隐藏构件
         * @function L_HideWithName
         * @param {string} objectName 构件名称
         */
        L_HideWithName: function (objectName) {
            zhiu.zhiu_SearchObjectWithProperty(objectName, function (arg) {
                let targets = _GetAggregateDataWithId(arg);
                _HideObject(targets);
            }, function (arg) {
                ZhiUTech_MsgCenter.L_SendMsg("错误", ["根据名称隐藏构件出现错误", arg]);
            }, "name", true);
        },

        /**
         * 根据id获取属性
         * @function L_GetPropertiesById
         * @param {string|string[]} id 单个id或id组
         * @param {PropertiesAction} propertiesAction 获取到属性的回调
         * @param {boolean} [justDictionary=true] 是否为id和属性字典 (请遵循默认值)
         */
        L_GetPropertiesById:function(id,propertiesAction,justDictionary=true){
            let targets=_GetAggregateDataWithId(id);
            _GetPropertiesWithModels(targets, function (arg) {
                let result=arg;
                if(justDictionary){
                    result= _GetPropertiesDictionaryByNativeProperties(result);
                }
                propertiesAction(result);
            }, function (error) {
                ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取属性出现错误"]);
            })
        },
        // endregion

        // region 较深层API

        /**
         * 获取模型的计量单位
         * @function zhiu_GetUnitOfMeasurement
         * @param {number} [modelIndex=0] 模型序号
         * @returns {string} 单位的字符串
         */
        zhiu_GetUnitOfMeasurement: function (modelIndex = 0) {
            return zhiu.viewer.impl.modelQueue().getModels()[modelIndex].getUnitString();
        },

        /**
         * 获取模型缩放系数
         * @function zhiu_GetUnitOfScale
         * @param {number} [modelIndex=0] 模型序号
         * @returns {number} 缩放比例
         */
        zhiu_GetUnitOfScale: function (modelIndex = 0) {
            return zhiu.viewer.impl.modelQueue().getModels()[modelIndex].getUnitScale();
        },

        /**
         * 设置测量单位
         * @function zhiu_SetUnitOfMeasurement
         * @param {string} unit 单位 millimeter 为毫米;  meter 为米;
         * @param {number} [modelIndex=0] 模型序号
         */
        zhiu_SetUnitOfMeasurement: function (unit, modelIndex = 0) {
            zhiu.viewer.impl.modelQueue().getModels()[modelIndex].getData().metadata['distance unit'].value = unit;//测距默认 millimeter 为毫米;  meter 为米
        },

        /**
         * 获取所有id
         * @function zhiu_GetAllIds
         * @param {boolean} [justArray=true] true:仅数组 false:模型序号为key,构件数组为value的键值对
         * @returns {string[]} 根据条件返回
         */
        zhiu_GetAllIds: function (justArray=true) {
            return _GetAllIds(justArray);
        },

        /**
         * 根据属性查找模型构件
         * @function zhiu_SearchObjectWithProperty
         * @param {string} valueString 要搜索的值
         * @param {SearchAction} SearchAction 找到后的回调
         * @param {ErrorAction} ErrorAction 错误的回调
         * @param {string} PropertyName 要找到属性名称
         * @param {boolean} justArray 仅需要数组
         */
        zhiu_SearchObjectWithProperty: function (valueString, SearchAction, ErrorAction, PropertyName, justArray) {
            let modelList = zhiu.viewer.impl.modelQueue().getModels();
            if (modelList.length === 1) {
                _SearchModelWithProperty(modelList[0], valueString, function (arg) {
                    let result = {};
                    if (justArray) {
                        result = arg;
                    } else {
                        result[0] = arg;
                    }
                    SearchAction(result);
                }, ErrorAction, PropertyName);
            } else {
                let promiseList = [];
                for (let i = 0; i < modelList.length; i++) {
                    promiseList.push(new Promise((resolve, reject) => {
                        _SearchModelWithProperty(modelList[i], valueString, function (arg) {
                            if (arg.length > 0) {
                                resolve(arg);
                            }
                        }, function (error) {
                            reject(error);
                        }, PropertyName)
                    }));
                }

                Promise.all(promiseList).catch(
                    error => {
                        ErrorAction(error);
                    }
                ).then(
                    list => {
                        let result = undefined;
                        if (justArray) {
                            result = [];
                            for (let i = 0; i < list.length; i++) {
                                result = result.concat(list[i]);
                            }
                        } else {
                            result = {};
                            for (let i = 0; i < list.length; i++) {
                                result[i] = list[i];
                            }
                        }
                        SearchAction(result);
                    }
                )
            }

        },

        /**
         * 根据属性查找指定模型的构件
         * @function zhiu_SearchObjectWithPropertyByModel
         * @param {model} targetModel 指定模型
         * @param {string} valueString 要搜索的值
         * @param {SearchAction} SearchAction 找到后的回调
         * @param {ErrorAction} ErrorAction 错误的回调
         * @param {string} PropertyName 要找到属性名称
         */
        zhiu_SearchObjectWithPropertyByModel: function (targetModel, valueString, SearchAction, ErrorAction, PropertyName) {
            _SearchModelWithProperty(targetModel, valueString, function (arg) {
                SearchAction(arg);
            }, ErrorAction, PropertyName)
        },

        /**
         * 刷新场景
         * @function zhiu_RefreshScene
         */
        zhiu_RefreshScene: function () {
            _RefreshScene();
        },

        /**
         * 根据id获取聚合选择数据
         * @function zhiu_GetAggregateDataWithId
         * @param {string|string[]} id 单个id 或 id数组都可以
         * @return {object[]} 以模型和选中id组成的数组
         */
        zhiu_GetAggregateDataWithId: function (id) {
            return _GetAggregateDataWithId(id);
        },

        /**
         * 设置模型显示隐藏
         * @function zhiu_SetModelVisibility
         * @param {model} model 模型
         * @param {boolean} isShow 是否显示
         */
        zhiu_SetModelVisibility: function (model, isShow) {
            _SetModelVisibility(model, isShow);
        },

        /**
         * 将相机数据序列化到本地
         * 作用: 下次开启时将会自动回到该位置,并且设置默认视角
         * @function zhiu_PersistentCameraDataToLocal
         */
        zhiu_PersistentCameraDataToLocal: function () {
            window.localStorage.setItem('ZhiuTech_DefaultCameraViewData', _Camera_GetCameraStringData());
        },

        /**
         * 根据本地的相机数据还原相机,及修改相机默认视角
         * @function zhiu_ResetCameraWithLocalData
         */
        zhiu_ResetCameraWithLocalData: function () {
            let myLocal = window.localStorage.getItem("ZhiuTech_DefaultCameraViewData");
            if (!myLocal) return;
            _Camera_SetCameraWithStringData(myLocal,true);
        },

        /**
         * 获取相机字符串数据
         * @function zhiu_GetCameraStringData
         * @return {string} 字符串数据
         */
        zhiu_GetCameraStringData:function(){
            return _Camera_GetCameraStringData();
        },

        /**
         * 根据相机字符串数据还原相机
         * @function zhiu_SetCameraWithStringData
         * @param {string} data 字符串数据
         */
        zhiu_SetCameraWithStringData:function(data){
            _Camera_SetCameraWithStringData(data);
        },

        /**
         * 清除本地储存的各类数据(谨慎使用)
         * @function zhiu_ClearLocalStorage
         */
        zhiu_ClearLocalStorage: function () {
            window.localStorage.clear();
        },

        /**
         * 获取屏幕截图的base64编码
         * @function zhiu_GetScreenShot
         * @param {number} width 截图的宽度
         * @param {number} height 截图的高度
         * @param {ScreenShotAction} screenShotAction 截图的回调
         */
        zhiu_GetScreenShot: function (width, height, screenShotAction) {
            zhiu.viewer.getScreenShotBuffer(width, height, screenShotAction);
        },

        /**
         * 更换所有材质的颜色,仅用于演示 (该功能不可逆,且部分材质更换颜色无效,请酌情使用)
         * @function zhiu_ChangeAllMaterialColor
         * @param {number} red 0-255范围
         * @param {number} green 0-255范围
         * @param {number} blue 0-255范围
         */
        zhiu_ChangeAllMaterialColor: function (red, green, blue) {
            let mats = zhiu.viewer.impl.matman()._materials;
            for (let item in mats) {
                mats[item]._color = new THREE.Color(red / 255, green / 255, blue / 255);
            }
            zhiu.viewer.impl.invalidate(true);
        },

        /**
         * 获取GUID
         * @function zhiu_GetGUID
         * @return {string} id
         */
        zhiu_GetGUID:function(){
            return _GetGUID();
        },

        /**
         * 全屏开关
         * @function zhiu_ToggleFullScreen
         * @param {boolean} isFull 是否全屏
         */
        zhiu_ToggleFullScreen:function(isFull){
            _ToggleFullScreen(isFull);
        },
        // endregion

        // region model相关

        /**
         * 获取所有模型列表
         * @function zhiu_GetAllModels
         * @returns {Array} 模型数组
         */
        zhiu_GetAllModels: function () {
            return _GetAllModels();
        },

        /**
         * 获取模型树信息
         * @function zhiu_GetModelInstanceTree
         * @param {number} [modelIndex=0] 模型序号
         * @returns {instanceTree} 树信息
         */
        zhiu_GetModelInstanceTree: function (modelIndex = 0) {
            return zhiu.viewer.impl.modelQueue().getModels()[modelIndex].getData().instanceTree;
        },

        /**
         * 根据模型序号获取模型
         * @function zhiu_GetModelWithModelIndex
         * @param {number} modelIndex 模型序号
         * @returns {model} 模型
         */
        zhiu_GetModelWithModelIndex: function (modelIndex) {
            return _GetModelWithModelIndex(modelIndex);
        },

        /**
         * 根据模型GUID获取模型
         * @function zhiu_GetModelWithModelGUID
         * @param {string} modelGUID 模型序号
         * @returns {model} 模型
         */
        zhiu_GetModelWithModelGUID: function (modelGUID) {
            return _GetModelWithModelGUID(modelGUID);
        },

        /**
         * 根据模型获取模型序号
         * @function zhiu_GetModelIndexWithModel
         * @param {model} model 模型
         * @returns {number} 模型序号
         */
        zhiu_GetModelIndexWithModel: function (model) {
            return model._ModelId;
        },

        /**
         * 获取模型总数
         * @function zhiu_GetModelLength
         * @return {number} 模型总数
         */
        zhiu_GetModelLength: function () {
            return zhiu.viewer.impl.modelQueue().getModels().length;
        },

        /**
         * 卸载模型
         * @function zhiu_UnloadModelWithModel
         * @param {model} model 模型个体
         */
        zhiu_UnloadModelWithModel: function (model) {
            if (_IsLoaderFree()) {
                if (zhiu._member._modelOptionsList[model._ModelId]) {
                    delete zhiu._member._modelOptionsList[model._ModelId];
                    _UnloadModel(_GetModelWithModelIndex(model._ModelId));
                } else {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", "卸载模型失败,序号不存在");
                }
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("错误", "在加载模型中禁止卸载模型");
            }
        },
        // endregion

        // region THREE JS相关

        /**
         * 添加物体到场景内
         * @function zhiu_THREEJS_AddObject
         * @param {string} sceneName 场景名称
         * @param {THREE.Mesh} obj 需要添加的物体
         * @param {boolean} [isLife] 该参数请确认清楚，不填写为正常使用！ true为加入默认动态场景(用于射线) false为加入默认静态场景(用于展示)
         */
        zhiu_THREEJS_AddObject: function (sceneName, obj, isLife) {
            if (isLife === undefined) {
                if (_THREEJS_CheckSceneExist(sceneName)) {
                    _THREEJS_AddObject(sceneName, obj);
                }
            } else if (isLife) {
                _THREEJS_AddObject(zhiu._SCENE_NAME_LIFE, obj);
            } else {
                _THREEJS_AddObject(zhiu._SCENE_NAME_DEAD, obj);
            }
        },

        /**
         * 从场景中删除物体
         * @function zhiu_THREEJS_DeleteObject
         * @param {string} sceneName 场景名称
         * @param {THREE.Mesh} obj 需要删除的物体
         * @param {boolean} [isLife] 该参数请确认清楚，不填写为正常使用！ true为加入默认动态场景(用于射线) false为加入默认静态场景(用于展示)
         */
        zhiu_THREEJS_DeleteObject: function (sceneName, obj, isLife) {
            if (isLife === undefined) {
                if (_THREEJS_CheckSceneExist(sceneName)) {
                    _THREEJS_DeleteObject(sceneName, obj);
                }
            } else if (isLife) {
                _THREEJS_DeleteObject(zhiu._SCENE_NAME_LIFE, obj);
            } else {
                _THREEJS_DeleteObject(zhiu._SCENE_NAME_DEAD, obj);
            }
        },

        /**
         * 删除场景内所有物体
         * @function zhiu_THREEJS_DeleteAllObject
         * @param {string} sceneName 场景名称
         */
        zhiu_THREEJS_DeleteAllObject: function (sceneName) {
            _THREEJS_DeleteAllObject(sceneName);
        },

        /**
         * 创建场景
         * @function zhiu_THREEJS_CreateScene
         * @param {string} sceneName 场景名称
         */
        zhiu_THREEJS_CreateScene: function (sceneName) {
            _THREEJS_CreateScene(sceneName);
        },

        /**
         * 删除场景
         * @function zhiu_THREEJS_DeleteScene
         * @param {string} sceneName 场景名称
         */
        zhiu_THREEJS_DeleteScene: function (sceneName) {
            _THREEJS_DeleteScene(sceneName);
        },

        /**
         * 刷新场景(仅three场景)
         * @function zhiu_THREEJS_RefreshScene
         */
        zhiu_THREEJS_RefreshScene: function () {
            _THREEJS_RefreshScene();
        },

        /**
         * 根据场景名称获取场景
         * @function zhiu_THREEJS_GetSceneWithName
         * @param {string} sceneName 场景名称
         * @return {THREE.Scene | undefined} 如果返回undefined 代表未找到
         */
        zhiu_THREEJS_GetSceneWithName: function (sceneName) {
            return _THREEJS_GetSceneWithName(sceneName);
        },

        /**
         * 开关射线检测
         * @function zhiu_THREEJS_ToggleRaycast
         * @param {boolean} isOpen 是否打开射线检测
         */
        zhiu_THREEJS_ToggleRaycast: function (isOpen) {
            zhiu._isOpenRayCast = isOpen;
        },

        /**
         * 添加射线检测的回调
         * @function zhiu_THREEJS_AddRaycastListener
         * @param {RaycastAction} raycastAction 射线检测的回调
         */
        zhiu_THREEJS_AddRaycastListener: function (raycastAction) {
            ZhiUTech_MsgCenter.L_AddListener("射线检测", raycastAction);
        },

        /**
         * 添加3D标注的射线检测的回调
         * @function zhiu_THREEJS_AddRaycast3DPointListener
         * @param {Raycast3DPointAciton} raycast3DPointAciton 3D标注的射线检测的回调
         */
        zhiu_THREEJS_AddRaycast3DPointListener: function (raycast3DPointAciton) {
            ZhiUTech_MsgCenter.L_AddListener("3D标注射线检测", raycast3DPointAciton);
        },

        /**
         * 获取点击的位置(如果回调内返回undefined,回调将会继续被调用,直到出现有效值)
         * @function zhiu_THREEJS_GetTouchPoint
         * @param {TouchAction} pointCallback 获取点击位置的事件
         * @param {TouchMsgAciton} [msgCallback] 获取点击位置信息的事件
         */
        zhiu_THREEJS_GetTouchPoint: function (pointCallback, msgCallback = undefined) {
            zhiu._isListenClick = true;
            zhiu._clickPointCallback = pointCallback;

            zhiu._clickMsgCallback = msgCallback;
        },

        /**
         * 创建3d标注
         * @function zhiu_THREEJS_Make3DPoint
         * @param {string} id 用于控制3d标注
         * @param {THREE.Vector3} position 3d标注的位置
         * @param {float} scale 缩放系数 0.1-1 自动限制
         * @param {THREE.Color} newColor threejs的颜色
         */
        zhiu_THREEJS_Make3DPoint: function (id, position, scale,newColor=new THREE.Color(1,0,0)) {
            _THREEJS_Make3DPoint(id, position, scale,newColor);
        },

        /**
         * 删除3d标注
         * @function zhiu_THREEJS_Delete3DPoint
         * @param {string} id 创建时填入的id
         * @return {boolean} 返回是否删除成功
         */
        zhiu_THREEJS_Delete3DPoint: function (id) {
            return _THREEJS_Delete3DPoint(id);
        },

        /**
         * 删除所有3d标注
         * @function zhiu_THREEEJS_DeleteAll3DPoint
         */
        zhiu_THREEEJS_DeleteAll3DPoint: function () {
            _THREEJS_DeleteAll3DPoint();
        },

        /**
         * 设置3d标注可见性
         * @function zhiu_THREEEJS_Set3DPointVisible
         * @param {boolean} isVisible 是否显示
         */
        zhiu_THREEEJS_Set3DPointVisible: function (isVisible) {
            _THREEJS_Set3DPointVisible(isVisible);
        },


        // endregion

        // region 过滤器相关

        /**
         * 筛选当前选中构件的体积(支持大于小于 是否包含等于)
         * @function zhiu_FilterTool_FilterNowSelectionVolume
         * @param {float} volume 目标体积阈值
         * @param {boolean} isGreater true为大于目标,false为小于目标
         * @param {boolean} needEqual 是否包含等于
         * @param {FilterAction} successAction 筛选结果的回调
         * @param {boolean} [needDelete] 是否需要删除掉结果
         */
        zhiu_FilterTool_FilterNowSelectionVolume: function (volume, isGreater, needEqual, successAction, needDelete = false) {
            let targets = _GetSelection();
            _FilterTool_Volume(targets, volume, isGreater, needEqual, function (idList) {
                if (needDelete) {
                    _ClearAllSelection();
                    _SetAggregateSelect(idList);
                }
                if (successAction) {
                    successAction(idList);
                }
            });

        },

        /**
         * 根据id组筛选体积(支持大于小于 是否包含等于)
         * @function zhiu_FilterTool_FilterVolumeWithId
         * @param {float} volume 目标体积阈值
         * @param {boolean} isGreater true为大于目标,false为小于目标
         * @param {boolean} needEqual 是否包含等于
         * @param {string|string[]} ids 需要筛选的id,单个或者多个都可以
         * @param {FilterAction} successAction 筛选结果的回调
         */
        zhiu_FilterTool_FilterVolumeWithId: function (volume, isGreater, needEqual, ids, successAction) {
            let targets = _GetAggregateDataWithId(ids);
            _FilterTool_Volume(targets, volume, isGreater, needEqual, function (idList) {
                if (successAction) {
                    successAction(idList);
                }
            });
        },

        /**
         * 筛选当前选中构件的名称(支持正反筛选)
         * @function zhiu_FilterTool_FilterNowSelectionName
         * @param {string} name 要筛选的名称
         * @param {boolean} isIgnore true为忽略包含该名称的构件,false为仅需要包含该名称的构件
         * @param {FilterAction} successAction 删选结果的回调
         * @param {boolean} [needDelete] 是否需要删除掉结果
         */
        zhiu_FilterTool_FilterNowSelectionName: function (name, isIgnore, successAction, needDelete = false) {
            let targets = _GetSelection();
            _FilterTool_Name(targets, name, isIgnore, function (idList) {
                if (needDelete) {
                    _ClearAllSelection();
                    _SetAggregateSelect(idList);
                }
                if (successAction) {
                    successAction(idList);
                }
            });
        },

        /**
         * 根据id组筛选名称(支持正反筛选)
         * @function zhiu_FilterTool_FilterNowNameWithId
         * @param {string} name 要筛选的名称
         * @param {boolean} isIgnore true为忽略包含该名称的构件,false为仅需要包含该名称的构件
         * @param {string|string[]} ids 需要筛选的id,单个或者多个都可以
         * @param {FilterAction} successAction 筛选结果的回调
         */
        zhiu_FilterTool_FilterNowNameWithId: function (name, isIgnore, ids, successAction) {
            let targets = _GetAggregateDataWithId(ids);
            _FilterTool_Name(targets, name, isIgnore, function (idList) {
                if (successAction) {
                    successAction(idList);
                }
            });
        },

        // endregion

        // endregion

    };

    // region 自执行
    (function () {
        // region 常用内部变量
        /**
         * 是否就绪
         */
        zhiu._member._isReady=false;
        /**
         * 第一次加载模型
         */
        zhiu._member._isFirstModelLoader=true;
        /**
         * 模型加载选项
         */
        zhiu._member._modelOptionsList=[];
        /**
         * 是否准备好加载
         */
        zhiu._member._isReadyToLoad=false;
        /**
         * 模型顶级父物体名称为key,模型原有id为value的键值对
         */
        zhiu._member._hideModelDic={};
        /**
         * 预加载模型队列
         */
        zhiu._member._preloadingModelsQueue=[];
        /**
         * 用于存储颜色组
         */
        zhiu._member._colorData={};
        /**
         * 模型GUID为key,模型为value的键值对
         */
        zhiu._member._modelGUIDDic={};
        /**
         * 是否需要ui
         * @private
         */
        zhiu._member._needUI=false;
        // endregion
        // region 测量工具
        zhiu._member._measure={};
        // zhiu._member._measure._measureMgr=undefined;
        // endregion
    })();
    // endregion
    // region 内部
    // region 常用方法

    /**
     * 初始化viewer
     * @param {object} div 承载viewer 的容器
     * @param {string|ModelOptions} arg 模型地址 or 模型options
     * @private
     */
    function _InitializeViewer(div, arg) {

        if (typeof(arg) === "string") {
            arg = _MakeModelOpltionsWithURL(arg);
        }
        arg.GUID=_GetGUID();

        zhiu._member._modelOptionsList[0] = arg;
        zhiu._path = arg.FilePath;
        if (!div || !arg.FilePath) {
            ZhiUTech_MsgCenter.L_SendMsg("警告", "div或者地址参数未存在导致失败");
            return;
        }
        zhiu.div = div;
        let options = {
            'env': 'Local',
            'language': 'zh-HANS',
            useConsolidation: true,
            useADP: false
        };
        zhiu.MainCore.Viewing.Initializer(options, function () {
            zhiu._member._isReady = true;
            ZhiUTech_MsgCenter.L_SendMsg("日志", "承载器启动");
        });
        return arg.GUID;
    }
    /**
     * 默认设置
     * @private
     */
    function _DefaultSettings() {
        zhiu.viewer.setBackgroundColor(255, 255, 255, 128, 128, 128);// 设置页面背景颜色
        zhiu.viewer.getCamera().toPerspective();// 相机模式
        zhiu.viewer.setSelectionColor(new THREE.Color(1, 0.53, 0), zhiu.MainCore.Viewing.SelectionMode.REGULAR);// 设置选中颜色
        zhiu.viewer.setReverseZoomDirection(true);// 设置鼠标滚轮缩放反转
        zhiu.viewer.utilities.setPivotColor("#FFF400", 1);// 设置焦点颜色及透明度
        zhiu.viewer.setGhosting(true);// 是否打开虚影
        zhiu.viewer.impl.toggleEnvMapBackground(false);// 关闭背景
    }
    function _CreatefCubeView() {
        zhiu.viewer.createViewCube(); //生成小房子按钮
        zhiu.viewer.displayViewCube(true); //生成Cube
    }
    /**
     * 根据url制作options
     * @param {string} url 模型地址
     * @private
     */
    function _MakeModelOpltionsWithURL(url) {
        let str = url.split("/");
        let options = {};
        options.FileName = str[str.length - 1].replace(".esd", "");
        options.FilePath = url;
        options.DBPath = url.replace((url.substring((url.lastIndexOf("/") + 1))), "SecondDb.db");
        return options;
    }
    /**
     * 获取单独属性
     * @param key 属性名称
     * @param list 列表
     * @returns {Array} 属性列表
     * @private
     */
    function _GetPropertyByList(key, list) {
        let newList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].properties) {
                for (let j = 0; j < list[i].properties.length; j++) {
                    if (list[i].properties[j].displayName === key) {
                        if (list[i].properties[j].displayValue !== ""
                            && list[i].properties[j].displayValue.toString().indexOf("无") === -1
                            && list[i].properties[j].displayValue !== undefined) {
                            newList.push(list[i].properties[j].displayValue);
                        }
                    }
                }
            }
        }
        return newList;
    }
    /**
     * 获取dbid与单独属性的对照表
     * @param key 属性名称
     * @param list 列表
     * @returns {Array} 属性列表
     * @private
     */
    function _GetPropertyAndIdDictionaryByList(key, list) {
        let newList = {};
        for (let i = 0; i < list.length; i++) {
            if (list[i].properties) {
                for (let j = 0; j < list[i].properties.length; j++) {
                    if (list[i].properties[j].displayName === key) {
                        if (list[i].properties[j].displayValue !== ""
                            && list[i].properties[j].displayValue.toString().indexOf("无") === -1
                            && list[i].properties[j].displayValue !== undefined) {
                            newList[list[i].dbId] = list[i].properties[j].displayValue;
                        }
                    }
                }
            }
        }
        return newList;
    }
    /**
     * 单独获取构件名称
     * @param {object[]}list 数据
     * @return {Array[]}
     * @private
     */
    function _GetNameByList(list) {
        let newList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].name) {
                newList[list[i].externalId] = list[i].name;
            }
        }
        return newList;
    }
    /**
     * 初始化externalId的方法,支持刷新
     * @private
     */
    function _RefreshExternalId() {
        let list = zhiu.viewer.impl.modelQueue().getModels();
        for (let i = 0; i < list.length; i++) {
            list[i]._ModelId = i;
        }
        zhiu.L_ExternalIdToDbIdDic = {};
        zhiu.L_DbIdToExternalIdDic = {};
        for (let i = 0; i < list.length; i++) {
            list[i].getExternalIdMapping(function (arg) {
                zhiu.L_ExternalIdToDbIdDic[i] = arg;
                zhiu.L_DbIdToExternalIdDic[i] = {};
                for (let key in arg) {
                    zhiu.L_DbIdToExternalIdDic[i][arg[key]] = key;
                }
            });
            zhiu.L_GetExternalIdsWithDbIds = _GetExternalIdsWithDbIds;
            zhiu.L_GetDbIdsWithExternalIds = _GetDbIdsWithExternalIds;
        }
    }
    /**
     * 根据dbId列表获取externalId
     * @param dbIds 需要转换的dbId 可以数组可以单个
     * @param modelIndex 模型编号 默认为主模型
     * @returns {*} 返回转换后的数组或者单个
     * @private
     */
    function _GetExternalIdsWithDbIds(dbIds, modelIndex = 0) {
        if (Array.isArray(dbIds)) {
            let array = [];
            for (let i = 0; i < dbIds.length; i++) {
                if (zhiu.L_DbIdToExternalIdDic[modelIndex][dbIds[i]]) {
                    array.push(zhiu.L_DbIdToExternalIdDic[modelIndex][dbIds[i]]);
                } else {
                    array.push(undefined);
                }
            }
            return array;
        } else {
            if (zhiu.L_DbIdToExternalIdDic[modelIndex][dbIds]) {
                return zhiu.L_DbIdToExternalIdDic[modelIndex][dbIds];
            } else {
                return undefined;
            }
        }
    }
    /**
     * 根据externalId列表获取dbId
     * @param externalIds 需要转换的externalId可以数组可以单个
     * @param modelIndex 模型编号 默认为主模型
     * @returns {*} 返回转换后的数组或者单个
     * @private
     */
    function _GetDbIdsWithExternalIds(externalIds, modelIndex = 0) {
        if (Array.isArray(externalIds)) {
            let array = [];
            for (let i = 0; i < externalIds.length; i++) {
                if (zhiu.L_ExternalIdToDbIdDic[modelIndex][externalIds[i]]) {
                    array.push(zhiu.L_ExternalIdToDbIdDic[modelIndex][externalIds[i]]);
                } else {
                    array.push(undefined);
                }
            }
            return array;
        } else {
            if (zhiu.L_ExternalIdToDbIdDic[modelIndex][externalIds]) {
                return zhiu.L_ExternalIdToDbIdDic[modelIndex][externalIds];
            } else {
                return undefined;
            }
        }
    }
    /**
     * 递归子构件
     * @param id 需要递归的构件
     * @param list 容器
     * @param data 该构件所属模型数据
     * @private
     */
    function _RecursionChildId(id, list, data) {
        let length = data.getNumChildren(id);
        if (length < 1) {
            if (list.indexOf(id) === -1) {
                list.push(id);
            }
            return;
        }
        data.findNodeChild(id, function (id) {
            _RecursionChildId(id, list, data);
        });

    }
    /**
     * 根据多选数据获取id
     * @param {SelectionData[]} aggregateData 多选数据
     * @param {boolean} justArray 是否只返回数组
     * @return {Array|object} 根据justArray返回所需要的格式
     * @private
     */
    function _GetIdWithData(aggregateData,justArray) {
        if (justArray) {
            let result = [];
            for (let i = 0; i < aggregateData.length; i++) {
                result = result.concat(_GetIdsWithModel(aggregateData[i].selection, aggregateData[i].model));
            }
            return result;
        } else {
            let result = {};
            for (let i = 0; i < aggregateData.length; i++) {
                result[aggregateData[i].model._ModelId] = _GetIdsWithModel(aggregateData[i].selection, aggregateData[i].model);
            }
            return result;
        }
    }
    /**
     * 根据模型数据获取externalId
     * @param targets 目标id
     * @param model 目标模型
     * @returns {*}
     * @private
     */
    function _GetIdsWithModel(targets, model) {
        let list = [];
        for (let i = 0; i < targets.length; i++) {
            _RecursionChildId(targets[i], list, model.getData().instanceTree.nodeAccess);
        }
        if(zhiu.L_GetExternalIdsWithDbIds===undefined) return undefined;
        return zhiu.L_GetExternalIdsWithDbIds(list, model._ModelId);
    }
    /**
     * 根据模型数据获取对应属性 (单个模型)
     * @param targets 目标的dbId
     * @param model 目标模型
     * @param successCallback 成功的回调 参数为属性组
     * @param errorCallback 失败的回调
     * @private
     */
    function _GetPropertiesWithModel(targets, model, successCallback, errorCallback) {
        let promiseList = [];
        let result = [];
        for (let i = 0; i < targets.length; i++) {
            promiseList.push(new Promise((resolve, reject) => {
                model.getProperties(targets[i], function (arg) {
                    return resolve(arg);
                }, function (error) {
                    return reject(error);
                });
            }));
        }
        Promise.all(promiseList).catch(
            error => {
                errorCallback(error);
            }
        ).then(
            list => {
                for (let i = 0; i < list.length; i++) {
                    result.push(list[i]);
                }
                successCallback(result);
            }
        );
    }
    /**
     * 根据模型数据获取对应属性 (多模型)
     * @param targets 目标的dbId
     * @param successCallback 成功的回调 参数为属性组
     * @param errorCallback 失败的回调
     * @private
     */
    function _GetPropertiesWithModels(targets, successCallback, errorCallback) {
        let promiseList = [];
        let result = {};
        for (let i = 0; i < targets.length; i++) {
            promiseList.push(new Promise((resolve, reject) => {
                _GetPropertiesWithModel(targets[i].selection, targets[i].model, function (arg) {
                    resolve(arg);
                }, function (error) {
                    reject(error);
                });
            }));
        }
        Promise.all(promiseList)
            .catch(
                error => {
                    errorCallback(error);
                })
            .then(
                list => {
                    for (let i = 0; i < list.length; i++) {
                        result[targets[i].model._ModelId] = list[i];
                    }
                    successCallback(result);
                });
    }
    /**
     * 根据原生数据获取id和属性字典(原生数据来自_GetPropertiesWithModels)
     * @param {Object} result id和属性字典
     * @private
     */
    function _GetPropertiesDictionaryByNativeProperties(result) {
        let temp={};
        for(let list in result){
            for (let i = 0; i < result[list].length; i++) {
                let obj={};
                obj.name=result[list][i].name;
                obj.externalId=result[list][i].externalId;
                obj.properties={};
                let prop=result[list][i].properties;
                for (let k = 0; k < prop.length; k++) {
                    obj.properties[prop[k].displayName]=prop[k].displayValue;
                }
                temp[obj.externalId]=obj;
            }
        }
        return temp;
    }
    /**
     * 根据选中数据获取体积总和
     * @param {SelectionData[]} aggregateData 多选数据
     * @param {VolumeAction} volumeAction 获取成功的回调 参数为总和
     * @private
     */
    function _GetVolumeWithData(aggregateData,volumeAction) {
        _GetPropertiesWithModels(aggregateData, function (arg) {
            let result = 0.0;
            for (let item in arg) {
                let list = _GetPropertyByList("体积", arg[item]);
                for (let i = 0; i < list.length; i++) {
                    result += parseFloat(list[i]);
                }
            }
            volumeAction(result);
        }, function (error) {
            ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取聚合体积属性出现错误"]);
        })
    }
    /**
     * 根据属性搜索构件 不能搜空值或者0
     * @param {model } model 模型
     * @param {string} valueString 要搜索的值
     * @param {SearchAction} SearchAction 找到后的回调
     * @param {ErrorAction} ErrorAction 错误的回调
     * @param {string} PropertyName 要找到属性名称
     * @private
     */
    function _SearchModelWithProperty(model, valueString, SearchAction, ErrorAction, PropertyName) {
        model.search(valueString, function (arg) {
            SearchAction(zhiu.L_GetExternalIdsWithDbIds(arg, model._ModelId));
        }, ErrorAction, [PropertyName]);
    }
    /**
     * 刷新场景
     * @private
     */
    function _RefreshScene() {
        zhiu.viewer.impl.invalidate(true, true, true);
    }
    /**
     * 加载模型 (自动安全加载)
     * @param {string|ModelOptions} arg 模型地址 or 模型options
     * @param {function} callback 模型加载成功的回调
     * @private
     */
    function _LoadModel(arg,callback) {
        if (typeof(arg) === "string") {
            arg = _MakeModelOpltionsWithURL(arg);
        }
        arg.GUID=_GetGUID();
        arg.LoadModelSuccessCallback=callback;

        zhiu._member._modelOptionsList[zhiu._member._modelOptionsList.length] = arg;

        if (!zhiu._member._isReadyToLoad) {
            zhiu._member._preloadingModelsQueue.push(arg);
            ZhiUTech_MsgCenter.L_SendMsg("警告", "模型未加载,进入等待队列!");
        } else {
            zhiu._member._isReadyToLoad = false;
            _LoadModelCore(arg);
        }
        return arg.GUID;
    }
    /**
     * 成功加载后的事件
     * @private
     */
    function _LoadModelAction() {
        if (zhiu._member._preloadingModelsQueue.length !== 0) {
            let arg = zhiu._member._preloadingModelsQueue.shift();
            _LoadModelCore(arg);
        } else {
            zhiu._member._isReadyToLoad = true;
            ZhiUTech_MsgCenter.L_SendMsg("警告", "当前所有模型加载已完毕");
        }
    }
    /**
     * 加载模型 核心方法
     * @param {ModelOptions} arg 模型加载信息
     * @private
     */
    function _LoadModelCore(arg) {
        ZhiUTech_MsgCenter.L_SendMsg("模型开始加载",arg);
        zhiu.viewer.loadModel(arg.FilePath,undefined,function (model) {
            model._ModelGUID=arg.GUID;
            if(arg.LoadModelSuccessCallback){
                arg.LoadModelSuccessCallback();
            }
        });
    }
    /**
     * 卸载模型
     * @param {model} model 模型序号
     * @private
     */
    function _UnloadModel(model) {
        zhiu.viewer.impl.unloadModel(model);
        _RefreshModelOptionsList();
    }
    /**
     * 查看当前加载器是否空闲
     * @return {boolean} 返回是否空闲
     * @private
     */
    function _IsLoaderFree() {
        return zhiu._member._isReadyToLoad;
    }
    /**
     * 刷新模型配置信息表
     * @private
     */
    function _RefreshModelOptionsList() {
        let newList = [];
        for (let i = 0; i < zhiu._member._modelOptionsList.length; i++) {
            if (zhiu._member._modelOptionsList[i] !== undefined) {
                newList.push(zhiu._member._modelOptionsList[i])
            }
        }
        zhiu._member._modelOptionsList = newList;
    }
    /**
     * 根据获取聚合选择数据
     * @param {string|string[]} id 单个id 或 id数组都可以
     * @return {SelectionData[]} 聚合数据包
     * @private
     */
    function _GetAggregateDataWithId(id) {
        let result = [];
        if (!Array.isArray(id)) {
            id = [id];
        }
        let index = 0;
        for (let item in zhiu.L_ExternalIdToDbIdDic) {
            let isChange = false;
            for (let i = 0; i < id.length; i++) {
                if (zhiu.L_ExternalIdToDbIdDic[item][id[i]] !== undefined) {
                    if (!result[index]) {
                        result[index] = {};
                        result[index].selection = [];
                        result[index].model = _GetModelWithModelIndex(item);
                        isChange = true;
                    }
                    result[index].selection.push(zhiu.L_ExternalIdToDbIdDic[item][id[i]]);
                }
            }
            if (isChange) {
                index++;
            }
        }
        return result;
    }
    /**
     * 根据模型序号获取模型
     * @param {number} modelIndex 模型序号
     * @return {model|undefined} 返回模型或者undefined
     * @private
     */
    function _GetModelWithModelIndex(modelIndex) {
        if (zhiu.viewer.impl.modelQueue().getModels()[modelIndex]) {
            return zhiu.viewer.impl.modelQueue().getModels()[modelIndex];
        } else {
            return undefined;
        }
    }
    /**
     * 根据模型GUID获取模型
     * @param {string} modelGUID 模型GUID
     * @return {model|undefined} 返回模型或者undefined
     * @private
     */
    function _GetModelWithModelGUID(modelGUID) {
        if (zhiu._member._modelGUIDDic[modelGUID]) {
            return zhiu._member._modelGUIDDic[modelGUID];
        } else {
            return undefined;
        }
    }
    /**
     * 根据聚合数据聚焦
     * @param {object[]} data 聚合数据
     * @private
     */
    function _FocusObject(data) {
        zhiu.viewer.impl.fitToView(data);
    }
    /**
     * 获取选择
     * @return {SelectionData[]} 返回选中的对象组 含模型及选中id
     * @private
     */
    function _GetSelection() {
        return zhiu.viewer.getAggregateSelection();
    }
    /**
     * 设置模型隐藏显示
     * @param {model} model 模型
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _SetModelVisibility(model, isShow) {
        model.setAllVisibility(isShow);
    }
    /**
     * 设置显示隐藏 (备注:不会触发官方回调)
     * @param {boolean} isShow 是否显示
     * @param {boolean} [needCallback=false] 是否需要回调(该回调控制树状栏)
     * @private
     */
    function _SetAllVisibility(isShow,needCallback=true) {
        let list = zhiu.viewer.impl.modelQueue().getModels();
        for (let i = 0; i < list.length; i++) {
            list[i].setAllVisibility(isShow);
        }
        zhiu.viewer.impl.invalidate(true, true, true);
        if(needCallback&&isShow){
            ZhiUTech_MsgCenter.L_SendMsg("开关复选框_树状图",isShow);
        }
    }
    /**
     * 获取所有模型
     * @return {model[]} 模型列表
     * @private
     */
    function _GetAllModels() {
        return zhiu.viewer.impl.modelQueue().getModels();
    }
    /**
     * 根据多选信息隔离构件 (备注:不会触发官方回调)
     * @param {SelectionData[]} data 选中信息
     * @private
     */
    function _IsolateObject(data) {
        if(data.length>0){
            _SetAllVisibility(false);
            for (let i = 0; i < data.length; i++) {
                data[i].model.visibilityManager.isolate(data[i].selection);
            }
            ZhiUTech_MsgCenter.L_SendMsg("构件隔离_自定义",_GetIdWithData(data,true));

        }else{
            _SetAllVisibility(true);
        }

    }
    /**
     * 根据hideModel返回的唯一key来显示模型
     * @param {string} key 调用_HideModel后返回的key
     * @private
     */
    function _ShowModel(key) {
        if (zhiu._member._hideModelDic[key]) {
            zhiu.viewer.showModel(zhiu._member._hideModelDic[key]);
            ZhiUTech_MsgCenter.L_SendMsg("显示模型");
            delete zhiu._member._hideModelDic[key];
        } else {
            ZhiUTech_MsgCenter.L_SendMsg("错误", "并未发现需要显示模型");
        }
    }
    /**
     * 根据当前模型序号隐藏模型 (切记模型隐藏后等同删除,所有模型序号将往前补位;且隐藏后模型不会产生虚影)
     * @param {string} modelIndex 模型进入场景的序号
     * @return {string} 该范围值为显示模型的唯一凭证,请保留完好,一旦key丢失将无法找回隐藏的模型
     * @private
     */
    function _HideModel(modelIndex) {
        let model = zhiu.viewer.impl.modelQueue().getModels()[modelIndex];
        let modelName = model.getData().instanceTree.nodeAccess.name(1) + new Date().getTime();
        zhiu._member._hideModelDic[modelName] = model.id;
        zhiu.viewer.hideModel(model.id);
        ZhiUTech_MsgCenter.L_SendMsg("隐藏模型");
        return modelName;
    }
    /**
     * 根据id设置当前选择  (备注:该方法不会清空选择,需要单独清空)
     * @param {string|string[]} id 单个id或者id数组
     * @private
     */
    function _SetAggregateSelect(id) {
        let list = _GetAggregateDataWithId(id);
        for (let i = 0; i < list.length; i++) {
            list[i].ids = list[i].selection;
        }
        zhiu.viewer.impl.selector.setAggregateSelection(list);
    }
    /**
     * 获取名称根据id
     * @param {SelectionData[]}  aggregateData 多选数据
     * @return {object[]} id为key,name为value
     * @private
     */
    function _GetNameWithData(aggregateData) {
        let result = {};
        for (let i = 0; i < aggregateData.length; i++) {
            let data = aggregateData[i].model.getData().instanceTree.nodeAccess;
            for (let j = 0; j < aggregateData[i].selection.length; j++) {
                let id = zhiu.L_DbIdToExternalIdDic[aggregateData[i].model._ModelId][aggregateData[i].selection[j]];
                if (!id) continue;
                result[id] = data.name(aggregateData[i].selection[j]);
            }
        }
        return result;
    }
    /**
     * 根据选中数据设置颜色
     * @param {SelectionData[]} data 选中数据格式
     * @param {THREE.Vector4} v4 四元数
     * @private
     */
    function _SetObjectColorWithData(data, v4) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].selection.length; j++) {
                data[i].model.setThemingColor(data[i].selection[j], v4);
            }
        }
        zhiu.viewer.impl.invalidate(true);
    }
    /**
     * 删除所有颜色
     * @private
     */
    function _ClearAllColor() {
        let list = zhiu.viewer.impl.modelQueue().getModels();
        for (let i = 0; i < list.length; i++) {
            list[i].clearThemingColors();
        }
        zhiu.viewer.impl.invalidate(true, true, true);
    }
    /**
     * 根据选中数据清除颜色
     * @param {SelectionData[]} data 选中数据格式
     * @private
     */
    function _ClearColorWithData(data) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].selection.length; j++) {
                data[i].model.setThemingColor(data[i].selection[j], new THREE.Vector4(1, 1, 1, 0));
            }
        }
        zhiu.viewer.impl.invalidate(true, true, true);
    }
    /**
     * 根据多选信息隐藏构件
     * @param {SelectionData[]} data 选中信息
     * @private
     */
    function _HideObject(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].model.visibilityManager.hide(data[i].selection);
        }
    }
    /**
     * 获取GUID
     * @return {string} GUID
     * @private
     */
    function _GetGUID() {
        /**
         * @return {string}
         */
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    /**
     * 清除所有选择
     * @private
     */
    function _ClearAllSelection() {
        zhiu.viewer.clearSelection();
    }
    /**
     * 刷新 模型GUID为key,模型为value的键值对
     * @private
     */
    function _RefreshModelGUIDDic() {
        let list = zhiu.viewer.impl.modelQueue().getModels();
        zhiu._member._modelGUIDDic={};
        for (let i = 0; i < list.length; i++) {
            zhiu._member._modelGUIDDic[list[i]._ModelGUID]=list[i];
        }

    }
    /**
     * 获取所有id
     * @param {boolean} [justArray=true] true:仅数组 false:模型序号为key,构件数组为value的键值对
     * @returns {string[]} 根据条件返回
     * @private
     */
    function _GetAllIds(justArray) {
        if(justArray){
            let list=[];
            for (let dic in zhiu.L_ExternalIdToDbIdDic) {
                list=list.concat(Object.keys(zhiu.L_ExternalIdToDbIdDic[dic]))
            }
            return list;
        }else{
            let dictionary = {};
            for (let dic in zhiu.L_ExternalIdToDbIdDic) {
                dictionary[dic] = Object.keys(zhiu.L_ExternalIdToDbIdDic[dic]);
            }
            return dictionary;
        }
    }
    /**
     * 特性面板 当选中更换时的处理逻辑 (特性面板专用)
     * @param {PropertiesPanelAction} propertiesAction 成功后的回调 参数为属性数组
     * @private
     */
    function _PropertiesPanel_OnSelectionChanged(propertiesAction) {
        let target = zhiu.viewer.getAggregateSelection();
        if(target){
            if(target.length!==1||(target[0]&&target[0].selection.length>1)){
                propertiesAction(undefined);
            }else{
                _GetPropertiesWithModels(target, function (arg) {
                    for(let item in arg)
                    {
                        let result=_SelectChanged(arg[item][0]);
                        propertiesAction(result.result);
                        return;
                    }
                }, function (error) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取属性出现错误"]);
                })
            }
        }else{
            propertiesAction(undefined);
        }


        function _SelectChanged(obj){
            let target=undefined;
            if(obj){
                target={};
                target.object=obj;
                target.result=[];
                let properties=obj.properties;
                for(let i=2;i<properties.length;i++){
                    let node=_GetParent(target.result,properties[i].displayCategory,target.result);
                    let temp={};
                    temp.name=properties[i].displayName;
                    temp.value=properties[i].displayValue;
                    node.children.push(temp);
                }
            }
            return target;
            // target.result 是你需要的数据
            // target.object 是构件所有信息,备用 防止二维码要用
        }
        function _GetParent(list,targetName,parent){
            for(let i=0;i<list.length;i++){
                if(list[i].parent){
                    if(list[i].parent.name===targetName){
                        return list[i];
                    }
                }
            }
            let newNode=_MakeNode(targetName);
            parent.push(newNode);
            return newNode;
        }
        function _MakeNode(parentName){
            let obj={};
            obj.parent={};
            obj.parent.name=parentName;
            obj.children=[];
            return obj;
        }

    }
    /**
     * 特性面板 当选中更换时的处理逻辑 (特性面板专用)
     * @param {ChildPropertiesAction} propertiesAction 成功后的回调 参数为属性数组
     * @private
     */
    function _GetNowSelectionAllChildProperties(propertiesAction) {
        let target = zhiu.viewer.getAggregateSelection();
        if(target){
            if(target.length!==1||(target[0]&&target[0].selection.length>1)){
                propertiesAction(undefined);
            }else{
                _GetPropertiesWithModels(target, function (arg) {
                    for(let item in arg)
                    {
                        let result={};
                        let list=arg[item][0].properties;
                        for (let i = 2; i < list.length; i++) {
                            result[list[i].displayName]=list[i].displayValue;
                        }
                        propertiesAction(result);
                        return;
                    }
                }, function (error) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取属性出现错误"]);
                })
            }
        }else{
            propertiesAction(undefined);
        }
    }
    /**
     * 全屏开关
     * @param {boolean} isFull 是否全屏
     * @private
     */
    function _ToggleFullScreen(isFull) {
        zhiu.viewer.setScreenMode(isFull?2:0);
    }
    /**
     * 获取体积表格
     * @param {VolumeTableAciton} volumeTableAction 回调
     * @private
     */
    function _GetVolumeTable(volumeTableAction) {
        let target = zhiu.viewer.getAggregateSelection();
        if(target){
            if(target.length<1){
                volumeTableAction(undefined);
            }else{
                _GetPropertiesWithModels(target, function (arg) {
                    let volumeTable=[];
                    for(let item in arg)
                    {
                        let list=arg[item];
                        for (let i = 0; i < list.length; i++) {
                            let obj=list[i];
                            let result={};// 分部工程名称 分项工程名称 体积
                            result.objName=obj.name;
                            result.objVolume=undefined;
                            result.fenbugongcheng=undefined;
                            result.fenxianggongcheng=undefined;
                            for (let j = 0; j < obj.properties.length; j++) {
                                if(result.fenbugongcheng&&result.fenxianggongcheng&&result.objVolume) break;
                                switch (obj.properties[j].displayName) {
                                    case "分部工程名称":
                                        result.fenbugongcheng=obj.properties[j].displayValue;
                                        break;
                                    case "分项工程名称":
                                        result.fenxianggongcheng=obj.properties[j].displayValue;
                                        break;
                                    case "体积":
                                        result.objVolume=obj.properties[j].displayValue;
                                        break;
                                }
                            }
                            volumeTable.push(result);
                        }
                    }
                    volumeTableAction(volumeTable);
                }, function (error) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取体积表格详情 出现问题!"]);
                })
            }
        }else{
            volumeTableAction(undefined);
        }
    }
    /**
     * 刷新VIEW页面比例
     * @private
     */
    function _RefreshViewRatio() {
        zhiu.viewer.resize();
    }
    // endregion
    // region THREE JS 相关

    /**
     * 初始化THREE JS场景
     * @private
     */
    function _THREEJS_Initialize_Scene() {
        zhiu.viewer.impl.createOverlayScene(zhiu._SCENE_NAME_LIFE);
        zhiu.viewer.impl.createOverlayScene(zhiu._SCENE_NAME_DEAD);
        zhiu._Camera_Ray = zhiu.viewer.impl.camera;
        zhiu._Camera_Dynamic = zhiu.viewer.autocam.camera;
    }

    /**
     * 初始化3d标注的材质几何,以及组
     * @private
     */
    function _THREEJS_Initialize3DPoint() {
        new THREE.TextureLoader().load(zhiu._3dPointImagePath, function (image) {
            let planeGeometry = new THREE.PlaneBufferGeometry(25, 25);
            zhiu._3dPointImage=image;
            zhiu._3dPointGroup = new THREE.Group();
            zhiu._3dPointGroup.name = "3dPoint";
            zhiu.viewer.impl.addOverlay(zhiu._SCENE_NAME_LIFE, zhiu._3dPointGroup);
            ZhiUTech_MsgCenter.L_SendMsg("3D标注初始化成功");
        });
    }

    /**
     * 根据场景名称获取场景
     * @param {string} sceneName 场景名称
     * @return {*} 如果返回undefined 代表未找到
     * @private
     */
    function _THREEJS_GetSceneWithName(sceneName) {
        if (zhiu.viewer.impl.overlayScenes.hasOwnProperty(sceneName)) {
            return zhiu.viewer.impl.overlayScenes[sceneName].scene;
        } else {
            return undefined;
        }
    }

    /**
     * 查看场景是否存在
     * @param {string} sceneName 场景名称
     * @return {boolean} 场景是否存在
     * @private
     */
    function _THREEJS_CheckSceneExist(sceneName) {
        return zhiu.viewer.impl.overlayScenes.hasOwnProperty(sceneName);
    }

    /**
     * 添加物体到场景内
     * @param {string} sceneName 场景名称
     * @param {THREE.Mesh} obj 需要添加的物体
     * @private
     */
    function _THREEJS_AddObject(sceneName, obj) {
        zhiu.viewer.impl.addOverlay(sceneName, obj);
    }

    /**
     * 从场景中删除物体
     * @param {string} sceneName 场景名称
     * @param {THREE.Mesh} obj 需要删除的物体
     * @private
     */
    function _THREEJS_DeleteObject(sceneName, obj) {
        zhiu.viewer.impl.removeOverlay(sceneName, obj);
    }

    /**
     * 删除场景内所有物体
     * @param {string} sceneName 场景名称
     * @private
     */
    function _THREEJS_DeleteAllObject(sceneName) {
        zhiu.viewer.impl.createOverlayScene(sceneName);
    }

    /**
     * 创建场景
     * @param {string} sceneName 场景名称
     * @private
     */
    function _THREEJS_CreateScene(sceneName) {
        zhiu.viewer.impl.createOverlayScene(sceneName);
    }

    /**
     * 删除场景
     * @param {string} sceneName 场景名称
     * @private
     */
    function _THREEJS_DeleteScene(sceneName) {
        zhiu.viewer.impl.removeOverlayScene(sceneName);
    }

    /**
     * 刷新场景(仅three场景)
     * @private
     */
    function _THREEJS_RefreshScene() {
        zhiu.viewer.impl.invalidate(false, false, true);
    }

    /**
     * 初始化射线
     * @private
     */
    function _THREEJS_InitializeRaycast() {
        window.addEventListener('click', _THREEJS_RaycastAction, true);
    }

    /**
     * 射线检测监听
     * @param {object} event 事件参数
     * @private
     */
    function _THREEJS_RaycastAction(event) {

        if (!zhiu._isOpenRayCast) return;

        let obj = zhiu.viewer.impl.overlayScenes[zhiu._SCENE_NAME_LIFE].scene.children;
        let pointerVector = new THREE.Vector3();
        let pointerDir = new THREE.Vector3();
        let ray = new THREE.Raycaster();
        let rect = zhiu.viewer.container.getBoundingClientRect();
        let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (zhiu._Camera_Ray.isPerspective) {
            pointerVector.set(x, y, 0.5);
            pointerVector.unproject(zhiu._Camera_Ray);
            ray.set(zhiu._Camera_Ray.position, pointerVector.sub(zhiu._Camera_Ray.position).normalize());
        } else {
            pointerVector.set(x, y, -1);
            pointerVector.unproject(zhiu._Camera_Ray);
            pointerDir.set(0, 0, -1);
            ray.set(pointerVector, pointerDir.transformDirection(zhiu._Camera_Ray.matrixWorld));
        }
        let result = ray.intersectObjects(obj, true);
        if (result.length > 0) {
            ZhiUTech_MsgCenter.L_SendMsg("射线检测", ray.intersectObjects(obj, true));
            ZhiUTech_MsgCenter.L_SendMsg("3D标注射线检测", result[0].object.name);
        }
    }

    /**
     * 根据相机旋转mesh
     * @param {THREE.Mesh} mesh 相机网格
     * @private
     */
    function _THREEJS_UpdateRotation(mesh) {
        mesh.rotation.x = zhiu._Camera_Ray.rotation.x;
        mesh.rotation.y = zhiu._Camera_Ray.rotation.y;
        mesh.rotation.z = zhiu._Camera_Ray.rotation.z;
    }

    /**
     * 相机刷新 当前仅刷新3d标注组
     * @private
     */
    function _THREEJS_CameraUpdate() {
        if (zhiu._3dPointGroup) {
            if (zhiu._3dPointGroup.visible) {
                for (let i = 0; i < zhiu._3dPointGroup.children.length; i++) {
                    _THREEJS_UpdateRotation(zhiu._3dPointGroup.children[i]);
                }
            }
        }
    }

    /**
     * 添加需要刷新的物体(跟随摄像机视角的物体)
     * @param {THREE.Mesh} obj 物体
     * @private
     */
    function _THREEJS_AddUpdateObject(obj) {
        zhiu._CameraUpdateList.push(obj);
    }

    /**
     * 初始化点击事件
     * @private
     */
    function _THREEJS_InitializeClick() {
        window.addEventListener('click', _THREEJS_ClickAction, true);
    }

    /**
     * 获取点击位置及点击信息事件
     * @param {object} event 点击回调参数
     * @private
     */
    function _THREEJS_ClickAction(event) {
        if (zhiu._isListenClick) {
            let viewport = zhiu.viewer.impl.getCanvasBoundingClientRect();
            let x = event.canvasX || event.clientX - viewport.left;
            let y = event.canvasY || event.clientY - viewport.top;
            let what = zhiu.viewer.clientToWorld(x, y, false);
            if (what) {
                zhiu._isListenClick = false;
                if (zhiu._clickPointCallback) {
                    zhiu._clickPointCallback(what.intersectPoint);
                } else {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", "点击位置回调丢失");
                }

                if (zhiu._clickMsgCallback) {
                    zhiu._clickMsgCallback(what);
                }

            } else {
                zhiu._clickPointCallback(undefined);
            }
        }
    }

    /**
     * 创建3d标注
     * @param {string} id 用于控制3d标注
     * @param {THREE.Vector3} position 3d标注的位置
     * @param {float} scale 缩放系数 0.1-1 自动限制
     * @param {THREE.Color} newColor 颜色
     * @private
     */
    function _THREEJS_Make3DPoint(id, position, scale,newColor) {

        // 新逻辑
        let planeGeometry = new THREE.PlaneBufferGeometry(25, 25);
        let mat = new THREE.MeshBasicMaterial({
            map: zhiu._3dPointImage,
            // depthTest: false,
            transparent:true,
        });
        let obj = new THREE.Mesh(
            planeGeometry,
            mat);
        obj.name = id;
        obj.position.set(position.x, position.y, position.z);
        scale = THREE.Math.clamp(scale, 0.1, 1);
        obj.scale.set(scale, scale, scale);
        obj.material.color=newColor;
        zhiu._3dPointGroup.add(obj);
        _THREEJS_UpdateRotation(obj);
        _THREEJS_RefreshScene();
    }

    /**
     * 删除3d标注
     * @param {string} id 创建时填入的id
     * @return {boolean} 返回是否删除成功
     * @private
     */
    function _THREEJS_Delete3DPoint(id) {
        if (zhiu._3dPointGroup) {
            for (let i = 0; i < zhiu._3dPointGroup.children.length; i++) {
                if (zhiu._3dPointGroup.children[i].name === id) {
                    zhiu._3dPointGroup.remove(zhiu._3dPointGroup.children[i]);
                    _THREEJS_RefreshScene();
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    /**
     * 删除所有3d标注
     * @private
     */
    function _THREEJS_DeleteAll3DPoint() {
        _THREEJS_GetSceneWithName(zhiu._SCENE_NAME_LIFE).remove(zhiu._3dPointGroup);
        zhiu._3dPointGroup = new THREE.Group();
        zhiu._3dPointGroup.name = "3dPoint";
        zhiu.viewer.impl.addOverlay(zhiu._SCENE_NAME_LIFE, zhiu._3dPointGroup);
    }

    /**
     * 设置3d标注可见
     * @param isVisible
     * @private
     */
    function _THREEJS_Set3DPointVisible(isVisible) {
        zhiu._3dPointGroup.visible = isVisible;
    }

    // endregion
    // region 过滤器相关
    /**
     * 根据目标数据筛选体积(支持大于小于 是否包含等于)
     * @param {SelectionData[]} targets 目标数据
     * @param {float} volume 目标体积阈值
     * @param {boolean} isGreater true为大于目标,false为小于目标
     * @param {boolean} needEqual 是否包含等于
     * @param {FilterAction} successAction 筛选结果的回调
     * @param {ErrorAction} [errorAction] 错误的回调
     * @private
     */
    function _FilterTool_Volume(targets, volume, isGreater, needEqual, successAction, errorAction = undefined) {

        _GetPropertiesWithModels(targets, function (arg) {
            let idList = [];
            for (let modelIndex in arg) {
                let list = _GetPropertyAndIdDictionaryByList("体积", arg[modelIndex]);
                let newList = {};
                for (let id in list) {
                    let value=parseFloat(list[id]);
                    if (isGreater) {
                        // 大于
                        if (needEqual) {
                            // 包含等于
                            if (value >= volume) {
                                newList[id] = value;
                            }
                        } else {
                            // 不包含等于
                            if (value > volume) {
                                newList[id] = value;
                            }
                        }
                    } else {
                        // 小于
                        if (needEqual) {
                            // 是否包含等于
                            if (value <= volume) {
                                newList[id] = value;
                            }
                        } else {
                            // 不包含等于
                            if (value < volume) {
                                newList[id] = value;
                            }
                        }
                    }


                }
                let result = {};
                result.model = _GetModelWithModelIndex(parseInt(modelIndex));
                result.ids = Object.keys(newList).map(index => {
                    return parseInt(index)
                });
                idList = idList.concat(_GetExternalIdsWithDbIds(result.ids, modelIndex));
            }
            if (successAction) {
                successAction(idList);
            }

        }, function (error) {
            if (errorAction) {
                errorAction(error);
            }
            ZhiUTech_MsgCenter.L_SendMsg("错误", [error, "获取聚合体积属性出现错误"]);
        });
    }
    /**
     * 根据目标数据筛选名称(支持正反筛选)
     * @param {SelectionData[]} targets 目标数据
     * @param {string} name 要筛选的名称
     * @param {boolean} isIgnore true为忽略包含该名称的构件,false为仅需要包含该名称的构件
     * @param {FilterAction} successAction 筛选结果的回调
     * @private
     */
    function _FilterTool_Name(targets, name, isIgnore, successAction) {
        let idList = [];
        let result = _GetNameWithData(targets);
        for (let id in result) {

            if (isIgnore) {
                if (result[id].indexOf(name) === -1) {
                    idList.push(id);
                }
            } else {
                if (result[id].indexOf(name) !== -1) {
                    idList.push(id);
                }
            }
        }
        if (successAction) {
            successAction(idList);
        }
    }
    // endregion
    // region 测量工具相关
    function _Measure_GetTools() {
        if(!zhiu._member._measure._measureMgr){
            zhiu._member._measure._measureMgr=zhiu.viewer.getExtension('ZhiUTech.Measure');
            zhiu._member._measure._measureMgr.setPrecision(3);
            zhiu._member._measure._measureMgr.setUnits('m');
        }
        return zhiu._member._measure._measureMgr;
    }
    /**
     * 隐藏所有工具条
     * @private
     */
    function _Measure_HideToolBar() {
        if(!zhiu._member._needUI){
            for (let i = 0; i < zhiu.viewer.toolbar._controls.length; i++) {
                zhiu.viewer.toolbar._controls[i].setVisible(false);
            }
        }
    }
    /**
     * 打开距离测量
     * @private
     */
    function _Measure_OpenDistance() {
        _Measure_GetTools().setActive(true);
        _Measure_GetTools().activate("distance");
        _Measure_HideToolBar();
    }
    /**
     * 打开角度测量
     * @private
     */
    function _Measure_OpenAngle() {
        _Measure_GetTools().setActive(true);
        _Measure_GetTools().activate("angle");
        _Measure_HideToolBar();
    }
    /**
     * 打开校准测量
     * @private
     */
    function _Measure_OpenCalibrate() {
        _Measure_GetTools().setActive(true);
        _Measure_GetTools().activate("calibrate");
        _Measure_HideToolBar();
    }
    /**
     * 获取当前测量单位
     * @return {string} 测量单位
     * @private
     */
    function _Measure_GetUnits() {
        return _Measure_GetTools().getUnits();
    }
    /**
     * 设置当前测量单位
     * @param {string} units 单位(请注意格式)
     * @private
     */
    function _Measure_SetUnits(units) {
        _Measure_GetTools().setUnits(units);
    }
    /**
     * 获取当前测量精度
     * @return {number} 精度序号
     * @private
     */
    function _Measure_GetPrecision() {
        return _Measure_GetTools().getPrecision();
    }
    /**
     * 设置当前测量精度
     * @param {number} precision 精度序号 0-6
     * @private
     */
    function _Measure_SetPrecision(precision) {
        _Measure_GetTools().setPrecision(precision);
    }
    /**
     * 删除当前测量
     * @private
     */
    function _Measure_DeleteCurrent() {
        try{
            if(_Measure_GetTools().getMeasurement()){
                _Measure_GetTools().deleteCurrentMeasurement();
            }
        }catch(e){
            // window.alert("请选中需要删除的测量");
            let data =["请选中需要删除的测量","500",false];
            ZhiUTech_MsgCenter.L_SendMsg("方旋弹窗",data);
        }

    }
    /**
     * 关闭测量
     * @private
     */
    function _Measure_Close() {
        _Measure_GetTools().enableCalibrationTool(false);
        _Measure_GetTools().deleteCurrentMeasurement();
        _Measure_GetTools().setActive(false);
    }
    // endregion
    // region 截面工具相关
    /**
     * 通知中心: 设置截面
     * @param {string} mode 截面模式 (x,y,z,box)
     * @private
     */
    function _MsgCenter_SectionSetMode(mode) {
        _Section_SetMode(mode);
    }

    /**
     * 通知中心: 关闭截面分析
     * @private
     */
    function _MsgCenter_SectionClose() {
        _Section_Close();
    }
    // endregion
    // region 分解模型相关
    /**
     * 设置分解模型
     * @param {float} scale 大小 0-1
     * @private
     */
    function _Explode_SetScale(scale) {
        scale=THREE.Math.clamp(scale,0,1);
        zhiu.viewer.impl.explode(scale);
    }
    /**
     * 关闭分解模型
     * @private
     */
    function _Explode_Close() {
        zhiu.viewer.impl.explode(0);
    }
    // endregion
    // region 视角相关
    /**
     * 转至主视图
     * @private
     */
    function _Camera_GoMainView() {
        zhiu.viewer.navigation.setRequestHomeView(true);
    }
    /**
     * 设置相机模式
     * @param {boolean} isPerspective 是否为透视相机
     * @private
     */
    function _Camera_SetCameraModel(isPerspective = true) {
        if (isPerspective) {
            zhiu.viewer.getCamera().toPerspective();
        } else {
            zhiu.viewer.getCamera().toOrthographic();
        }
        zhiu.viewer.impl.invalidate(true, true, true);
    }
    /**
     * 将当前视图设为主视图
     * @private
     */
    function _Camera_SetNowViewToMainView() {
        zhiu.viewer.autocam.setHomeViewFrom(zhiu.viewer.getCamera());
        ZhiUTech_MsgCenter.L_SendMsg("保存默认视角",_Camera_GetCameraStringData());
    }
    /**
     * 重置主视图
     * @private
     */
    function _Camera_ResetMainView() {
        zhiu.viewer.autocam.resetHome();
    }
    /**
     * 根据字符串保存的相机信息来还原相机
     * @param {string} data 字符串信息
     * @param {boolean} needSetHome 是否设置为默认位置
     * @private
     */
    function _Camera_SetCameraWithStringData(data,needSetHome=false) {
        let view = JSON.parse(data);
        if (view != null) {
            let newView = {
                position: new THREE.Vector3(view.position.x, view.position.y, view.position.z),
                up: new THREE.Vector3(view.up.x, view.up.y, view.up.z),
                center: new THREE.Vector3(view.center.x, view.center.y, view.center.z),
                pivot: new THREE.Vector3(view.pivot.x, view.pivot.y, view.pivot.z),
                fov: view.fov,
                worldUp: new THREE.Vector3(view.worldUp.x, view.worldUp.y, view.worldUp.z),
                isOrtho: view.isOrtho
            };
            if(needSetHome) zhiu.viewer.autocam.setHomeViewFrom(newView);
            zhiu.viewer.autocam.goToView(newView);
        }
    }
    /**
     * 获取相机的字符串数据
     * @return {string} 字符串数据
     * @private
     */
    function _Camera_GetCameraStringData() {
        let view = zhiu.viewer.autocam.getCurrentView();
        return JSON.stringify(view);
    }
    // endregion
    // endregion
    // region 通知中心

    // region 通知中心Sender
    /**
     * 当viewer初始化成功
     * @private
     */
    function _OnViewerSuccess() {
        ZhiUTech_MsgCenter.L_SendMsg("日志", "zhiu_viewer success");
        ZhiUTech_MsgCenter.L_SendMsg("初始化成功");
        ZhiUTech_MsgCenter.L_SendMsg("模型开始加载",zhiu._member._modelOptionsList[0]);
    }

    /**
     * 模型加载成功的事件
     * @param {object} arg 事件
     * @private
     */
    function _OnModelLoaded(arg) {
        if (zhiu._member._isFirstModelLoader) {
            zhiu._member._isFirstModelLoader = false;
            ZhiUTech_MsgCenter.L_SendMsg("日志", "首次模型加载成功");
            ZhiUTech_MsgCenter.L_SendMsg("首次模型加载成功", arg.model);
            arg.model._ModelGUID=zhiu._member._modelOptionsList[0].GUID;
        }
        ZhiUTech_MsgCenter.L_SendMsg("日志", "模型加载成功");
        ZhiUTech_MsgCenter.L_SendMsg("模型加载成功", arg.model);
    }

    /**
     * 构件选择变更
     * @param arg
     * @private
     */
    function _OnSelectChanged(arg) {
        let targets=[];
        if(arg.selections.length>0){
            for (let i = 0; i < arg.selections.length; i++) {
                targets = targets.concat(_GetIdsWithModel(arg.selections[i].dbIdArray,arg.selections[i].model));
            }
        }
        ZhiUTech_MsgCenter.L_SendMsg("构件选择变更",targets);
        _PropertiesPanel_OnSelectionChanged(function (properties) {
            ZhiUTech_MsgCenter.L_SendMsg("特性面板构件选择变更",properties);
        });

    }

    /**
     * 模型卸载事件
     * @param {object} arg 消息
     * @private
     */
    function _OnModelUnloaded(arg) {
        ZhiUTech_MsgCenter.L_SendMsg("日志", "模型卸载成功");
        ZhiUTech_MsgCenter.L_SendMsg("模型卸载成功", arg.model);
    }

    /**
     * 相机更新事件
     * @param arg
     * @private
     */
    function _OnCameraChange(arg) {
        ZhiUTech_MsgCenter.L_SendMsg("相机更新", arg);
    }

    /**
     * 构件隐藏事件
     * @param arg
     * @private
     */
    function _OnHideObject(arg){
        let ids=_GetIdsWithModel(arg.nodeIdArray,arg.model);
        ZhiUTech_MsgCenter.L_SendMsg("构件隐藏",ids);

    }

    /**
     * 构件隔离事件
     * @param arg
     * @private
     */
    function _OnIsolateObject(arg){
        console.log(" >LJason< 日志：",arg);
        if(arg.isolation.length>0){
            for (let i = 0; i < arg.isolation.length; i++) {
                let ids=_GetIdsWithModel(arg.isolation[i].ids,arg.isolation[i].model);
                ZhiUTech_MsgCenter.L_SendMsg("构件隔离",ids);
            }
        }else{
            ZhiUTech_MsgCenter.L_SendMsg("构件隔离",[]);
        }
    }

    /**
     * UI加载成功事件
     * @private
     */
    function _OnUICreated(){
        ZhiUTech_MsgCenter.L_SendMsg("UI加载成功");
    }

    // endregion

    // region 通知中心Listener 内部
    ZhiUTech_MsgCenter.L_AddListener("初始化成功", _DefaultSettings);
    // ZhiUTech_MsgCenter.L_AddListener("初始化成功", zhiu.zhiu_ResetCameraWithLocalData);
    ZhiUTech_MsgCenter.L_AddListener("初始化成功", _THREEJS_Initialize_Scene);
    ZhiUTech_MsgCenter.L_AddListener("初始化成功", _THREEJS_Initialize3DPoint);
    ZhiUTech_MsgCenter.L_AddListener("初始化成功", _THREEJS_InitializeRaycast);
    ZhiUTech_MsgCenter.L_AddListener("初始化成功", _THREEJS_InitializeClick);
    ZhiUTech_MsgCenter.L_AddListener("初始化成功", _Measure_HideToolBar);
    // ZhiUTech_MsgCenter.L_AddListener("初始化成功", _CreatefCubeView);

    ZhiUTech_MsgCenter.L_AddListener("模型加载成功", _Camera_SetCameraModel);
    ZhiUTech_MsgCenter.L_AddListener("模型加载成功", _RefreshExternalId);
    ZhiUTech_MsgCenter.L_AddListener("模型加载成功", _RefreshModelGUIDDic);
    ZhiUTech_MsgCenter.L_AddListener("模型加载成功", _LoadModelAction);

    ZhiUTech_MsgCenter.L_AddListener("模型卸载成功", _RefreshExternalId);
    ZhiUTech_MsgCenter.L_AddListener("模型卸载成功", _RefreshModelGUIDDic);

    ZhiUTech_MsgCenter.L_AddListener("隐藏模型", _RefreshExternalId);
    ZhiUTech_MsgCenter.L_AddListener("隐藏模型", _RefreshModelGUIDDic);

    ZhiUTech_MsgCenter.L_AddListener("显示模型", _RefreshExternalId);
    ZhiUTech_MsgCenter.L_AddListener("显示模型", _RefreshModelGUIDDic);
    ZhiUTech_MsgCenter.L_AddListener("显示模型", _Camera_SetCameraModel);

    ZhiUTech_MsgCenter.L_AddListener("相机更新", _THREEJS_CameraUpdate);

    // endregion

    // region 通知中心Listener 外部
    // region 常用
    ZhiUTech_MsgCenter.L_AddListener("全部显示隐藏", _MsgCenter_SetAllVisibility);
    ZhiUTech_MsgCenter.L_AddListener("清除全部颜色", _MsgCenter_ClearAllColor);
    ZhiUTech_MsgCenter.L_AddListener("强制刷新", _MsgCenter_RefreshScene);
    ZhiUTech_MsgCenter.L_AddListener("根据ID隔离构件", _MsgCenter_IsolateWithId);
    ZhiUTech_MsgCenter.L_AddListener("根据ID更改构件颜色", _MsgCenter_SetColorWithId);
    ZhiUTech_MsgCenter.L_AddListener("添加物体到场景", _MsgCenter_AddObject);
    ZhiUTech_MsgCenter.L_AddListener("删除物体到场景", _MsgCenter_DeleteObject);
    ZhiUTech_MsgCenter.L_AddListener("刷新THREEJS场景", _MsgCenter_RefreshThreeJsScene);
    ZhiUTech_MsgCenter.L_AddListener("更新网格旋转", _MsgCenter_UpdateRotation);
    ZhiUTech_MsgCenter.L_AddListener("根据ID选择构件", _MsgCenter_SelectObjectWithId);
    ZhiUTech_MsgCenter.L_AddListener("清除所有选择", _MsgCenter_ClearAllSelection);
    ZhiUTech_MsgCenter.L_AddListener("根据ID聚焦构件", _MsgCenter_FocusObjectWithId);
    ZhiUTech_MsgCenter.L_AddListener("根据ID隐藏构件", _MsgCenter_HideObjectWithId);
    ZhiUTech_MsgCenter.L_AddListener("获取所有构件ID", _MsgCenter_GetAllIds);
    ZhiUTech_MsgCenter.L_AddListener("获取当前选中构件体积", _MsgCenter_GetNowSelectionVolume);
    ZhiUTech_MsgCenter.L_AddListener("获取当前构件特性", _MsgCenter_GetNowSelectionProperties);
    ZhiUTech_MsgCenter.L_AddListener("获取当前构件子属性", _MsgCenter_GetNowSelectionChildProperties);
    ZhiUTech_MsgCenter.L_AddListener("全屏开关", _MsgCenter_ToggleFullScreen);
    ZhiUTech_MsgCenter.L_AddListener("获取当前构件体积表格", _MsgCenter_GetNowSelectionVolumeTable);
    ZhiUTech_MsgCenter.L_AddListener("获取当前构件ID", _MsgCenter_GetNowSelectionID);
    ZhiUTech_MsgCenter.L_AddListener("刷新VIEW页面比例", _MsgCenter_RefreshViewRatio);

    // endregion
    // region 测量
    ZhiUTech_MsgCenter.L_AddListener("打开距离测量", _MsgCenter_MeasureOpenDistance);
    ZhiUTech_MsgCenter.L_AddListener("打开角度测量", _MsgCenter_MeasureOpenAngle);
    ZhiUTech_MsgCenter.L_AddListener("打开校准测量", _MsgCenter_MeasureOpenCalibrate);
    ZhiUTech_MsgCenter.L_AddListener("获取当前测量单位", _MsgCenter_MeasureGetUnits);
    ZhiUTech_MsgCenter.L_AddListener("设置当前测量单位", _MsgCenter_MeasureSetUnits);
    ZhiUTech_MsgCenter.L_AddListener("获取当前测量精度", _MsgCenter_MeasureGetPrecision);
    ZhiUTech_MsgCenter.L_AddListener("设置当前测量精度", _MsgCenter_MeasureSetPrecision);
    ZhiUTech_MsgCenter.L_AddListener("删除当前测量", _MsgCenter_MeasureDeleteCurrent);
    ZhiUTech_MsgCenter.L_AddListener("关闭测量", _MsgCenter_MeasureClose);

    // endregion
    // region 截面分析
    ZhiUTech_MsgCenter.L_AddListener("设置截面", _MsgCenter_SectionSetMode);
    ZhiUTech_MsgCenter.L_AddListener("关闭截面", _MsgCenter_SectionClose);
    // endregion
    // region 分解模型
    ZhiUTech_MsgCenter.L_AddListener("设置分解模型", _MsgCenter_ExplodeSetScale);
    ZhiUTech_MsgCenter.L_AddListener("关闭分解模型", _MsgCenter_ExplodeClose);
    // endregion
    // region 过滤器
    ZhiUTech_MsgCenter.L_AddListener("过滤体积", _MsgCenter_VolumeFilter);
    ZhiUTech_MsgCenter.L_AddListener("过滤名称", _MsgCenter_NameFilter);
    // endregion
    // region 右上角视角菜单
    ZhiUTech_MsgCenter.L_AddListener("转至主视图", _MsgCenter_CameraGoMainView);
    ZhiUTech_MsgCenter.L_AddListener("正交视图", _MsgCenter_CameraOrthographic);
    ZhiUTech_MsgCenter.L_AddListener("透视视图", _MsgCenter_CameraPerspective);
    ZhiUTech_MsgCenter.L_AddListener("将当前视图设为主视图", _MsgCenter_CameraSetNowViewToMainView);
    ZhiUTech_MsgCenter.L_AddListener("聚焦并设为主视图", _MsgCenter_CameraFocusAndSetMainView);
    ZhiUTech_MsgCenter.L_AddListener("重置主视图", _MsgCenter_CameraResetMainView);
    // endregion
    // endregion

    // region 通知中心Listener 外部 方法实现
    // region 常用
    /**
     * 通知中心: 全部显示隐藏
     * @param {Array} arg 参数一:是否需要回调(该回调控制树状栏)  参数二:是否显示
     * @private
     */
    function _MsgCenter_SetAllVisibility(arg) {
        let needCallback=arg[0];
        let isVisible=arg[1];

        _SetAllVisibility(isVisible,needCallback);
    }
    /**
     * 通知中心: 清除全部颜色
     * @private
     */
    function _MsgCenter_ClearAllColor() {
        _ClearAllColor();
    }
    /**
     * 通知中心: 强制刷新
     * @private
     */
    function _MsgCenter_RefreshScene() {
        _RefreshScene();
    }
    /**
     * 通知中心: 根据ID隔离构件
     * @param {string|string[]} ids 单个id或者id数组
     * @private
     */
    function _MsgCenter_IsolateWithId(ids) {
        let targets = _GetAggregateDataWithId(ids);
        _IsolateObject(targets);
    }
    /**
     * 通知中心: 根据ID更改构件颜色
     * * @param {Array} arg 1:单个id或者id数组 ; 2.THREE.Vector4 的颜色
     * @private
     */
    function _MsgCenter_SetColorWithId(arg) {
        let ids = arg[0];
        let v4Color = arg[1];
        let data = _GetAggregateDataWithId(ids);
        _SetObjectColorWithData(data, v4Color);
    }
    /**
     * 通知中心: 添加物体到场景
     * @param {Array} arg 1:场景名称 ; 2.需要添加的物体 ; 3.该参数请确认清楚，不填写为正常使用！ true为加入默认动态场景(用于射线) false为加入默认静态场景(用于展示)
     * @private
     */
    function _MsgCenter_AddObject(arg) {
        let sceneName = arg[0];
        let obj = arg[1];
        let isLife = arg[2];

        if (isLife === undefined) {
            if (_THREEJS_CheckSceneExist(sceneName)) {
                _THREEJS_AddObject(sceneName, obj);
            }
        } else if (isLife) {
            _THREEJS_AddObject(zhiu._SCENE_NAME_LIFE, obj);
        } else {
            _THREEJS_AddObject(zhiu._SCENE_NAME_DEAD, obj);
        }
    }
    /**
     * 通知中心: 删除物体到场景
     * @param {Array} arg 1:场景名称 ; 2.需要添加的物体 ; 3.该参数请确认清楚，不填写为正常使用！ true为加入默认动态场景(用于射线) false为加入默认静态场景(用于展示)
     * @private
     */
    function _MsgCenter_DeleteObject(arg) {
        let sceneName = arg[0];
        let obj = arg[1];
        let isLife = arg[2];
        if (isLife === undefined) {
            if (_THREEJS_CheckSceneExist(sceneName)) {
                _THREEJS_DeleteObject(sceneName, obj);
            }
        } else if (isLife) {
            _THREEJS_DeleteObject(zhiu._SCENE_NAME_LIFE, obj);
        } else {
            _THREEJS_DeleteObject(zhiu._SCENE_NAME_DEAD, obj);
        }
    }
    /**
     * 通知中心: 刷新THREEJS场景
     * @private
     */
    function _MsgCenter_RefreshThreeJsScene() {
        _THREEJS_RefreshScene();
    }
    /**
     * 通知中心: 更新网格旋转
     * @param {THREE.Mesh} mesh 网格
     * @private
     */
    function _MsgCenter_UpdateRotation(mesh) {
        _THREEJS_UpdateRotation(mesh);
    }
    /**
     * 通知中心: 根据ID选择构件 (备注:该方法不会清空选择,需要单独清空)
     * @param {string|string[]} ids 单个id或者id数组
     * @private
     */
    function _MsgCenter_SelectObjectWithId(ids) {
        _SetAggregateSelect(ids);
    }
    /**
     * 通知中心: 清除所有选择
     * @private
     */
    function _MsgCenter_ClearAllSelection() {
        _ClearAllSelection();
    }
    /**
     * 通知中心: 根据ID聚焦构件
     * @param {string|string[]} ids 单个id或者id数组
     * @private
     */
    function _MsgCenter_FocusObjectWithId(ids) {
        let data = _GetAggregateDataWithId(ids);
        _FocusObject(data);
    }
    /**
     * 通知中心: 根据ID隐藏构件
     * @param {string|string[]} ids 单个id或者id数组
     * @private
     */
    function _MsgCenter_HideObjectWithId(ids) {
        let data=_GetAggregateDataWithId(ids);
        _HideObject(data);
    }
    /**
     * 通知中心: 获取所有构件ID
     * @param {object} arg 参数一:需要填充的Array容器或者Dictionary容器; 参数二:boolean值 true为纯数组,false为模型序号和id组的键值对
     * @private
     */
    function _MsgCenter_GetAllIds(arg) {
        let justArray=arg[1];
        arg[0]=_GetAllIds(justArray);
    }
    /**
     * 通知中心: 获取当前选中构件体积
     * @param {VolumeAction} volumeAction 获取成功的回调 参数为总和
     * @private
     */
    function _MsgCenter_GetNowSelectionVolume(volumeAction) {
        let targets = zhiu.viewer.getAggregateSelection();
        _GetVolumeWithData(targets,volumeAction);
    }
    /**
     * 通知中心: 获取当前构件特性 (特性面板专用)
     * @param {PropertiesPanelAction} propertiesAction 成功后的回调 参数为属性数组
     * @private
     */
    function _MsgCenter_GetNowSelectionProperties(propertiesAction) {
        _PropertiesPanel_OnSelectionChanged(propertiesAction);
    }
    /**
     * 通知中心: 获取当前构件子属性 (特性面板专用)
     * @param {ChildPropertiesAction} propertiesAction 成功后的回调 参数为属性数组
     * @private
     */
    function _MsgCenter_GetNowSelectionChildProperties(propertiesAction) {
        _GetNowSelectionAllChildProperties(propertiesAction);
    }
    /**
     * 通知中心: 全屏开关
     * @param {boolean} isFull 是否全屏
     * @private
     */
    function _MsgCenter_ToggleFullScreen(isFull) {
        _ToggleFullScreen(isFull);
    }
    /**
     * 通知中心: 获取当前构件体积表格 (体积面板专用)
     * @param {VolumeTableAciton} volumeTableAciton
     * @private
     */
    function _MsgCenter_GetNowSelectionVolumeTable(volumeTableAciton) {
        _GetVolumeTable(volumeTableAciton);
    }
    /**
     * 通知中心: 获取当前构件ID
     * @param {Array} arg 数组第一个元素为当前构件id
     * @private
     */
    function _MsgCenter_GetNowSelectionID(arg) {
        let targets = zhiu.viewer.getAggregateSelection();
        arg[0]= _GetIdWithData(targets,true);
    }
    /**
     * 通知中心: 刷新VIEW页面比例
     * @private
     */
    function _MsgCenter_RefreshViewRatio(){
        _RefreshViewRatio();
    }
    // endregion
    // region 测量
    /**
     * 通知中心: 打开距离测量
     * @private
     */
    function _MsgCenter_MeasureOpenDistance() {
        _Measure_OpenDistance();
    }
    /**
     * 通知中心: 打开角度测量
     * @private
     */
    function _MsgCenter_MeasureOpenAngle() {
        _Measure_OpenAngle();
    }
    /**
     * 通知中心: 打开校准测量
     * @private
     */
    function _MsgCenter_MeasureOpenCalibrate() {
        _Measure_OpenCalibrate();
    }
    /**
     * 通知中心: 获取当前测量单位
     * @param {function} callback 回调参数为测量单位 string
     * @private
     */
    function _MsgCenter_MeasureGetUnits(callback) {
        let units=_Measure_GetUnits();
        callback(units);
    }
    /**
     * 通知中心: 设置当前测量单位
     * @param {string} units 测量单位(请注意格式)
     * @private
     */
    function _MsgCenter_MeasureSetUnits(units) {
        _Measure_SetUnits(units);
    }
    /**
     * 通知中心: 获取当前测量精度
     * @param {function} callback 回调参数为测量精度 number
     * @private
     */
    function _MsgCenter_MeasureGetPrecision(callback) {
        let precision=_Measure_GetPrecision();
        callback(precision);
    }
    /**
     * 通知中心: 设置当前测量精度
     * @param precision
     * @private
     */
    function _MsgCenter_MeasureSetPrecision(precision) {
        _Measure_SetPrecision(precision);
    }
    /**
     * 通知中心: 设置当前测量精度
     * @private
     */
    function _MsgCenter_MeasureDeleteCurrent() {
        _Measure_DeleteCurrent();
    }
    /**
     * 通知中心: 关闭测量
     * @private
     */
    function _MsgCenter_MeasureClose() {
        _Measure_Close();
    }
    // endregion
    // region 截面分析
    /**
     * 设置截面
     * @param {string} mode 截面模式 (x,y,z,box)
     * @private
     */
    function _Section_SetMode(mode) {
        zhiu.viewer.getExtension("ZhiUTech.Section").activate(mode);
    }
    /**
     * 关闭截面分析
     * @private
     */
    function _Section_Close() {
        zhiu.viewer.getExtension("ZhiUTech.Section").deactivate();
    }
    // endregion
    // region 分解模型
    /**
     * 通知中心: 设置分解模型
     * @param {float} scale 大小 0-1
     * @private
     */
    function _MsgCenter_ExplodeSetScale(scale) {
        _Explode_SetScale(scale);
    }
    /**
     * 通知中心: 关闭分解模型
     * @private
     */
    function _MsgCenter_ExplodeClose() {
        _Explode_Close();
    }
    // endregion
    // region 过滤器
    /**
     * 通知中心: 过滤体积
     * @param {Array} list 参数1: volume 体积阈值 ; 参数2: isGreater true是大于,false为小于 ;  参数3: needEqual true为包含等于,false为不包含等于
     * @private
     */
    function _MsgCenter_VolumeFilter(list) {
        let volume=list[0];
        let isGreater=list[1];
        let needEqual=list[2];
        let targets = _GetSelection();
        _FilterTool_Volume(targets, volume, isGreater, needEqual, function (idList) {
            _ClearAllSelection();
            _SetAggregateSelect(idList);
        });
    }
    /**
     * 通知中心: 过滤名称
     * @param {Array} list 参数1: name 名称关键字 ; 参数2: isIgnore true不包含关键字,false为仅包含关键字
     * @private
     */
    function _MsgCenter_NameFilter(list) {
        let name=list[0];
        let isIgnore=list[1];
        let targets = _GetSelection();
        _FilterTool_Name(targets, name, isIgnore, function (idList) {
            _ClearAllSelection();
            _SetAggregateSelect(idList);
        });
    }
    // endregion
    // region 右上角视角菜单
    /**
     * 通知中心: 转至主视图
     * @private
     */
    function _MsgCenter_CameraGoMainView() {
        _Camera_GoMainView();
    }
    /**
     * 通知中心: 正交视图
     * @private
     */
    function _MsgCenter_CameraOrthographic() {
        _Camera_SetCameraModel(false);
    }
    /**
     * 通知中心: 透视视图
     * @private
     */
    function _MsgCenter_CameraPerspective() {
        _Camera_SetCameraModel(true);
    }
    /**
     * 通知中心: 将当前视图设为主视图
     * @private
     */
    function _MsgCenter_CameraSetNowViewToMainView() {
        _Camera_SetNowViewToMainView();
    }
    /**
     * 通知中心: 聚焦并设为主视图
     * @private
     */
    function _MsgCenter_CameraFocusAndSetMainView() {
        _FocusObject(zhiu.viewer.getAggregateSelection());
        setTimeout(()=>{
            _Camera_SetNowViewToMainView();
        },500);
    }
    /**
     * 通知中心: 重置主视图
     * @private
     */
    function _MsgCenter_CameraResetMainView() {
        _Camera_ResetMainView();
    }
    // endregion
    // endregion

    // endregion

    return zhiu;
}

// region JSDoc 各类说明

// region 数据类型

/**
 * 相机的数据 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class CameraData
 * @param {THREE.Vector3} center 中心
 * @param {float} fov 视场角
 * @param {boolean} isOrtho 是否为正交
 * @param {THREE.Vector3} pivot 焦点
 * @param {THREE.Vector3} position 位置
 * @param {THREE.Vector3} up 上轴
 * @param {THREE.Vector3} worldUp 世界轴
 */

/**
 * 模型加载的配置信息 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class ModelOptions
 * @param {string} FileName 文件名称
 * @param {string} FilePath 文件地址
 * @param {string} DBPath DB地址
 * @param {string} GUID id
 * @param {function} LoadModelSuccessCallback 加载成功的回调参数为model句柄
 */

/**
 * 选中的数据格式 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class SelectionData
 * @param {model} model 模型句柄
 * @param {number[]} selection 选中构件的dbId
 */

/**
 * 射线检测返回的信息格式 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class HitInfo
 * @param {float} distance 距离
 * @param {THREE.Face3} faceIndex 顶点索引信息
 * @param {number} faceIndex 顶点索引数量
 * @param {THREE.Mesh} object 物体
 * @param {THREE.Point} point 击中位置
 */

/**
 * 射线检测返回的信息格式 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class TouchMsg
 * @param {number} dbId 距离
 * @param {THREE.Face3} face 顶点索引信息
 * @param {number} fragId 顶点索引数量
 * @param {THREE.Vector3} intersectPoint 物体
 * @param {model} model 击中位置
 * @param {THREE.Vector3} point 击中位置
 */

/**
 * 特性面板信息
 * @class PropertiesPanelMsg
 * @param {string} parent.name 父属性名称
 * @param {string} children.name 属性名成
 * @param {string} children.value 属性名成
 */

// endregion

// region 各类回调
/**
 * 获取到属性的回调(如果justDictionary为false参数会改变,详情咨询技术)
 * @callback PropertiesAction
 * @param {object[]} list 以id为key 构件详情为value的键值对
 */

/**
 * 获取到体积表格的回调
 * @callback VolumeTableAciton
 * @param {result[]} list 表格结果
 * @param {string} result.objName 构件名称
 * @param {string} result.objVolume 构件体积
 * @param {string} result.fenbugongcheng 分部工程名称
 * @param {string} result.fenxianggongcheng 分项工程名称
 */

/**
 * 获取到当前选中单个构件属性的回调 特性专用
 * @callback PropertiesPanelAction
 * @param {PropertiesPanelMsg[]} properties 构件属性
 */

/**
 * 获取到当前选中单个构件子属性属性的回调 特性专用
 * @callback ChildPropertiesAction
 * @param {object} properties 属性名为key 属性值为value的 键值对
 */

/**
 * 获取到体积总和的回调
 * @callback VolumeAction
 * @param {float} volumeSummation 所有构件的体积总和
 */

/**
 * 筛选结构的回调
 * @callback FilterAction
 * @param {string[]} ids 构件的id数组
 */

/**
 * 获取Id的回调
 * @callback IdsAction
 * @param {string[]} result 模型序号为key 找到的id为value的键值对
 */

/**
 * 获取到构件id的回调
 * @callback SearchAction
 * @param {string[]|object} result  如果是但模型将会返回该模型构件id的数组;
 * 如果是获取聚合模型的id将会返回 模型序号为key 找到的id为value的键值对
 */

/**
 * 错误的回调
 * @callback ErrorAction
 * @param {object} error 错误的对象
 */

/**
 * 获取到构件名称的回调
 * @callback NameAction
 * @param {object[]} id为key 名字为value的键值对
 */

/**
 * 获取到截图的回调
 * @callback ScreenShotAction
 * @param {string} base64编码的图片格式
 */

/**
 * 获取到射线检测信息的回调
 * @callback RaycastAction
 * @param {HitInfo[]} hitInfoList 射线检测数据
 */

/**
 * 获取到射线检测信息的回调
 * @callback Raycast3DPointAciton
 * @param {string} id 3d标注的id
 */

/**
 * 获取到点击位置的回调
 * @callback TouchAction
 * @param {THREE.Vector3|undefined} point 如果返回为undefined,回调将会继续进行至有效值返回,才会终止
 */

/**
 * 获取到点击信息的回调
 * @callback TouchMsgAciton
 * @param {TouchMsg} msg 如果返回为undefined,回调将会继续进行至有效值返回,才会终止
 */
// endregion

// endregion














