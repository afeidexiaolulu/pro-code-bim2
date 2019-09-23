/**
 *  创建人 : LJason
 *  功能说明 : 厦门项目 昌江的服务器接口强化
 */

/**
 * 二维码数据管理器 用于扫描二维码后的页面数据管理
 */
let _zhiu_QRCodeDataManager = {
    _UpdateData: function (data) {

        _IsNeedUpdate(function (isNeedUpdate) {
            if(isNeedUpdate){
                $.post("/StructureQRcode/UpdataStructureQRcode",
                    {
                        StructureQRcode: data
                    },
                    function (data) {
                        let result = JSON.parse(data);
                        if (result.Code === 500) {
                            ZhiUTech_MsgCenter.L_SendMsg("错误", ["更新二维码专用数据 出现问题,请注意!", result.Message]);
                        }
                    });
            }
        });

        function _IsNeedUpdate(callback) {
            $.post("/StructureQRcode/IsUpdata",{},
                function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["校验二维码专用数据是否更新 出现问题,请注意!", result.Message]);
                } else {
                        result = JSON.parse(result.Message);
                        callback(result);
                    }
                }
            );
        }
    },
};


/**
 * 自定义特性管理器
 */
let _zhiu_customPropertiesManager = {
    /**
     * 初始化通知中心
     * @function _InitializeMsgCenter
     */
    _InitializeMsgCenter: function () {
        ZhiUTech_MsgCenter.L_AddListener("根据构件ID获取自定义特性", _GetCustomPropertiesById);
        ZhiUTech_MsgCenter.L_AddListener("获取所有自定义特性", _GetAllCustomProperties);
        ZhiUTech_MsgCenter.L_AddListener("添加自定义特性", _AddCustomProperties);
        ZhiUTech_MsgCenter.L_AddListener("根据自定义特性GUID删除自定义特性", _DeleteCustomPropertiesByGUID);
        ZhiUTech_MsgCenter.L_AddListener("根据构件ID删除自定义特性", _DeleteCustomPropertiesById);
        ZhiUTech_MsgCenter.L_AddListener("删除所有自定义特性", _DeleteAllCustomProperties);

        function _GetCustomPropertiesById(arg) {
            let id = arg[0];
            let callback = arg[1];
            _zhiu_customPropertiesManager._GetCustomPropertiesById(id, callback);
        }

        function _GetAllCustomProperties(callback) {
            _zhiu_customPropertiesManager._GetAllCustomProperties(callback);
        }

        function _AddCustomProperties(array) {
            _zhiu_customPropertiesManager._AddCustomProperties(array);
        }

        function _DeleteCustomPropertiesByGUID(GUIDArray) {
            _zhiu_customPropertiesManager._DeleteCustomPropertiesByGUID(GUIDArray);
        }

        function _DeleteCustomPropertiesById(id) {
            _zhiu_customPropertiesManager._DeleteCustomPropertiesById(id);
        }

        function _DeleteAllCustomProperties() {
            _zhiu_customPropertiesManager._DeleteAllCustomProperties();
        }
    },

    /**
     * 根据构件id获取自定义特性
     * @function _GetCustomPropertiesById
     * @param {string} id 构件id
     * @param {function} callback 获取到自定义特性的回调 参数为特性数组
     */
    _GetCustomPropertiesById: function (id, callback) {
        let data = {
            StructureId: id
        };
        $.post("/BimDatas/SelectStructureId", data,
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["根据id获取自定义特性 出现问题,请注意!", result.Message]);
                } else {
                    result = JSON.parse(result.Message);
                    callback(result);
                }
            }
        );
    },

    /**
     * 获取所有自定义特性
     * @function _GetAllCustomPropertiesFromNowProject
     * @param {function} callback 获取到自定义特性的回调 参数为特性数组
     */
    _GetAllCustomProperties: function (callback) {
        $.post("/BimDatas/SelectProjectId", {},
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["获取所有自定义特性出现问题,请注意!", result.Message]);
                } else {
                    result = JSON.parse(result.Message);
                    callback(result);
                }
            }
        );
    },

    /**
     * 添加自定义特性
     * @function _AddCustomProperties
     * @param {Array} array 特性数组 元素成员 Id StructureId Key Value
     */
    _AddCustomProperties: function (array) {
        let data = {BimDatas: array};
        $.post("/BimDatas/AddBimData", data,
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["添加自定义特性出现问题,请注意!", result.Message]);
                }
            }
        );
    },

    /**
     * 根据自定义特性guid 删除自定义特性
     * @param {string[]} GUIDArray guid数组
     */
    _DeleteCustomPropertiesByGUID: function (GUIDArray) {
        let data = {Id: GUIDArray};
        $.post("/BimDatas/DeleteId", data,
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["根据自定义特性guid 删除自定义特性 失败,请注意!", result.Message]);
                }
            }
        );
    },

    /**
     * 根据构件id删除自定义特性
     * @function _DeleteCustomPropertiesById
     * @param {string} id 构件id
     */
    _DeleteCustomPropertiesById: function (id) {
        let data = {StructureId: id};
        $.post("/BimDatas/DeleteStructureId", data,
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["根据构件id删除自定义特性 失败,请注意!", result.Message]);
                }
            }
        );
    },

    /**
     * 删除所有自定义特性
     * @function _DeleteAllCustomProperties
     */
    _DeleteAllCustomProperties: function () {
        $.post("/BimDatas/DeleteProjectId", {},
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["删除所有自定义特性 失败,请注意!", result.Message]);
                }
            }
        );
    },
};


/**
 * 用于储存项目配置
 */
let _zhiu_projectConfigManager = {
    // 保存项目配置 可单独保存(其他项填写undefined即可)
    _SaveProjectConfig: function (DefaultCameraView, WorkAreaDirection) {
        let data = {};
        if (DefaultCameraView) data.DefaultCameraView = DefaultCameraView;
        if (WorkAreaDirection) data.WorkAreaDirection = WorkAreaDirection;
        $.post("/ProjectContent/Add", data,
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["储存项目config出现问题,请注意!", result.Message]);
                }
            });
    },
    // 获取项目配置
    _GetProjectConfig: function (callback) {
        $.post("/ProjectContent/ProjectContentShowProjectId", {},
            function (data) {
                let result = JSON.parse(data);
                if (result.Code === 500) {
                    ZhiUTech_MsgCenter.L_SendMsg("错误", ["储存项目config出现问题,请注意!", result.Message]);
                    callback(undefined);
                } else {
                    result = JSON.parse(result.Message);
                    callback(result[0]);
                }
            });
    },
};