/**
 *  创建人 : LJason
 *  功能说明 : 树状图 厦门项目质保资料专用
 */

function Initialize_ZhiUTech_CDIMS_Tree(zhiu, pathArray) {



    // region 核心成员 勿动
    /**
     * 核心变量
     */
    let mgr = {};
    /**
     * 成员变量 具有所有成员句柄
     */
    let member = {};
    /**
     * 给核心变量赋值
     */
    mgr._member = member;
    // endregion

    // region 成员

    // region 各类数据
    /**
     * ZTree设置
     */
    member._treeSettings = {
        view: {
            showLine: false,
            // showTitle:false,
            showIcon: false,
            dblClickExpand: false,
        },
        check: {
            autoCheckTrigger: false,
            chkboxType: {
                "Y": "ps",
                "N": "ps"
            },
            chkStyle: "checkbox",
            enable: true,
            nocheckInherit: false,
            chkDisabledInherit: false,
            radioType: "level"
        },
        callback: {
            onClick: _ZTreeClickCallback,
            onDblClick: _ZTreeDoubleClickCallback,
            onCheck: _ZTreeCheckBoxCallback,
        }
    };
    /**
     * ZTree设置
     */
    member._treeSettingsNormal = {
        view: {
            showLine: false,
            // showTitle:false,
            showIcon: false,
            dblClickExpand: false,
        },
        check: {
            autoCheckTrigger: false,
            chkboxType: {
                "Y": "ps",
                "N": "ps"
            },
            chkStyle: "checkbox",
            enable: true,
            nocheckInherit: false,
            chkDisabledInherit: false,
            radioType: "level"
        },
        callback: {
            onClick: _ZTreeClickCallbackNormal,
            onDblClick: _ZTreeDoubleClickCallbackNormal,
            onCheck: _ZTreeCheckBoxCallbackNormal,
        }
    };
    /**
     * 树状图的div
     */
    member._div = undefined;
    /**
     * 树状图的div 标准树版本
     */
    member._divNormal = undefined;
    /**
     * 字典 modelGUID : 树
     */
    member._treeDic = {};
    /**
     * 字典 modelGUID : 原装树
     */
    member._treeDicNormal = {};
    /**
     * 字典 modelGUID : 所有属性信息
     */
    member._dataBaseDic = {};
    /**
     * 导航栏名称(属性分类)
     */
    member.propertyName = [];
    /**
     * 字典 导航栏名称 : 属性名称
     */
    member.propertyTypeDir = {};
    /**
     * zTree主句柄 用于控制
     */
    member.zTreeObj = undefined;
    /**
     * zTree主句柄 用于控制 标准树版本
     */
    member.zTreeObjNormal = undefined;
    /**
     * 字典 externalId : treeNode 用于快查ztree的节点
     */
    member._ExternalToTreeNodeDic = {};
    /**
     * 字典 externalId : treeNode 用于快查ztree的节点 标准树版本
     */
    member._ExternalToTreeNodeDicNormal = {};
    /**
     * 文字属性数组 所有自定义属性名都会放在这个里面
     * @type {Array}
     */
    member._CustomPropertyName = [];
    // endregion

    // region 甲方提供的key
    member._revitPropertyName="模型参数";
    member._LimitNameList = [
        "合同编号",
        "专业编码",
        "单位工程",
        "子单位工程",
        "分部工程",
        "子分部工程",
        "分项工程",
        "子分项工程",
        "清单编号",
    ];
    member._LimitDic = (function () {
        let array = [];
        for (let i = 0; i < member._LimitNameList.length; i++) {
            array[i] = [];
        }
        return array;
    })();
    // endregion

    // region 事件回勾开关
    member._isClick = false;
    member._isDbClick = false;
    member._isCheckBoxHide = false;
    member._isCheckBoxIsolate = false;
    member._isCheckBoxToggle = false;
    // endregion

    // region 二维码专用属性
    /**
     * 二维码属性数组
     */
    member._QRCodeDic = [];
    /**
     * 甲方需要自动生成的key
     */
    member._QRCodePropertyKey = ["文字", "尺寸标注"];


    // endregion

    // endregion

    // region 内部

    /**
     * 初始化监听
     * @private
     */
    function _InitilizeListener() {
        ZhiUTech_MsgCenter.L_AddListener("模型开始加载", _MsgCenter_InitializeTree);
        ZhiUTech_MsgCenter.L_AddListener("构件选择变更", _MsgCenter_SelectionChanged);
        ZhiUTech_MsgCenter.L_AddListener("构件隐藏", _MsgCenter_HideObjectCallback);
        ZhiUTech_MsgCenter.L_AddListener("构件隔离_自定义", _MsgCenter_HideObjectCustomCallback);
        ZhiUTech_MsgCenter.L_AddListener("构件隔离", _MsgCenter_IsolateObjectCallback);
        ZhiUTech_MsgCenter.L_AddListener("开关复选框_树状图", _MsgCenter_SetAllCheckBox);

        ZhiUTech_MsgCenter.L_AddListener("获取索引信息", _MsgCenter_GetLimitMsg);
        ZhiUTech_MsgCenter.L_AddListener("获取索引结果", _MsgCenter_GetLimitResult);
        ZhiUTech_MsgCenter.L_AddListener("获取父级属性名", _MsgCenter_GetPropertiesParentName);

        ZhiUTech_MsgCenter.L_AddListener("模型卸载成功", _MsgCenter_DeleteTree);

        ZhiUTech_MsgCenter.L_AddListener("刷新树状图聚焦位置", _MsgCenter_RefreshFocusPosition);

        ZhiUTech_MsgCenter.L_AddListener("树状图模糊查询", _MsgCenter_TreeFuzzySearch);

    }

    /**
     * 初始化树状图的div
     * @private
     */
    function _InitializeTreeDivisionAndObject() {

        member.zTreeObj = $.fn.zTree.init($("#zhiuZTree"), member._treeSettings, []);
        member.zTreeObjNormal = $.fn.zTree.init($("#zhiuZTreeNormal"), member._treeSettingsNormal, []);
    }

    /**
     * 读取json数据
     * @param {ModelOptions} arg 模型加载的配置信息
     * @private
     */
    function _ReadJsonAction(arg) {
        _FileExist(arg.DBPath, function () {
            $.getJSON(arg.DBPath, Read);
        }, function () {
            ZhiUTech_MsgCenter.L_SendMsg("错误", "模型数据库文件丢失,模型名=" + arg.FileName);
        });

        function Read(data) {
            let propertyName = data.m_attribute;

            // region 整理数据
            for (let i = 0; i < data.m_externalId.length; i++) {

                let obj = {};
                obj.name = data.m_entityName[i];
                obj.externalId = data.m_externalId[i];
                obj.property = {};
                let properties = data.m_table[i];

                for (let item in properties) {
                    let index = parseInt(item);
                    obj.property[propertyName[index].Key] = properties[index];
                }
                member._dataBaseDic[arg.GUID].push(obj);
            }
            // endregion

            // region 方旋需要所有属性名称
            for (let index in propertyName) {
                if (member.propertyName.indexOf(propertyName[index].Value) === -1) {
                    member.propertyName.push(propertyName[index].Value);
                }
                member.propertyTypeDir[propertyName[index].Key] = propertyName[index].Value;
                if (propertyName[index].Value === "文字") {
                    if (member._CustomPropertyName.indexOf(propertyName[index].Key) === -1) {
                        member._CustomPropertyName.push(propertyName[index].Key);
                    }
                }
            }
            // endregion

            _MakeQRCodeData(member._dataBaseDic[arg.GUID]);

            _BuildZTreeData(member._treeDic[arg.GUID], member._dataBaseDic[arg.GUID]);
            _BuildZTreeDataNormal(member._treeDicNormal[arg.GUID], member._dataBaseDic[arg.GUID]);

            let parentNode = member.zTreeObj.addNodes(null, member._treeDic[arg.GUID]);
            _MakeExternalIdToTreeNodeDictionary(parentNode[0]);
            let parentNodeNormal = member.zTreeObjNormal.addNodes(null, member._treeDicNormal[arg.GUID]);
            _MakeExternalIdToTreeNodeDictionaryNormal(parentNodeNormal[0]);
        }
    }

    /**
     * 制作二维码专用数据
     * @param {Array} list 构件数据
     * @private
     */
    function _MakeQRCodeData(list) {
        for (let i = 0; i < list.length; i++) {
            let prop = [];
            // region 获取需要的属性
            let propertyDic = list[i].property;
            for (let k = 0; k < member._QRCodePropertyKey.length; k++) {
                let temp ={};
                temp.parent={};
                temp.parent.name=member._QRCodePropertyKey[k];
                temp.children=[];
                // 甲方要求的key
                for (let propName in propertyDic) {
                    if (member.propertyTypeDir[propName] === member._QRCodePropertyKey[k]) {
                        if(propertyDic[propName]){
                            temp.children.push({name:propName,value:propertyDic[propName]});
                        }
                    }
                }
                prop.push(temp);
            }
            // endregion
            // region 按照甲方意思整理顺序
            for (let z = 0; z < prop.length; z++) {
                if (prop[z].parent.name === "文字") {

                    // region 整理字段顺序
                    let list = prop[z].children;
                    let result = [];
                    for (let j = 0; j < member._LimitNameList.length; j++) {
                        result.push({
                            name: member._LimitNameList[j],
                            value: "",
                        });
                    }
                    for (let j = 0; j < list.length; j++) {
                        if (member._LimitNameList.indexOf(list[j].name) !== -1) {
                            result[member._LimitNameList.indexOf(list[j].name)].value = list[j].value;
                        } else {
                            result.push({
                                name: "* " + list[j].name,
                                value: list[j].value,
                            });
                        }
                    }
                    prop[z].children = result;
                    // endregion

                    prop[z].parent.name = member._revitPropertyName;
                    if (z !== 0) {
                        _SwapArrayElement(prop, z, 0);
                        z = 0;
                    }
                }
                if (prop[z].parent.name === "尺寸标注") {
                    if (z !== 1) {
                        _SwapArrayElement(prop, z, 1);
                        z = 1;
                    }
                }
            }
            // endregion
            // region 按照服务器字段整理数据
            let data = {};
            data.StructureId = list[i].externalId;
            data.StructureName = list[i].name;
            data.StructureProperties = JSON.stringify(prop);
            data.CreatTime = Date.now();
            member._QRCodeDic.push(data);
            // endregion
        }
        ZhiUTech_MsgCenter.L_SendMsg("二维码数据页面专用数据",member._QRCodeDic);
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
    }

    /**
     * 检查该属性是否为自定义(文字)属性范围
     * @param key
     * @returns {boolean}
     * @private
     */
    function _ContainsCustomPropertyName(key) {
        return member._CustomPropertyName.indexOf(key) !== -1;
    }

    /**
     * 检测文件是否存在 (异步)
     * @param {string} url 文件地址
     * @param {function} successCallback 成功的回调
     * @param {function} errorCallback 失败的回调
     * @private
     */
    function _FileExist(url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            async: true,
            type: 'HEAD',
            error: function () {
                errorCallback();
            },
            success: function () {
                successCallback();
            }
        });
    }

    /**
     * 创建目标ZTree数据包
     * @param {object} tree 根节点容器
     * @param {Array[]} list 模型的所有构件及构件属性
     * @private
     */
    function _BuildZTreeData(tree, list) {

        for (let i = 0; i < list.length; i++) {

            let parent = tree;// 爸爸的容器

            // region 不停的造爹
            for (let k = 0; k < member._LimitNameList.length; k++) {
                parent = _MakeParentNode(list[i], parent, member._LimitNameList[k]);

                if (member._LimitNameList.indexOf(parent._keyword) === -1 && member._LimitDic[k].indexOf(parent._keyword) === -1) {
                    member._LimitDic[k].push(parent._keyword);
                }

                if(k<=5){
                    parent.open=true;
                }

            }
            // endregion

            // region 创建模糊查询用的字段
            let customPropertyName = list[i].name;
            for (let key in list[i].property) {
                if (_ContainsCustomPropertyName(key)) {
                    customPropertyName += list[i].property[key];
                }
            }
            // endregion

            parent.children.push(_BuildZTreeNode(list[i].name, false, true, list[i].externalId, customPropertyName));
        }

    }

    /**
     * 创建父节点
     * @param {object} obj 构件
     * @param {object} parent 构件父节点
     * @param {string} key 创建父节点的关键字
     * @return {object} 新的父节点
     * @private
     */
    function _MakeParentNode(obj, parent, key) {
        let _tempParent = undefined;
        let parentName = " - " + key;
        if (obj.property[key]) {
            // parentName = obj.property[key] + parentName;
            parentName = obj.property[key];
            // 检查是否有这个爸爸
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i].name === parentName) {
                    _tempParent = parent.children[i];
                    break;
                }
            }

            // 如果还没有 就造爸爸
            if (!_tempParent) {
                _tempParent = _BuildZTreeNode(parentName, true, true);
                parent.children.push(_tempParent);
            }
            _tempParent._keyword = obj.property[key];

        } else {
            _tempParent=parent;
        }
        return _tempParent;
    }

    /**
     * 创建目标ZTree数据包 原装树版本
     * @param {object} tree 根节点容器
     * @param {Array[]} list 模型的所有构件及构件属性
     * @private
     */
    function _BuildZTreeDataNormal(tree, list) {
        for (let i = 0; i < list.length; i++) {
            if (!list[i].property["Category"]) {
                return;
            }
            let category = list[i].property["Category"].replace("Revit ", "");
            let family = list[i].name.split(" [")[0];
            let typeId = list[i].property["类型 ID"];
            let parent = tree;
            parent = _MakeParentNodeNormal(parent, category);
            parent = _MakeParentNodeNormal(parent, family);
            parent = _MakeParentNodeNormal(parent, typeId);

            // region 创建模糊查询用的字段
            let customPropertyName = list[i].name;
            for (let key in list[i].property) {
                if (_ContainsCustomPropertyName(key)) {
                    customPropertyName += list[i].property[key];
                }
            }
            // endregion

            parent.children.push(_BuildZTreeNode(list[i].name, false, true, list[i].externalId, customPropertyName));
        }
    }

    /**
     *创建父节点 原装树版本
     * @param {object} parent 构件父节点
     * @param {string} key 创建父节点的关键字
     * @return {object} 新的父节点
     * @private
     */
    function _MakeParentNodeNormal(parent, key) {
        let _tempParent = undefined;
        for (let i = 0; i < parent.children.length; i++) {
            // 检查是否有这个爸爸
            if (parent.children[i].name === key) {
                _tempParent = parent.children[i];
                break;
            }
        }
        // 如果还没有 就造爸爸
        if (!_tempParent) {
            _tempParent = _BuildZTreeNode(key, true, true);
            parent.children.push(_tempParent);
        }

        return _tempParent;
    }

    /**
     * 创建ZTree树节点
     * @param name 名字
     * @param needChildren 是否需要子物体容器
     * @param isChecked checkbox的状态
     * @param externalId 你猜啊
     * @param customPropertyName 用于搜索的key
     * @returns {{name: *, checked: *}}
     * @private
     */
    function _BuildZTreeNode(name, needChildren, isChecked, externalId = undefined, customPropertyName = undefined) {
        let obj = {
            name: name,
            checked: isChecked,
            // open:false,
        };
        if (needChildren) {
            obj.children = [];
        }
        if (externalId) {
            obj._externalId = externalId;
        }
        if (customPropertyName) {
            obj._customPropertyName = customPropertyName;
        }

        return obj;
    }

    /**
     * 创建快查字典
     * @param {object} parentNode 父节点
     * @private
     */
    function _MakeExternalIdToTreeNodeDictionary(parentNode) {
        _RecursionAllChildrenForDictionary(parentNode, member._ExternalToTreeNodeDic);
    }

    /**
     * 创建快查字典 标准树版本
     * @param {object} parentNode 父节点
     * @private
     */
    function _MakeExternalIdToTreeNodeDictionaryNormal(parentNode) {
        _RecursionAllChildrenForDictionary(parentNode, member._ExternalToTreeNodeDicNormal);
    }

    /**
     * 快查字典专用的递归
     * @param parentNode
     * @param dictionary
     * @private
     */
    function _RecursionAllChildrenForDictionary(parentNode, dictionary) {

        if (parentNode.children) {
            for (let i = 0; i < parentNode.children.length; i++) {
                if (parentNode.children[i].children) {
                    _RecursionAllChildrenForDictionary(parentNode.children[i], dictionary);
                } else {
                    dictionary[parentNode.children[i]._externalId] = parentNode.children[i];
                }
            }
        }
    }

    /**
     * 递归子物体
     * @param {object} parentNode 父节点
     * @param {Array} list 容器
     * @private
     */
    function _RecursionAllChildren(parentNode, list) {

        if (parentNode.children) {
            for (let i = 0; i < parentNode.children.length; i++) {
                if (parentNode.children[i].children) {
                    _RecursionAllChildren(parentNode.children[i], list);
                } else {
                    list.push(parentNode.children[i]._externalId);
                }
            }
        }
    }

    /**
     * 通过external获取treenode
     * @param {string|string[]} list 单个id或者id组
     * @returns {object} 树节点
     * @private
     */
    function _GetTreeNodeWithExternalId(list) {
        if (Array.isArray(list)) {
            let array = [];
            for (let i = 0; i < list.length; i++) {
                if (member._ExternalToTreeNodeDic[list[i]]) {
                    array.push(member._ExternalToTreeNodeDic[list[i]]);
                }
            }
            return array;
        } else {
            return member._ExternalToTreeNodeDic[list];
        }
    }

    /**
     * 通过external获取treenode
     * @param {string|string[]} list 单个id或者id组
     * @returns {object} 树节点
     * @private
     */
    function _GetTreeNodeWithExternalIdNormal(list) {
        if (Array.isArray(list)) {
            let array = [];
            for (let i = 0; i < list.length; i++) {
                if (member._ExternalToTreeNodeDicNormal[list[i]]) {
                    array.push(member._ExternalToTreeNodeDicNormal[list[i]]);
                }
            }
            return array;
        } else {
            return member._ExternalToTreeNodeDicNormal[list];
        }
    }

    /**
     * 获取索引结果
     * @param {string[]} list 限制条件
     * @param {boolean} needSelect 是否需要选择
     * @return {LimitResult} 索引结果
     * @private
     */
    function _GetLimitResult(list, needSelect) {
        // region 判断限制条件是否全部为undefined
        let isAllUndefined = true;
        for (let i = 0; i < list.length; i++) {
            if (list[i]) {
                isAllUndefined = false;
                break;
            }
        }
        // endregion
        let result = {};
        result.resultArray = [];
        result.limitDic = [];

        for (let i = 0; i < member._LimitNameList.length; i++) {
            result.limitDic[i] = [];
            result.limitDic[i].push("请选择");
        }
        if (isAllUndefined) {
            let arg = [[], true];
            ZhiUTech_MsgCenter.L_SendMsg("获取所有构件ID", arg);
            result.resultArray = arg[0];
            for (let i = 0; i < member._LimitNameList.length; i++) {
                result.limitDic[i] = [];
                result.limitDic[i].push("请选择");
                result.limitDic[i] = result.limitDic[i].concat(member._LimitDic[i]);
            }
        } else {
            // region 新款
            for (let guid in member._dataBaseDic) {
                // 遍历所有构件找到符合条件的构件
                for (let i = 0; i < member._dataBaseDic[guid].length; i++) {
                    let obj = member._dataBaseDic[guid][i];

                    let isRight = false;
                    for (let k = 0; k < list.length; k++) {
                        if (list[k]) {
                            if (list[k] === obj.property[member._LimitNameList[k]]) {
                                isRight = true;
                            } else {
                                isRight = false;
                                break;
                            }
                        }
                    }
                    // 如果发现结果正确就重新制作树级别
                    if (isRight) {
                        result.resultArray.push(obj.externalId);
                        let parent = _BuildZTreeNode("高级筛选", true, true);
                        for (let k = 0; k < member._LimitNameList.length; k++) {
                            parent = _MakeParentNode1(obj, parent, member._LimitNameList[k]);
                            if (member._LimitNameList.indexOf(parent.name) === -1 && result.limitDic[k].indexOf(parent.name) === -1) {
                                result.limitDic[k].push(parent.name);
                            }
                        }
                    }
                }
            }
            // endregion
        }
        if (needSelect) {
            ZhiUTech_MsgCenter.L_SendMsg("清除所有选择");
            ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", result.resultArray);
        }

        return result;

        function _MakeParentNode1(obj, parent, key) {
            let _tempParent = undefined;

            if (obj.property[key]) {
                // 检查是否有这个爸爸
                for (let i = 0; i < parent.children.length; i++) {
                    if (parent.children[i].name === obj.property[key]) {
                        _tempParent = parent.children[i];
                        break;
                    }
                }

                // 如果还没有 就造爸爸
                if (!_tempParent) {
                    _tempParent = _BuildZTreeNode(obj.property[key], true, true);
                    parent.children.push(_tempParent);
                }

            } else {
                // 检查是否有通用爸爸
                for (let i = 0; i < parent.children.length; i++) {
                    if (parent.children[i].name === key) {
                        _tempParent = parent.children[i];
                        break;
                    }
                }
                // 如果还没有 就造通用爸爸
                if (!_tempParent) {
                    _tempParent = _BuildZTreeNode(key, true, true);
                    parent.children.push(_tempParent);
                }
            }
            return _tempParent;
        }
    }

    /**
     * 刷新树状图聚焦位置
     * @private
     */
    function _RefreshFocusPosition() {
        let target = undefined;
        target = member.zTreeObj.getSelectedNodes();
        if (target.length === 1) {
            member.zTreeObj.selectNode(target[0], false, false);
        }
        target = member.zTreeObjNormal.getSelectedNodes();
        if (target.length === 1) {
            member.zTreeObjNormal.selectNode(target[0], false, false);
        }
    }

    // endregion

    // region zTree正向控制
    /**
     * ztree单击事件
     * @param event
     * @param treeId
     * @param treeNode
     * @param clickFlag
     * @private
     */
    function _ZTreeClickCallback(event, treeId, treeNode, clickFlag) {
        member._isClick = true;
        let targets = undefined;
        if (clickFlag === 1) {
            if (treeNode._externalId) {
                ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", treeNode._externalId);
                targets = [treeNode._externalId];
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("清除所有选择");
                member._isClick = true;
                let childrenList = [];
                member.zTreeObj.selectNode(treeNode, 2, true);
                _RecursionAllChildren(treeNode, childrenList);
                targets = childrenList;
                ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", childrenList);
            }
        } else {
            let childrenList = [];
            let list = member.zTreeObj.getSelectedNodes();
            for (let i = 0; i < list.length; i++) {
                if (list[i]._externalId) {
                    childrenList.push(list[i]._externalId);
                } else {
                    member.zTreeObj.selectNode(list[i], 2, true);
                    _RecursionAllChildren(list[i], childrenList);
                }
            }
            targets = childrenList;
            ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", childrenList);
        }

        let nodes = member.zTreeObjNormal.getSelectedNodes();
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i++) {
                member.zTreeObjNormal.cancelSelectedNode(nodes[i]);
            }
        }
        if (targets) {
            let nodes = _GetTreeNodeWithExternalIdNormal(targets);
            if (nodes.length === 1) {
                for (let i = 0; i < nodes.length; i++) {
                    member.zTreeObjNormal.selectNode(nodes[i], false, false);
                }
            } else {
                for (let i = 0; i < nodes.length; i++) {
                    member.zTreeObjNormal.selectNode(nodes[i], true, false);
                }
            }
        }

    }

    /**
     * ztree单击事件 标准树版本
     * @param event
     * @param treeId
     * @param treeNode
     * @param clickFlag
     * @private
     */
    function _ZTreeClickCallbackNormal(event, treeId, treeNode, clickFlag) {
        member._isClick = true;
        let targets = undefined;
        if (clickFlag === 1) {
            if (treeNode._externalId) {
                ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", treeNode._externalId);
                targets = [treeNode._externalId];
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("清除所有选择");
                member._isClick = true;
                let childrenList = [];
                member.zTreeObjNormal.selectNode(treeNode, 2, true);
                _RecursionAllChildren(treeNode, childrenList);
                targets = childrenList;
                ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", childrenList);
            }
        } else {
            let childrenList = [];
            let list = member.zTreeObjNormal.getSelectedNodes();
            for (let i = 0; i < list.length; i++) {
                if (list[i]._externalId) {
                    childrenList.push(list[i]._externalId);
                } else {
                    member.zTreeObjNormal.selectNode(list[i], 2, true);
                    _RecursionAllChildren(list[i], childrenList);
                }
            }
            targets = childrenList;
            ZhiUTech_MsgCenter.L_SendMsg("根据ID选择构件", childrenList);
        }
        let nodes = member.zTreeObj.getSelectedNodes();
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i++) {
                member.zTreeObj.cancelSelectedNode(nodes[i]);
            }
        }
        if (targets) {
            let nodes = _GetTreeNodeWithExternalId(targets);
            if (nodes.length === 1) {
                for (let i = 0; i < nodes.length; i++) {
                    member.zTreeObj.selectNode(nodes[i], false, false);
                }
            } else {
                for (let i = 0; i < nodes.length; i++) {
                    member.zTreeObj.selectNode(nodes[i], true, false);
                }
            }
        }

    }

    /**
     * ZTree双击事件
     * @param event
     * @param treeId
     * @param treeNode
     * @private
     */
    function _ZTreeDoubleClickCallback(event, treeId, treeNode) {
        if (!treeNode) return;
        member._isDbClick = true;
        if (treeNode._externalId) {
            ZhiUTech_MsgCenter.L_SendMsg("根据ID聚焦构件", treeNode._externalId);
        } else {
            let childrenList = [];
            member.zTreeObj.selectNode(treeNode, 2, true);
            _RecursionAllChildren(treeNode, childrenList);
            ZhiUTech_MsgCenter.L_SendMsg("根据ID聚焦构件", childrenList);
        }
    }

    /**
     * ZTree双击事件 标准树版本
     * @param event
     * @param treeId
     * @param treeNode
     * @private
     */
    function _ZTreeDoubleClickCallbackNormal(event, treeId, treeNode) {
        if (!treeNode) return;
        member._isDbClick = true;
        if (treeNode._externalId) {
            ZhiUTech_MsgCenter.L_SendMsg("根据ID聚焦构件", treeNode._externalId);
        } else {
            let childrenList = [];
            member.zTreeObjNormal.selectNode(treeNode, 2, true);
            _RecursionAllChildren(treeNode, childrenList);
            ZhiUTech_MsgCenter.L_SendMsg("根据ID聚焦构件", childrenList);
        }
    }

    /**
     * ZTree复选框点击事件
     * @param event
     * @param treeId
     * @param treeNode
     * @private
     */
    function _ZTreeCheckBoxCallback(event, treeId, treeNode) {
        member._isCheckBoxHide = true;
        // member._isCheckBoxIsolate = true;

        ZhiUTech_MsgCenter.L_SendMsg("全部显示隐藏", [false, true]);

        let list = member.zTreeObj.getCheckedNodes(false);
        if (list.length > 0) {
            list = list.map(item => {
                if (item._externalId) return item._externalId;
            });
            ZhiUTech_MsgCenter.L_SendMsg("根据ID隐藏构件", list);
            let targets = _GetTreeNodeWithExternalIdNormal(list);
            if (targets.length > 0) {
                if (targets.length === 1) {
                    member.zTreeObjNormal.checkNode(targets[0], false, true, false);
                } else {
                    for (let i = 0; i < targets.length; i++) {
                        member.zTreeObjNormal.checkNode(targets[i], false, true, false);
                    }
                }
            }
        } else {
            member.zTreeObjNormal.checkAllNodes(true);
        }

    }

    /**
     * ZTree复选框点击事件 标准树版本
     * @param event
     * @param treeId
     * @param treeNode
     * @private
     */
    function _ZTreeCheckBoxCallbackNormal(event, treeId, treeNode) {
        member._isCheckBoxHide = true;
        // member._isCheckBoxIsolate = true;

        ZhiUTech_MsgCenter.L_SendMsg("全部显示隐藏", [false, true]);

        let list = member.zTreeObjNormal.getCheckedNodes(false);
        if (list.length > 0) {
            list = list.map(item => {
                if (item._externalId) return item._externalId;
            });
            ZhiUTech_MsgCenter.L_SendMsg("根据ID隐藏构件", list);
            let targets = _GetTreeNodeWithExternalId(list);
            if (targets.length > 0) {
                if (targets.length === 1) {
                    member.zTreeObj.checkNode(targets[0], false, true, false);
                } else {
                    for (let i = 0; i < targets.length; i++) {
                        member.zTreeObj.checkNode(targets[i], false, true, false);
                    }
                }
            }
        } else {
            member.zTreeObj.checkAllNodes(true);
        }
    }

    // endregion

    // region 通知中心 Listener 实现
    /**
     * 通知中心 : 模型开始加载     作用:初始化树
     * @param {ModelOptions} arg 模型加载的配置信息
     * @private
     */
    function _MsgCenter_InitializeTree(arg) {
        if (!member._treeDic[arg.GUID]) {
            member._treeDic[arg.GUID] = _BuildZTreeNode(arg.FileName, true, true);
            member._treeDic[arg.GUID]._ModelGUID = arg.GUID;
            member._treeDicNormal[arg.GUID] = _BuildZTreeNode(arg.FileName, true, true);
            member._treeDicNormal[arg.GUID]._ModelGUID = arg.GUID;

            member._dataBaseDic[arg.GUID] = [];
            _ReadJsonAction(arg);
        } else {
            ZhiUTech_MsgCenter.L_SendMsg("错误", "添加重复的树信息");
        }
    }

    /**
     * 通知中心 : 构件选择变更
     * @param {string[]} ids id组(externalId)
     * @private
     */
    function _MsgCenter_SelectionChanged(ids) {
        if (member._isClick) {
            member._isClick = false;
            return;
        }
        if (member._isDbClick) {
            member._isDbClick = false;
            return;
        }
        if (ids.length > 0) {
            let targets = _GetTreeNodeWithExternalId(ids);
            let targetsNormal = _GetTreeNodeWithExternalIdNormal(ids);
            if (targets.length === 1) {
                member.zTreeObj.selectNode(targets[0], false);
            } else {
                for (let i = 0; i < targets.length; i++) {
                    member.zTreeObj.selectNode(targets[i], true);
                }
            }

            if (targetsNormal.length === 1) {
                member.zTreeObjNormal.selectNode(targetsNormal[0], false);
            } else {
                for (let i = 0; i < targetsNormal.length; i++) {
                    member.zTreeObjNormal.selectNode(targetsNormal[i], true);
                }
            }

        } else {
            member.zTreeObj.cancelSelectedNode();
            member.zTreeObjNormal.cancelSelectedNode();
        }
    }

    /**
     * 通知中心 : 构件隐藏
     * @param {string[]} ids id组(externalId)
     * @private
     */
    function _MsgCenter_HideObjectCallback(ids) {
        if (member._isCheckBoxHide) {
            member._isCheckBoxHide = false;
            return;
        }
        if (ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                member.zTreeObj.checkNode(member._ExternalToTreeNodeDic[ids[i]], false, true, false);
                member.zTreeObjNormal.checkNode(member._ExternalToTreeNodeDicNormal[ids[i]], false, true, false);
            }
        }
    }

    /**
     * 通知中心 : 构件隔离
     * @param {string[]} ids id组(externalId)
     * @private
     */
    function _MsgCenter_IsolateObjectCallback(ids) {
        if (member._isCheckBoxIsolate) {
            member._isCheckBoxIsolate = false;
            return;
        }
        member.zTreeObj.checkAllNodes(false);
        member.zTreeObjNormal.checkAllNodes(false);
        if (ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                member.zTreeObj.checkNode(member._ExternalToTreeNodeDic[ids[i]], true, true, false);
                member.zTreeObjNormal.checkNode(member._ExternalToTreeNodeDicNormal[ids[i]], true, true, false);
            }
        } else {
            member.zTreeObj.checkAllNodes(true);
            member.zTreeObjNormal.checkAllNodes(true);
        }
    }

    /**
     * 通知中心: 构件隔离_自定义
     * @param {string[]} ids id组(externalId)
     * @private
     */
    function _MsgCenter_HideObjectCustomCallback(ids) {
        member.zTreeObj.checkAllNodes(false);
        member.zTreeObjNormal.checkAllNodes(false);
        if (ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                member.zTreeObj.checkNode(member._ExternalToTreeNodeDic[ids[i]], true, true, false);
                member.zTreeObjNormal.checkNode(member._ExternalToTreeNodeDicNormal[ids[i]], true, true, false);
            }
        }
    }

    /**
     * 通知中心: 开关复选框_树状图
     * @param {boolean} isCheck 是否开启
     * @private
     */
    function _MsgCenter_SetAllCheckBox(isCheck) {
        member.zTreeObj.checkAllNodes(isCheck);
    }

    /**
     * 通知中心: 获取所有索引信息
     * @param {LimitMsg} limitMsg 索引信息(用于高级筛选)
     * @private
     */
    function _MsgCenter_GetLimitMsg(limitMsg) {
        limitMsg.limitNameList = member._LimitNameList;
        limitMsg.limitDic = member._LimitDic;
        limitMsg.objectTotal = _GetAllObjectId();
    }

    /**
     * 通知中心: 获取索引结果
     * @param {Array} arg arg[0]: {Array} 装有关键字的数组; arg[1]: {boolean} 是否需要选中筛选结果; arg[2]: {LimitResult} 成功后的回调请查看API详解
     * @private
     */
    function _MsgCenter_GetLimitResult(arg) {
        let list = arg[0];
        let needSelect = arg[1];
        arg[2](_GetLimitResult(list, needSelect));
    }

    /**
     * 通知中心: 获取父级属性名
     * @param {function} callback 参数为父级属性名数组 string[]
     * @private
     */
    function _MsgCenter_GetPropertiesParentName(callback) {
        callback(member.propertyName);
    }

    /**
     * 通知中心: 模型卸载成功 作用:删除对应数据库及模型树
     * @param arg
     * @private
     */
    function _MsgCenter_DeleteTree(arg) {
        if (member._treeDic[arg._ModelGUID]) {
            delete member._treeDic[arg._ModelGUID];
        }
        if (member._treeDicNormal[arg._ModelGUID]) {
            delete member._treeDicNormal[arg._ModelGUID];
        }
        if (member._dataBaseDic[arg._ModelGUID]) {
            delete member._dataBaseDic[arg._ModelGUID];
        }
        let list = member.zTreeObj.getNodes();
        for (let i = 0; i < list.length; i++) {
            if (list[i]._ModelGUID === arg._ModelGUID) {
                member.zTreeObj.removeNode(list[i]);
            }
        }
    }

    /**
     * 通知中心: 刷新树状图聚焦位置
     * @private
     */
    function _MsgCenter_RefreshFocusPosition() {
        _RefreshFocusPosition();
    }

    /**
     * 通知中心: 树状图模糊查询
     * @param {string} keyword 查询关键字
     * @private
     */
    function _MsgCenter_TreeFuzzySearch(keyword) {
        _TreeFuzzySearch(keyword);
    }

    // endregion

    // region 外部
    /**
     * 设置是否显示树状图面板
     * @function SetDivisionVisibility
     * @param {boolean} isVisible 是否显示
     */
    member.SetDivisionVisibility = function (isVisible) {
        if (isVisible) {
            member._div.style.left = "50px";
            member._divNormal.style.left = "50px";
        } else {
            member._div.style.left = "-500px";
            member._divNormal.style.left = "-500px";
        }
    };
    // endregion

    // region 高级筛选

    /**
     * 获取所有构件总数
     * @return {number} 构件总数
     * @private
     */
    function _GetAllObjectId() {
        let result = 0;
        // let list = Object.values(member._dataBaseDic);
        // for (let i = 0; i < list.length; i++) {
        //     result+=list[i].length;
        // }
        let arg = [[], true];
        ZhiUTech_MsgCenter.L_SendMsg("获取所有构件ID", arg);
        result = arg[0].length;
        return result;
    }

    /**
     * 获取所有限制筛选的名称
     * @function L_GetAllLimitName
     * @return {string[]} 名称数组
     */
    mgr.L_GetAllLimitName = function () {
        return member._LimitNameList;
    };

    /**
     *  获取限制后的结果
     * @param {string[]} list 限制条件
     * @param {boolean} needSelect 是否需要选择
     * @return {LimitResult} 索引结果
     */
    mgr.L_GetLimitResult = function (list, needSelect) {
        return _GetLimitResult(list, needSelect);
    };

    /**
     * 获取所有构件总数
     * @function L_GetObjectTotal
     * @return {number} 构件总数
     */
    mgr.L_GetObjectTotal = function () {
        return _GetAllObjectId();
    };

    // endregion

    // region 搜索模块
    /**
     * 设置所有节点可见性
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _SetAllNodesVisible(isShow = true) {
        let allNodes = member.zTreeObj.transformToArray(member.zTreeObj.getNodes());
        let allNodesNormal = member.zTreeObjNormal.transformToArray(member.zTreeObjNormal.getNodes());
        if (isShow) {
            member.zTreeObj.showNodes(allNodes);
            member.zTreeObjNormal.showNodes(allNodesNormal);
        } else {
            member.zTreeObj.hideNodes(allNodes);
            member.zTreeObjNormal.hideNodes(allNodesNormal);
        }
    }

    /**
     * 根据关键字隐藏子节点
     * @param {string} keyword 关键字
     * @private
     */
    function _HideChildNodesByKeyword(keyword) {
        let result = member.zTreeObj.getNodesByFilter(
            arg => {
                return arg._customPropertyName !== undefined && arg._customPropertyName.indexOf(keyword) === -1;
            });
        member.zTreeObj.hideNodes(result);
        result = member.zTreeObjNormal.getNodesByFilter(
            arg => {
                return arg._customPropertyName !== undefined && arg._customPropertyName.indexOf(keyword) === -1;
            });
        member.zTreeObjNormal.hideNodes(result);
    }

    /**
     * 刷新树节点
     * @param {object} tree 树句柄
     * @private
     */
    function _RefreshTreeNodes(tree) {
        // 1.获取需要筛选的父节点
        // 2.遍历父节点
        // 3.检查是否有符合条件的父节点
        // 4.把符合条件的父节点压入容器
        // 5.隐藏符合条件的父节点
        // 6.循环第一步,直到容器内没有符合条件的父节点

        while (true) {
            // 1.获取需要筛选的父节点
            let list = _GetParentNodeByParameterFormTree(tree);
            let targets = [];
            // 2.遍历父节点
            for (let i = 0; i < list.length; i++) {
                if (list[i].children) {
                    let needHidden = true;
                    // 3.检查是否有符合条件的父节点
                    for (let j = 0; j < list[i].children.length; j++) {
                        if (!list[i].children[j].isHidden) {
                            needHidden = false;
                            break;
                        }
                    }
                    // 4.把符合条件的父节点压入容器
                    if (needHidden) {
                        targets.push(list[i]);
                    }
                }
            }

            if (targets.length > 0) {
                // 5.隐藏符合条件的父节点
                tree.hideNodes(targets);
            } else {
                ZhiUTech_MsgCenter.L_SendMsg("警告", "树自检结束");
                return;
            }
        }

    }

    /**
     * 从树内获取符合条件的父物体
     * @param {object} tree 树句柄
     * @returns {*} 父节点数组
     * @private
     */
    function _GetParentNodeByParameterFormTree(tree) {
        return tree.getNodesByFilter(
            arg => {
                return !arg.isHidden && arg.isParent;
            });
    }

    /**
     * 搜索节点
     * @function L_TreeFuzzySearch
     * @param {string} keyword 关键字
     */
    mgr.L_TreeFuzzySearch = function (keyword) {
        _TreeFuzzySearch(keyword);
    };

    /**
     * 树状图模糊查询
     * @param {string} keyword 查询关键字
     * @private
     */
    function _TreeFuzzySearch(keyword) {
        // 将所有节点设置显示
        _SetAllNodesVisible();
        if (keyword === undefined || keyword === "") return;
        // 根据关键字隐藏子节点
        _HideChildNodesByKeyword(keyword);
        // 刷新两颗树
        _RefreshTreeNodes(member.zTreeObj);
        _RefreshTreeNodes(member.zTreeObjNormal);
    }


    // endregion

    zhiu.ZhiUTech_NewTree = mgr;
    ZhiUTech_MsgCenter.L_AddListener("ZTREE初始化成功", function () {
        _InitializeTreeDivisionAndObject();
    });
    _InitilizeListener();

    (function () {
        mgr._member._modelOptions=[];
        for (let i = 0; i < pathArray.length; i++) {
            let options={};
            let url=pathArray[i];
            let str = url.split("/");
            options.FileName = str[str.length - 1].replace(".esd", "");
            options.FilePath = url;
            options.DBPath = url.replace((url.substring((url.lastIndexOf("/") + 1))), "SecondDb.db");
            mgr._member._modelOptions.push(options);
            _MsgCenter_InitializeTree(options);
        }

    })();

}

/**
 * 索引信息
 * @class LimitMsg
 * @param {Array} limitNameList 限制关键字
 * @param {Array[]} limitDic 符合要求的名称 数组套数组
 * @param {number} objectTotal 构件总数
 */

/**
 * 索引结果
 * @class LimitResult
 * @param {string[]} resultArray 符合要求的构件id数组
 * @param {Array[]} limitDic 符合要求的名称 数组套数组
 */





























