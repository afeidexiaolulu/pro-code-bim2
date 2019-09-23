/**
 *  创建人 : LJason
 *  功能说明 : 加载控制器
 */

/**
 * 主要相对路径,用于描述路径前缀
 * @type {string}
 */
var ZHIU_MAINRELATIVEPATH="../../static/ZhiU_Engine/";

/**
 * 关键脚本列表（请勿随意修改顺序）
 * @type {string[]}
 */
let pathList=[
    "public_Core/jquery.min.js",
    "public_Core/jquery.qrcode.min.js",
    "public_Core/three.js",
    "zhiu_Core/zuv3D.js",
    "zhiu_Core/zv_initialize.js",
    "zhiu_Core/zv_init_TransformGizmos.js",
    "zhiu_Core/zv_selector.js",
    "zhiu_Core/zv_createscript.js",
    "zhiu_Core/zv_load.js",
    "zhiu_Core/zv_mesh.js",
    "zhiu_Core/zv_rendercontext.js",
    "zhiu_Core/zv_preset.js",
    "zhiu_Core/zv_materialmanager.js",
    "zhiu_Core/zv_animation.js",
    "zhiu_Core/zv_impl.js",
    "zhiu_Core/zv_i18next.js",
    "zhiu_Core/zv_messagebox.js",
    "zhiu_Core/zv_Panel.js",
    "zhiu_Core/zv_ExtensionManager.js",
    "zhiu_Core/zv_extensions.js",
    "zhiu_Core/zv_event.js",
    "zhiu_Core/zv_UnifiedCamera.js",
    "zhiu_Core/zv_prototype.js",
    "zhiu_Core/zv_document.js",
    "zhiu_Core/zv_toolbar.js",
    "zhiu_Core/zv_visibilitymanager.js",
    "zhiu_Core/zv_navigation.js",
    "zhiu_Core/extensions/Markups/Markups.js",

    "zhiu_Foundation/ZhiUTech_MsgCenter.js",
    "zhiu_Foundation/ZhiUTech.js",
];

/**
 * 插件脚本列表
 * @type {string[]}
 */
let pluginList=[
    "zhiu_Plugins/ZhiUTech_BoxSelection.js",
    "zhiu_Plugins/ZhiUTech_ProgressAnimation.js",
    "zhiu_Plugins/ZhiUTech_ThreeJsMaker.js",
    "zhiu_Plugins/ZhiUTech_CloneGeometry.js",
    "zhiu_Plugins/ZhiUTech_Settings.js",
    "zhiu_Plugins/ZhiUTech_ZTree/ZhiUTech_ZTree.js",
    "zhiu_Plugins/ZhiUTech_NewTree.js",
    "zhiu_Plugins/ZhiUTech_QRCode.js",
    "zhiu_UI/js/ZhiUTech_UIPlugins.js",
    "zhiu_UI/js/colorpicker.js",
    "zhiu_UI/js/zhiu_UI.js",
    "zhiu_Gis/Cesium.js",
];

/**
 * css列表
 */
let cssList=[
    "zhiu_Style/style.css",
    "zhiu_Style/region.css",
    "zhiu_UI/css/iconfont.css",
    "zhiu_Plugins/ZhiUTech_ZTree/zTreeStyle/zTreeStyle.css",
    "zhiu_UI/css/filterWindow.css",
    "zhiu_UI/css/zhiu_UI.css",
    "zhiu_Gis/Widgets/widgets.css",
    "zhiu_Gis/Widgets/self.css",
];

/**
 * 动态加载器
 * @function ZhiUTech_ResourcesLoader
 * @param {function} successAction 加载完成的回调
 */
function ZhiUTech_ResourcesLoader(successAction) {

    if(!ZHIU_MAINRELATIVEPATH){
        ZHIU_MAINRELATIVEPATH="";
    }

    _DynamicLoadCSS(cssList.shift(),_SuccessAction,_ErrorAction);
    // _DynamicLoadScript(pathList.shift(),_SuccessAction,_ErrorAction);

    /**
     * 动态加载css
     * @param {string} cssPath 脚本地址
     * @param {function} successAction 加载成功的回调
     * @param {function} errorAction 加载错误的回调
     * @private
     */
    function _DynamicLoadCSS(cssPath, successAction, errorAction) {
        let css = document.createElement('link');
        css.type='text/css';
        css.rel = 'stylesheet';
        css.onload = successAction;
        css.onerror = errorAction;
        css.href  = ZHIU_MAINRELATIVEPATH+cssPath;
        document.head.appendChild(css);
    }

    /**
     * 动态加载脚本
     * @param {string} scriptPath 脚本地址
     * @param {function} successAction 加载成功的回调
     * @param {function} errorAction 加载错误的回调
     * @private
     */
    function _DynamicLoadScript(scriptPath, successAction, errorAction) {
        let script = document.createElement('script');
        script.onload = successAction;
        script.onerror = errorAction;
        script.src = ZHIU_MAINRELATIVEPATH+scriptPath;
        document.head.appendChild(script);
    }

    /**
     * 加载成功的回调（递归结构持续加载）
     * @param {object} arg
     * @private
     */
    function _SuccessAction(arg) {
        if(cssList.length>0){
            _DynamicLoadCSS(cssList.shift(),_SuccessAction,_ErrorAction);
        }else{
            if(pathList.length>0){
                _DynamicLoadScript(pathList.shift(),_SuccessAction,_ErrorAction);
            }else{
                if(pluginList.length>0){
                    _DynamicLoadScript(pluginList.shift(),_SuccessAction,_ErrorAction);
                }else{
                    console.log(" >LJason< 日志：全部文件加载完毕~！");
                    successAction();
                }
            }
        }
    }

    /**
     * 错误的回调
     * @param error
     * @private
     */
    function _ErrorAction(error) {
        console.error(" >LJason< 错误：资源加载器出现问题，将会导致整个过程失败，请联系管理！",error);
    }

}



































