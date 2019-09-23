// region THREE.CanvasTexture 拓展
THREE.CanvasTexture = function (canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {

    THREE.Texture.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);

    this.needsUpdate = true;

};
THREE.CanvasTexture.prototype = Object.create(THREE.Texture.prototype);
THREE.CanvasTexture.prototype.constructor = THREE.CanvasTexture;

// endregion

/**
 * ThreeJs模块插件 初始化
 * @param {object} zhiu 核心句柄
 * @function Initialize_ZhiUTech_ThreeJsMaker
 */
function Initialize_ZhiUTech_ThreeJsMaker(zhiu) {

    // region 成员
    let mgr = {};
    mgr.viewer = zhiu.viewer;
    mgr._IsWorkAreaVisible=false;
    mgr._IsMilepostVisible=false;
    mgr._MilepostGroup = undefined;
    mgr._WorkAreaGroup = undefined;
    mgr._WorkAreaMsgPanelHeight = undefined;
    mgr._WorkAreaOffset = undefined;
    mgr._WorkAreaBoxWidth = undefined;
    mgr._WorkAreaBoxTop = undefined;
    mgr._WorkAreaBoxBottom = undefined;

    // region 主向量初始化
    mgr._startPos = new THREE.Vector3(-132.088,-380.831,111,816);
    mgr._endPos = new THREE.Vector3(103.985,385.053,117.432);
    mgr._mainDirection = _SetZAxisToZero(mgr._endPos.clone().sub(mgr._startPos.clone()));
    mgr._mainDirectionNormalize = mgr._mainDirection.clone().normalize();
    // endregion

    // endregion

    // region 内部方法

    /**
     * 初始化各个网格组
     * @private
     */
    function _InitilizeGroup() {
        mgr._MilepostGroup = new THREE.Group();
        mgr._MilepostGroup.name = "ZhiUTech_MilepostGroup";
        mgr._MilepostGroup.visible = false;
        mgr._WorkAreaGroup = new THREE.Group();
        mgr._WorkAreaGroup.name = "ZhiUTech_WorkAreaGroup";
        mgr._WorkAreaGroup.visible = false;
        mgr._IsWorkAreaVisible = false;
        mgr._IsMilepostVisible=false;
        ZhiUTech_MsgCenter.L_SendMsg("添加物体到场景", [undefined, mgr._MilepostGroup, false]);
        ZhiUTech_MsgCenter.L_SendMsg("添加物体到场景", [undefined, mgr._WorkAreaGroup, false]);
        ZhiUTech_MsgCenter.L_AddListener("相机更新", _UpdateMilepost);
        ZhiUTech_MsgCenter.L_AddListener("相机更新", _UpdateWorkAreaMsg);
    }


    // endregion

    // region 里程碑

    // region 内部

    /**
     * 创建里程别
     * @param {MilepostData} data 里程碑信息
     * @private
     */
    function _BuildMilepost(data) {
        let sprite = new THREE.CanvasTexture(_GenerateMilepostSprite(data.Content));
        let planeGeometry = new THREE.PlaneBufferGeometry(37, 10);
        let plane = new THREE.Mesh(
            planeGeometry,
            new THREE.MeshBasicMaterial({
                map: sprite,
                color: 0xffffff
            }));
        plane.position.set(data.Position.x, data.Position.y, data.Position.z);
        plane.name = data.Content;
        mgr._MilepostGroup.add(plane);
        ZhiUTech_MsgCenter.L_SendMsg("更新网格旋转", plane);
    }

    /**
     * 生成里程碑精灵
     * @param {string} content 里程碑内容
     * @return {HTMLElement} 有里程碑图样的Canvas
     * @private
     */
    function _GenerateMilepostSprite(content) {

        let canV = document.createElement('canvas');
        canV.width = 370;
        canV.height = 100;
        let context = canV.getContext('2d');
        context.beginPath();
        context.fillStyle = "#4b484a";
        context.fillRect(0, 0, 370, 100);

        context.beginPath();
        context.font = '40px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText("里程 : ", 10, 40);

        context.beginPath();
        context.font = '40px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText(content, 10, 90);

        context.fill();
        context.stroke();


        return canV;

    }

    /**
     * 里程碑的update回调
     * @private
     */
    function _UpdateMilepost() {
        if (mgr._MilepostGroup && mgr._MilepostGroup.visible) {
            for (let i = 0; i < mgr._MilepostGroup.children.length; i++) {
                ZhiUTech_MsgCenter.L_SendMsg("更新网格旋转", mgr._MilepostGroup.children[i]);
            }
        }
    }

    // endregion

    // region 外部

    /**
     * 根据列表创建里程碑面板
     * @function L_BuildMilepost
     * @param {MilepostData[]} list 里程碑信息组
     */
    mgr.L_BuildMilepost = function (list) {
        for (let i = 0; i < list.length; i++) {
            _BuildMilepost(list[i]);
        }
        ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");
    };

    /**
     * 设置里程碑显示隐藏
     * @function L_SetMilepostVisibility
     * @param {boolean} isShow 是否显示
     */
    mgr.L_SetMilepostVisibility = function (isShow) {
        mgr._MilepostGroup.visible = isShow;
        mgr._IsMilepostVisible=isShow;
        ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");
    };

    /**
     * 清空所有里程碑
     * @function L_ClearAllMilepost
     */
    mgr.L_ClearAllMilepost = function () {
        ZhiUTech_MsgCenter.L_SendMsg("删除物体到场景", [undefined, mgr._MilepostGroup, false]);
        mgr._MilepostGroup = new THREE.Group();
        mgr._MilepostGroup.name = "ZhiUTech_MilepostGroup";
        mgr._MilepostGroup.visible = mgr._IsMilepostVisible;

        ZhiUTech_MsgCenter.L_SendMsg("添加物体到场景", [undefined, mgr._MilepostGroup, false]);
    };

    // endregion

    // endregion

    // region 工区

    // region 工区信息板 内部

    /**
     * 生成工区信息板精灵
     * @param {WorkAreaData} data 工区数据
     * @return {HTMLElement} 有工区信息板图样的Canvas
     * @private
     */
    function _GenerateWorkAreaMsgSprite(data) {

        let canV = document.createElement('canvas');
        canV.width = 450;
        canV.height = 380;
        let context = canV.getContext('2d');

        context.beginPath();
        context.fillStyle = "#4b484a";
        context.fillRect(0, 0, 450, 450);

        context.beginPath();
        context.font = '60px Microsoft YaHei';
        context.fillStyle = "#ffffff";

        context.fillText(data.AreaName, 15, 59.5);
        context.fillText(data.AreaName, 14.5, 60);
        context.fillText(data.AreaName, 15, 60);
        context.fillText(data.AreaName, 15, 60.5);
        context.fillText(data.AreaName, 15.5, 60);

        context.beginPath();
        context.font = '45px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText("负责人 : " + data.AreaManager, 15, 120);

        context.beginPath();
        context.font = '45px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText("人工 : " + (data.AreaLabor === undefined || data.AreaLabor == null ? "  " : data.AreaLabor) + " 个人", 15, 180);

        context.beginPath();
        context.font = '45px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText("机械 : " + (data.AreaMachine === undefined || data.AreaMachine == null ? "  " : data.AreaMachine) + " 台班", 15, 240);

        context.beginPath();
        context.font = '45px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText("材料 : " + (data.AreaMaterial === undefined || data.AreaMaterial == null ? "  " : data.AreaMaterial) + " 万元", 15, 300);

        context.beginPath();
        context.font = '45px Microsoft YaHei';
        context.fillStyle = "#ffffff";
        context.fillText("产值 : " + (data.AreaProductivity === undefined || data.AreaProductivity == null ? "  " : data.AreaProductivity) + " 万元", 15, 360);

        context.fill();
        context.stroke();

        return canV;

    }

    /**
     * 工区信息板的update回调
     * @private
     */
    function _UpdateWorkAreaMsg() {
        if(mgr._WorkAreaGroup&&mgr._WorkAreaGroup.visible){
            for (let i = 0; i < mgr._WorkAreaGroup.children.length; i++) {
                ZhiUTech_MsgCenter.L_SendMsg("更新网格旋转", mgr._WorkAreaGroup.children[i].children[2]);
            }
        }
    }

    // endregion

    // region 工区盒子 内部

    // region 张培算法
    function Line2DInit(origin, destination) {
        let line = {};
        line.origin = origin.clone();
        line.destination = destination.clone();
        line.origin.z = 0;
        line.destination.z = 0;
        return line;
    }

    function SubVector3(fir, sec) {
        return fir.clone().sub(sec.clone());
    }

    function ComputeParallelIn2D(axis, wide) {
        let vertical = ComputeVertical(SubVector3(axis.destination.clone(), axis.origin.clone()));
        let addOrigin = axis.origin.clone().add(vertical.clone().multiplyScalar(wide));
        let addDestination = axis.destination.clone().add(vertical.clone().multiplyScalar(wide));
        let subOrigin = axis.origin.clone().sub(vertical.clone().multiplyScalar(wide));
        let subDestination = axis.destination.clone().sub(vertical.clone().multiplyScalar(wide));
        // let parallel1 = new Line2DInit(axis.origin.add(vertical.multiplyScalar(wide)), axis.destination.add(vertical.multiplyScalar(wide)));
        let parallel1 = new Line2DInit(addOrigin, addDestination);
        // let parallel2 = new Line2DInit(axis.origin.sub(vertical.multiplyScalar(wide)), axis.destination.sub(vertical.multiplyScalar(wide)));
        let parallel2 = new Line2DInit(subOrigin, subDestination);
        let list = [];
        list.push(parallel1);
        list.push(parallel2);
        return list;
    }

    function ComputeVertical(axis) {
        let tempAxis = new THREE.Vector2(axis.x, axis.y);
        let norVec = RotateDirection(tempAxis, Math.PI / 2).normalize();
        return new THREE.Vector3(norVec.x, norVec.y, 0);
    }

    function RotateDirection(vec, angle) {
        let v2 = new THREE.Vector2();
        v2.x = vec.x * Math.cos(angle) + vec.y * Math.sin(angle);
        v2.y = vec.x * Math.sin(-angle) + vec.y * Math.cos(angle);
        return v2;
    }

    //endregion

    /**
     * z轴归零
     * @param {THREE.Vector3} v3 需要转换的坐标
     * @returns {THREE.Vector3} z轴归零后的坐标
     * @private
     */
    function _SetZAxisToZero(v3) {
        return new THREE.Vector3(v3.x, v3.y, 0);
    }

    /**
     * 通过两个点算出正向四个点
     * @param {THREE.Vector3} fir 第一个点
     * @param {THREE.Vector3} sec 第二个点
     * @param {float} offset 偏移量
     * @returns {THREE.Vector3[]} 正方向四个点
     * @private
     */
    function _CalculatePoint(fir, sec,offset) {
        let ASubStart = fir.clone().sub(mgr._startPos.clone());
        let ADot = ASubStart.clone().dot(mgr._mainDirectionNormalize.clone());
        let AMultiply = mgr._mainDirectionNormalize.clone().multiplyScalar(ADot);
        let v3A = AMultiply.clone().add(mgr._startPos.clone());

        let BSubStart = sec.clone().sub(mgr._startPos.clone());
        let BDot = BSubStart.clone().dot(mgr._mainDirectionNormalize.clone());
        let BMultiply = mgr._mainDirectionNormalize.clone().multiplyScalar(BDot);
        let v3B = BMultiply.clone().add(mgr._startPos.clone());

        let temp = new Line2DInit(v3A, v3B);
        let lineList = ComputeParallelIn2D(temp, mgr._WorkAreaBoxWidth);
        let posList = [];
        posList.push(lineList[0].origin);
        posList.push(lineList[1].origin);
        posList.push(lineList[0].destination);
        posList.push(lineList[1].destination);

        // region 偏移计算
        if(offset){
            let verticalDir= lineList[0].origin.clone().sub(lineList[1].origin.clone()).normalize();
            let lerp=verticalDir.multiplyScalar(offset);
            posList = [];
            posList.push(lineList[0].origin.add(lerp.clone()));
            posList.push(lineList[1].origin.add(lerp.clone()));
            posList.push(lineList[0].destination.add(lerp.clone()));
            posList.push(lineList[1].destination.add(lerp.clone()));
        }
        // endregion

        return posList;
    }

    // endregion

    // region 工区 新逻辑
    function _BuildArea(data) {
        let group = new THREE.Group();
        group.name="AreaGroup";


        // region 工区盒子及边框

        // region 工区盒子
        let list = _CalculatePoint(data.FirstPos, data.SecondPos,mgr._WorkAreaOffset);

        let vertices = [
            new THREE.Vector3(list[0].x, list[0].y, mgr._WorkAreaBoxTop),
            new THREE.Vector3(list[1].x, list[1].y, mgr._WorkAreaBoxTop),
            new THREE.Vector3(list[2].x, list[2].y, mgr._WorkAreaBoxTop),
            new THREE.Vector3(list[3].x, list[3].y, mgr._WorkAreaBoxTop),
            new THREE.Vector3(list[0].x, list[0].y, mgr._WorkAreaBoxBottom),
            new THREE.Vector3(list[1].x, list[1].y, mgr._WorkAreaBoxBottom),
            new THREE.Vector3(list[2].x, list[2].y, mgr._WorkAreaBoxBottom),
            new THREE.Vector3(list[3].x, list[3].y, mgr._WorkAreaBoxBottom),
        ];
        let faces = [
            // region上
            new THREE.Face3(2, 1, 0),
            new THREE.Face3(3, 1, 2),
            // new THREE.Face3(0, 1, 2),
            // new THREE.Face3(2, 1, 3),
            // endregion
            // region下
            new THREE.Face3(4, 5, 6),
            new THREE.Face3(6, 5, 7),
            // new THREE.Face3(6,5,4),
            // new THREE.Face3(7,5,6),
            // endregion
            // region左
            new THREE.Face3(4, 0, 1),
            new THREE.Face3(4, 1, 5),
            // new THREE.Face3(1,0,4),
            // new THREE.Face3(5,1,4),
            // endregion
            // region右
            // new THREE.Face3(2,3,6),
            // new THREE.Face3(6,3,7),
            new THREE.Face3(6, 3, 2),
            new THREE.Face3(7, 3, 6),
            // endregion
            // region前
            new THREE.Face3(5, 1, 3),
            new THREE.Face3(5, 3, 7),
            // new THREE.Face3(3,1,5),
            // new THREE.Face3(7,3,5),
            // endregion
            // region后
            // new THREE.Face3(4,0,2),
            // new THREE.Face3(4,2,6),
            new THREE.Face3(2, 0, 4),
            new THREE.Face3(6, 2, 4),
            // endregion
        ];
        if (data.IsBoxEnable) {
            let boxGeo = new THREE.Geometry();
            boxGeo.vertices = vertices;
            boxGeo.faces = faces;
            boxGeo.computeFaceNormals();
            let boxMat = new THREE.MeshBasicMaterial({
                color: data.BoxColor,
                transparent: true,
                opacity: 0.2,
                depthTest: false,

            });
            // 创建多材质对象
            let box = new THREE.Mesh(boxGeo, boxMat);
            box.name = data.AreaName;
            group.add(box);
        }
        // endregion

        // region 画线框
        let lineMat = new THREE.LineBasicMaterial({
            color: "#f8feff",
            depthTest: false,
        });
        let lineGeo = new THREE.Geometry();
        // region 线框顺序
        lineGeo.vertices.push(vertices[0]);
        lineGeo.vertices.push(vertices[1]);
        lineGeo.vertices.push(vertices[3]);
        lineGeo.vertices.push(vertices[2]);
        lineGeo.vertices.push(vertices[0]);
        lineGeo.vertices.push(vertices[4]);
        lineGeo.vertices.push(vertices[5]);
        lineGeo.vertices.push(vertices[1]);
        lineGeo.vertices.push(vertices[5]);
        lineGeo.vertices.push(vertices[7]);
        lineGeo.vertices.push(vertices[3]);
        lineGeo.vertices.push(vertices[7]);
        lineGeo.vertices.push(vertices[6]);
        lineGeo.vertices.push(vertices[2]);
        lineGeo.vertices.push(vertices[6]);
        lineGeo.vertices.push(vertices[4]);
        // endregion
        let line = new THREE.Line(lineGeo, lineMat);
        line.name = data.AreaName;
        group.add(line);
        // endregion

        // endregion

        // region 工区信息板
        let sprite = new THREE.CanvasTexture(_GenerateWorkAreaMsgSprite(data));
        let planeGeometry = new THREE.PlaneBufferGeometry(112.5, 95);
        let msgPlane = new THREE.Mesh(
            planeGeometry,
            new THREE.MeshBasicMaterial({
                map: sprite,
                color: 0xffffff,
                depthTest: false,
                transparent: true,
            }));

        // region 中心点计算
        let centerPos = new THREE.Vector3();
        centerPos.x = (vertices[0].x + vertices[3].x) / 2;
        centerPos.y = (vertices[0].y + vertices[3].y) / 2;
        centerPos.z = mgr._WorkAreaMsgPanelHeight;
        // endregion
        msgPlane.position.set(centerPos.x, centerPos.y, centerPos.z);
        msgPlane.name = data.AreaName;
        group.add(msgPlane);
        // endregion


        ZhiUTech_MsgCenter.L_SendMsg("更新网格旋转", msgPlane);
        mgr._WorkAreaGroup.add(group);

        return group.uuid;

    }

    // endregion

    // region 外部

    /**
     * 创建工区包围盒及信息面板
     * @function L_MakeWorkArea
     * @param {WorkAreaData} data 工区信息
     * @return {string} 工区的id
     */
    mgr.L_MakeWorkArea = function (data) {

        mgr._WorkAreaBoxWidth = data.workAreaBoxWidth?data.workAreaBoxWidth:150;
        mgr._WorkAreaBoxTop = data.workAreaBoxTop?data.workAreaBoxTop:150;
        mgr._WorkAreaBoxBottom = data.workAreaBoxBottom?data.workAreaBoxBottom:-100;
        mgr._WorkAreaMsgPanelHeight = mgr._WorkAreaBoxTop+50;
        mgr._WorkAreaOffset = data.workAreaOffset?data.workAreaOffset:0;
        ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");// 无参数
        return _BuildArea(data);
    };

    /**
     * 根据id删除工区
     * @function L_DeleteWorkArea
     * @param {string} id 工区的id
     * @return {boolean} 是否删除成功
     */
    mgr.L_DeleteWorkArea=function(id){
        for (let i = 0; i < mgr._WorkAreaGroup.children.length; i++) {
            if(mgr._WorkAreaGroup.children[i].uuid===id){
                mgr._WorkAreaGroup.remove(mgr._WorkAreaGroup.children[i]);
                ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");
                return true;
            }
        }
        return false;
    };

    /**
     * 设置工区包围盒及信息面板可见
     * @function L_SetWorkAreaVisibility
     * @param {boolean} isShow 是否显示
     */
    mgr.L_SetWorkAreaVisibility = function (isShow) {
        mgr._WorkAreaGroup.visible = isShow;
        mgr._IsWorkAreaVisible = isShow;
        ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");
    };

    /**
     * 清除所有工区包围盒及信息面板
     * @function L_ClearAllWorkArea
     */
    mgr.L_ClearAllWorkArea = function () {
        ZhiUTech_MsgCenter.L_SendMsg("删除物体到场景", [undefined, mgr._WorkAreaGroup, false]);
        mgr._WorkAreaGroup = new THREE.Group();
        mgr._WorkAreaGroup.name = "ZhiUTech_WorkAreaGroup";
        mgr._WorkAreaGroup.visible = mgr._IsWorkAreaVisible;
        ZhiUTech_MsgCenter.L_SendMsg("添加物体到场景", [undefined, mgr._WorkAreaGroup, false]);
    };

    /**
     * 设置主向量
     * @function L_SetMainVector
     * @param {THREE.Vector3} firstVector3 第一个向量
     * @param {THREE.Vector3} secondVector3 第二个向量
     */
    mgr.L_SetMainVector = function (firstVector3, secondVector3) {
        mgr._startPos = firstVector3;
        mgr._endPos = secondVector3;
        mgr._mainDirection = _SetZAxisToZero(mgr._endPos.clone().sub(mgr._startPos.clone()));
        mgr._mainDirectionNormalize = mgr._mainDirection.clone().normalize();
        let data={};
        data.StartPos=firstVector3.clone();
        data.EndPos=secondVector3.clone();
        ZhiUTech_MsgCenter.L_SendMsg("保存工区主向量",JSON.stringify(data));
    };
    /**
     * 根据日志还原主向量
     * @function L_ReductionMainDirectionByDataString
     * @param {string} data 向量合集 字符串化的V3
     */
    mgr.L_ReductionMainDirectionByDataString = function (data) {
        data=JSON.parse(data);
        let start=new THREE.Vector3(data.StartPos.x,data.StartPos.y,data.StartPos.z);
        let end=new THREE.Vector3(data.EndPos.x,data.EndPos.y,data.EndPos.z);
        mgr._startPos = start;
        mgr._endPos = end;
        mgr._mainDirection=_SetZAxisToZero(end.clone().sub(start.clone()));
        mgr._mainDirectionNormalize = mgr._mainDirection.clone().normalize();
    };
    // endregion

    // endregion

    // region 通知中心

    // region Listener 外部
    ZhiUTech_MsgCenter.L_AddListener("开关里程碑", _MsgCenter_ToggleMilePost);
    ZhiUTech_MsgCenter.L_AddListener("开关工区", _MsgCenter_ToggleWorkArea);
    // endregion

    // region Listener 外部 方法实现

    /**
     * 通知中心: 里程碑开关
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _MsgCenter_ToggleMilePost(isShow) {
        mgr._MilepostGroup.visible = isShow;
        mgr._IsMilepostVisible=isShow;
        ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");
    }

    /**
     * 通知中心: 工区开关
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _MsgCenter_ToggleWorkArea(isShow) {
        mgr._WorkAreaGroup.visible = isShow;
        mgr._IsWorkAreaVisible = isShow;
        ZhiUTech_MsgCenter.L_SendMsg("刷新THREEJS场景");
    }

    // endregion

    // endregion

    _InitilizeGroup();
    zhiu.ZhiUTech_ThreeJsMaker = mgr;
    ZhiUTech_MsgCenter.L_SendMsg("THREEJS模块插件初始化成功");
}


/**
 * 里程碑面板数据格式  (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class MilepostData
 * @param {THREE.Vector3} Position 位置
 * @param {string} Content 里程碑内容
 */

/**
 * 工区数据格式  (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class WorkAreaData
 * @param {THREE.Vector3} FirstPos 位置
 * @param {THREE.Vector3} SecondPos 位置
 * @param {string} BoxColor 工区盒子颜色 16进制颜色(例: "#ffffff")
 * @param {boolean} IsBoxEnable 工区盒子是否显示
 * @param {string} AreaName 工区名称
 * @param {string} AreaManager 工区管理
 * @param {string} AreaLabor 人力
 * @param {string} AreaMachine 机械
 * @param {string} AreaMaterial 材料
 * @param {string} AreaProductivity 产值
 * @param {number} workAreaBoxWidth 工区盒子宽度
 * @param {number} workAreaBoxTop 工区盒子顶部
 * @param {number} workAreaBoxBottom 工区盒子底部
 * @param {number} workAreaOffset 工区盒子偏移
 */

/**
 * 工区盒子高低数据  (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class WorkAreaBoxData
 * @param {THREE.Vector3} top 顶部高度
 * @param {THREE.Vector3} bottom 底部高度
 */



















































