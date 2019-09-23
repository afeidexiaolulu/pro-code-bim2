/**
 *  创建人 : LJason
 *  功能说明 : 进度动画
 */

/**
 * 初始化进度动画模块
 * @function Initialize_ZhiUTech_ProgressAnimation
 * @param {object} zhiu 核心成员
 */
function Initialize_ZhiUTech_ProgressAnimation(zhiu) {
    // region 成员
    let mgr = {};
    mgr.viewer = zhiu.viewer;
    mgr._color= new THREE.Vector4(1, 0, 0, 1);

    // endregion
    /**
     * 设置整体的可见性
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _SetAllVisibility(isShow){
        ZhiUTech_MsgCenter.L_SendMsg("清除全部颜色");
        ZhiUTech_MsgCenter.L_SendMsg("全部显示隐藏",[true,isShow]);
        ZhiUTech_MsgCenter.L_SendMsg("强制刷新");
    }

    /**
     * 设置染色区域的颜色
     * @function L_SetColor
     * @param {number} red 0-255范围
     * @param {number} green 0-255范围
     * @param {number} blue 0-255范围
     * @param {number} alpha 0-255范围
     */
    mgr.L_SetColor=function(red,green,blue,alpha){
        mgr.color= new THREE.Vector4(red/255, green/255, blue/255, alpha/255);
    };

    /**
     * 开关全体隐形 包含清空颜色
     * @function L_SetVisibility
     * @param {boolean} isShow 是否显示
     */
    mgr.L_SetVisibility = function (isShow) {
        _SetAllVisibility(isShow);
    };

    /**
     * 设置进度动画
     * @function L_ProgressAnimation
     * @param {string[]} showIdList 需要正常显示的构件id数组 （已建设完毕的构件）
     * @param {string[]} colorIdList 需要染色的id数组  （正在建设的构件）
     */
    mgr.L_ProgressAnimation = function (showIdList, colorIdList) {
        _SetAllVisibility(false);
        if (showIdList) {
            showIdList = showIdList.concat(colorIdList);
            ZhiUTech_MsgCenter.L_SendMsg("根据ID隔离构件",showIdList);
        } else {
            ZhiUTech_MsgCenter.L_SendMsg("根据ID隔离构件",colorIdList);
        }

        if (colorIdList) {
            ZhiUTech_MsgCenter.L_SendMsg("根据ID更改构件颜色",[colorIdList,mgr._color]);
        }
    };

    zhiu.ZhiUTech_ProgressAnimation=mgr;
}














