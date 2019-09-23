/**
 *  创建人 : LJason
 *  功能说明 : 设置模块
 */

/**
 * 设置模块 初始化
 * @param {object} zhiu 核心句柄
 * @param {boolean} [needSettingsPanel=false] 是否需要面板显示
 */
function Initialize_ZhiUTech_Settings(zhiu,needSettingsPanel=false) {
    let mgr={};
    // region 成员
    let _member={};
    _member._qualityFirst=false;// 质量优先
    _member._instantRendering=false;// 即时渲染
    _member._FXAA=false;// 抗锯齿
    _member._groundShadow=false;// 地面阴影
    _member._groundReflection=false;// 地面反射
    _member._shadow=false;// 阴影
    _member._shadowPosition=new THREE.Vector3(0,0,0);// 阴影方向
    _member._sequentialRendering=false;// 顺序渲染

    _member._specialEffectFiter=false;// 特效滤镜
    _member._colorFidelity=false;// 颜色保护
    _member._colorEnhancement=false;// 色彩增强
    _member._brightness=0;// 亮度
    _member._contrast=0;// 对比度
    _member._grayscale=0;// 灰度
    _member._exposure=0;// 曝光值

    _member._skyColor=new THREE.Color(128,128,128);// 天空颜色
    _member._groundColor=new THREE.Color(128,128,128);// 地面颜色
    mgr._member=_member;
    // endregion

    // region 内部方法
    function _RefreshCanvas() {
        zhiu.viewer.impl.invalidate(true);
    }
    function _ToggleQualityFirst(isOpen) {
        zhiu.viewer.impl.setOptimizeNavigation(!isOpen);
        _member._qualityFirst=isOpen;
    }
    function _ToggleInstantRendering(isOpen) {
        zhiu.viewer.impl.toggleProgressive(!isOpen);
        _member._instantRendering=isOpen;
    }
    function _ToggleFXAA(isOpen) {
        zhiu.viewer.impl.togglePostProcess(false, isOpen);
        _member._FXAA=isOpen;
    }
    function _ToggleGroundShadow(isOpen) {
        zhiu.viewer.impl.toggleGroundShadow(isOpen);
        _member._groundShadow=isOpen;
    }
    function _ToggleGroundReflection(isOpen) {
        zhiu.viewer.impl.toggleGroundReflection(isOpen);
        _member._groundReflection=isOpen;
    }
    function _ToggleShadow(isOpen) {
        zhiu.viewer.impl.toggleShadows(isOpen);
        _member._shadow=isOpen;
    }
    function _SetShadowPosition(x,y,z) {
        _member._shadowPosition=new THREE.Vector3(
            x===undefined?_member._shadowPosition.x:parseFloat(x),
            y===undefined?_member._shadowPosition.y:parseFloat(y),
            z===undefined?_member._shadowPosition.z:parseFloat(z));
        zhiu.viewer.impl.setShadowLightDirection(_member._shadowPosition);
    }
    function _ToggleSequentialRendering(isOpen) {
        zhiu.viewer.impl.toggleVizBuffer(!isOpen);
        _member._sequentialRendering=isOpen;
    }

    function _ToggleSpecialEffectFilter(isOpen){
        mgr._member._specialEffectFiter=isOpen;
        if(isOpen){
            zhiu.viewer.impl.renderer().setPostProcessParameter("style","edging");
            zhiu.viewer.impl.renderer().setPostProcessParameter("edges");
            zhiu.viewer.impl.setLightPreset(5);
            zhiu.viewer.setBackgroundColor(201,253,244,255,252,225);
        }else{
            zhiu.viewer.impl.renderer().setPostProcessParameter("style");
            zhiu.viewer.impl.setLightPreset(3);
            zhiu.viewer.setBackgroundColor(128,128,128,128,128,128);
        }
    }
    function _ToggleColorFidelity_SpecialEffectFilter(isOpen){
        _member._colorFidelity=isOpen;
        if(isOpen){
            zhiu.viewer.impl.renderer().setPostProcessParameter("preserveColor",1);
        }else{
            zhiu.viewer.impl.renderer().setPostProcessParameter("preserveColor");
        }
        _RefreshCanvas();
    }
    function _ToggleColorEnhancement_SpecialEffectFilter(isOpen){
        _member._colorEnhancement=isOpen;
        let mats=zhiu.viewer.impl.matman()._materials;
        if(isOpen){
            Object.keys(mats).map(arg=>{
                mats[arg].emissive=mats[arg].color
            })
        }else{
            Object.keys(mats).map(arg=>{
                mats[arg].emissive=new THREE.Color(0,0,0);
            })
        }
        _RefreshCanvas();
    }
    function _SetBrightness_SpecialEffectFilter(value){
        _member._brightness=value;
        zhiu.viewer.impl.renderer().setPostProcessParameter("brightness",value);
        _RefreshCanvas();
    }
    function _SetContrast_SpecialEffectFilter(value){
        _member._contrast=value;
        zhiu.viewer.impl.renderer().setPostProcessParameter("contrast",value);
        _RefreshCanvas();
    }
    function _SetGrayscale_SpecialEffectFilter(value){
        _member._grayscale=value;
        zhiu.viewer.impl.renderer().setPostProcessParameter("grayscale",value);
        _RefreshCanvas();
    }
    function _SetExposure_SpecialEffectFilter(value){
        _member._exposure=value;
        zhiu.viewer.impl.setTonemapExposureBias(value);
        _RefreshCanvas();
    }

    function _SetSkyOrGroundColor(skyR,skyG,skyB,groundR,groundG,groundB) {
        _member._skyColor.r=skyR===undefined?_member._skyColor.r:skyR;
        _member._skyColor.g=skyG===undefined?_member._skyColor.g:skyG;
        _member._skyColor.b=skyB===undefined?_member._skyColor.b:skyB;
        _member._groundColor.r=groundR===undefined?_member._groundColor.r:groundR;
        _member._groundColor.g=groundG===undefined?_member._groundColor.g:groundG;
        _member._groundColor.b=groundB===undefined?_member._groundColor.b:groundB;
        zhiu.viewer.setBackgroundColor(
            _member._skyColor.r,_member._skyColor.g,_member._skyColor.b,
            _member._groundColor.r,_member._groundColor.g,_member._groundColor.b);
    }
    // endregion

    // region 性能设置 公共方法
    /**
     * 质量优先 (开启后将会渲染移动中的效果)
     * @function ZhiUTech_Settings  L_ToggleQualityFirst
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleQualityFirst=function (isOpen) {
        _ToggleQualityFirst(isOpen);
    };
    /**
     * 即时渲染 (如果不开启就分批进行渲染显示)
     * @function ZhiUTech_Settings  L_ToggleInstantRendering
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleInstantRendering=function (isOpen) {
        _ToggleInstantRendering(isOpen);
    };
    /**
     * 抗锯齿 (边缘锐化)
     * @function ZhiUTech_Settings  L_ToggleFXAA
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleFXAA=function (isOpen) {
        _ToggleFXAA(isOpen);
    };
    /**
     * 地面阴影 (阴影质感)
     * @function ZhiUTech_Settings  L_ToggleGroundShadow
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleGroundShadow=function (isOpen) {
        _ToggleGroundShadow(isOpen);
    };
    /**
     * 地面反射 (简单的反射效果)
     * @function ZhiUTech_Settings  L_ToggleGroundReflection
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleGroundReflection=function (isOpen) {
        _ToggleGroundReflection(isOpen);
    };
    /**
     * 阴影 (简单阴影)
     * @function ZhiUTech_Settings  L_ToggleShadow
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleShadow=function (isOpen) {
        _ToggleShadow(isOpen);
    };
    /**
     * 阴影位置设置 (简单阴影)
     * @function ZhiUTech_Settings  L_SetShadowPosition
     */
    mgr.L_SetShadowPosition=function (x,y,z) {
        _SetShadowPosition(x,y,z);
    };
    /**
     * 顺序渲染 (先渲染可见的mesh之后再渲染不可见的,以提高速度)
     * @function ZhiUTech_Settings  L_ToggleSequentialRendering
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleSequentialRendering=function (isOpen) {
        _ToggleSequentialRendering(isOpen);
    };
    // endregion

    // region 特效设置 公共方法
    /**
     * 特效滤镜 (只有开启特效滤镜才可以开启使用其他特效选项)
     * @function ZhiUTech_Settings  L_ToggleSpecialEffectFilter
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleSpecialEffectFilter=function (isOpen) {
        _ToggleSpecialEffectFilter(isOpen);
    };
    /**
     * 颜色保真 (增强真实度)
     * @function ZhiUTech_Settings  L_ToggleColorFidelity_SpecialEffectFilter
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleColorFidelity_SpecialEffectFilter=function (isOpen) {
        _ToggleColorFidelity_SpecialEffectFilter(isOpen);
    };
    /**
     * 材质增强 (颜色鲜明)
     * @function ZhiUTech_Settings  L_ToggleColorEnhancement_SpecialEffectFilter
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleColorEnhancement_SpecialEffectFilter=function (isOpen) {
        _ToggleColorEnhancement_SpecialEffectFilter(isOpen);
    };
    /**
     * 亮度 (整体亮度调整 -1~1 step:0.01)
     * @function ZhiUTech_Settings  L_SetBrightness_SpecialEffectFilter
     * @param {float} value 值
     */
    mgr.L_SetBrightness_SpecialEffectFilter=function (value) {
        _SetBrightness_SpecialEffectFilter(value);
    };
    /**
     * 对比度 (整体对比度调整 -1~1 step:0.01)
     * @function ZhiUTech_Settings  L_SetContrast_SpecialEffectFilter
     * @param {float} value 值
     */
    mgr.L_SetContrast_SpecialEffectFilter=function (value) {
        _SetContrast_SpecialEffectFilter(value);
    };
    /**
     * 灰度 (整体对比度调整 -1~1 step:0.01)
     * @function ZhiUTech_Settings  L_SetGrayscale_SpecialEffectFilter
     * @param {float} value 值
     */
    mgr.L_SetGrayscale_SpecialEffectFilter=function (value) {
        _SetGrayscale_SpecialEffectFilter(value);
    };
    /**
     * 曝光度 (整体曝光度调整 -10~10 step:1)
     * @function ZhiUTech_Settings  L_SetExposure_SpecialEffectFilter
     * @param {float} value 值
     */
    mgr.L_SetExposure_SpecialEffectFilter=function (value) {
        _SetExposure_SpecialEffectFilter(value);
    };
    // endregion

    // region 天空颜色
    /**
     * 天空地面颜色
     * @function ZhiUTech_Settings  L_SetSkyOrGroundColor
     * @param {float} skyR 天空R值 0~255 step:1
     * @param {float} skyG 天空G值 0~255 step:1
     * @param {float} skyB 天空B值 0~255 step:1
     * @param {float} groundR 地面R值 0~255 step:1
     * @param {float} groundG 地面G值 0~255 step:1
     * @param {float} groundB 地面B值 0~255 step:1
     */
    mgr.L_SetSkyOrGroundColor=function (skyR,skyG,skyB,groundR,groundG,groundB) {
        _SetSkyOrGroundColor(skyR,skyG,skyB,groundR,groundG,groundB);
    };
    // endregion

    /**
     * 获取持久化配置
     * @function ZhiUTech_Settings  L_GetConfig
     * @returns {string} 字符串数据
     */
    mgr.L_GetConfig=function () {
        let data=mgr._member;
        let config={};
        config._qualityFirst=data._qualityFirst;
        config._instantRendering=data._instantRendering;
        config._FXAA=data._FXAA;
        config._groundShadow=data._groundShadow;
        config._groundReflection=data._groundReflection;
        config._shadow=data._shadow;
        config._shadowPosition=data._shadowPosition;
        config._sequentialRendering=data._sequentialRendering;

        config._specialEffectFiter=data._specialEffectFiter;
        config._colorFidelity=data._colorFidelity;
        config._colorEnhancement=data._colorEnhancement;
        config._brightness=data._brightness;
        config._contrast=data._contrast;
        config._grayscale=data._grayscale;
        config._exposure=data._exposure;

        config._skyColor=data._skyColor;
        config._groundColor=data._groundColor;

        console.log(" >LJason< 日志：",config);
        return JSON.stringify(config);
    };
    /**
     * 还原效果设置
     * @function ZhiUTech_Settings  L_RestoreConfig
     * @param config {string} 字符串数据
     */
    mgr.L_RestoreConfig=function (config) {
        config=JSON.parse(config);
        _ToggleQualityFirst(config._qualityFirst);
        _ToggleInstantRendering(config._instantRendering);
        _ToggleFXAA( config._instantRendering);
        _ToggleGroundShadow(config._groundShadow);
        _ToggleGroundReflection(config._groundReflection);
        let shadowPos=new THREE.Vector3(parseFloat(config._shadowPosition.x),parseFloat(config._shadowPosition.y),parseFloat(config._shadowPosition.z));
        _SetShadowPosition(shadowPos);
        _ToggleSequentialRendering(config._sequentialRendering);

        _ToggleSpecialEffectFilter(config._specialEffectFiter);
        _ToggleColorFidelity_SpecialEffectFilter(config._colorFidelity);
        _ToggleColorEnhancement_SpecialEffectFilter(config._colorEnhancement);
        _SetBrightness_SpecialEffectFilter(config._brightness);
        _SetContrast_SpecialEffectFilter(config._contrast);
        _SetGrayscale_SpecialEffectFilter(config._grayscale);
        _SetExposure_SpecialEffectFilter(config._exposure);
        _SetSkyOrGroundColor(config._skyColor.r,config._skyColor.g,config._skyColor.b,
            config._groundColor.r,config._groundColor.g,config._groundColor.b);

    };

    mgr.GetMaterial=function (dbid) {

        var fragList = zhiu.viewer.model.getFragmentList();

        var fragIds = [];

        zhiu.viewer.model.getData().instanceTree.enumNodeFragments(
            dbid, (fragId) => {
                fragIds.push(fragId)
            });

        fragIds.forEach((fragId) => {
            //获取材质
            let material = fragList.getMaterial(fragId);
            material.color=new THREE.Color(0.75,1,1);
            material.map=null;
            console.log(" >LJason< 日志：-----",material);
            // material.specular=new THREE.Color(1,1,1);
            // material.ambient=new THREE.Color(1,1,1);
            // material.bumpMap=null;
            // material.envMap=null;
            // material.irradianceMap=null;
            // material.needsUpdate = true;
        });
    };

    zhiu.ZhiUTech_Settings=mgr;

    (function () {
        // region 主div
        let div=document.createElement("div");
        div.style.backgroundColor="#edf0c1";
        div.style.display="grid";
        div.style.gridAutoRows="30px";
        div.style.alignItems="center";
        div.style.position="absolute";
        div.style.left="10px";
        div.style.top="10px";
        div.style.width="300px";
        div.style.height="1200px";
        div.style.zIndex="99";
        if(needSettingsPanel){
            document.body.appendChild(div);
        }
        // endregion

        // region 关闭按键
        let closeBtn=document.createElement("button");
        closeBtn.innerHTML="关闭";
        closeBtn.style.position="absolute";
        closeBtn.style.right="2px";
        closeBtn.style.top="2px";
        closeBtn.onclick=()=>{
            div.style.display="none";
        };
        div.appendChild(closeBtn);
        // endregion

        // region 文字
        let totalText=document.createElement("div");
        totalText.innerHTML="-----设置-----";
        totalText.style.justifySelf="center";
        div.appendChild(totalText);

        totalText=document.createElement("div");
        totalText.innerHTML="---------------------------------";
        div.appendChild(totalText);

        totalText=document.createElement("div");
        totalText.innerHTML="性能设置";
        div.appendChild(totalText);
        // endregion

        // region 性能设置
        div.appendChild(_MakeToggle("质量优先",isCheck=>{
            mgr.L_ToggleQualityFirst(isCheck);
            console.warn(" >LJason< 警告：质量优先",isCheck);
        }));
        div.appendChild(_MakeToggle("即时渲染",isCheck=>{
            mgr.L_ToggleInstantRendering(isCheck);
            console.warn(" >LJason< 警告：即时渲染",isCheck);
        }));
        div.appendChild(_MakeToggle("抗锯齿",isCheck=>{
            mgr.L_ToggleFXAA(isCheck);
            console.warn(" >LJason< 警告：抗锯齿",isCheck);
        }));
        div.appendChild(_MakeToggle("地面阴影",isCheck=>{
            mgr.L_ToggleGroundShadow(isCheck);
            console.warn(" >LJason< 警告：地面阴影",isCheck);
        }));
        div.appendChild(_MakeToggle("地面反射",isCheck=>{
            mgr.L_ToggleGroundReflection(isCheck);
            console.warn(" >LJason< 警告：地面反射",isCheck);
        }));
        div.appendChild(_MakeToggle("阴影",isCheck=>{
            mgr.L_ToggleShadow(isCheck);
            console.warn(" >LJason< 警告：阴影",isCheck);
        }));
        div.appendChild(_MakeSlider("阴影-X",1,-100,100,value=>{
            mgr.L_SetShadowPosition(value,undefined,undefined);
        }));
        div.appendChild(_MakeSlider("阴影-Y",1,-100,100,value=>{
            mgr.L_SetShadowPosition(undefined,value,undefined);
        }));
        div.appendChild(_MakeSlider("阴影-Z",1,-100,100,value=>{
            mgr.L_SetShadowPosition(undefined,undefined,value);
        }));
        div.appendChild(_MakeToggle("顺序渲染",isCheck=>{
            mgr.L_ToggleSequentialRendering(isCheck);
            console.warn(" >LJason< 警告：顺序渲染",isCheck);
        }));
        // endregion

        // region 文字
        totalText=document.createElement("div");
        totalText.innerHTML="---------------------------------";
        div.appendChild(totalText);

        totalText=document.createElement("div");
        totalText.innerHTML="特效设置";
        div.appendChild(totalText);
        // endregion

        // region 特效设置
        div.appendChild(_MakeToggle("特效滤镜",isCheck=>{
            mgr.L_ToggleSpecialEffectFilter(isCheck);
        }));
        div.appendChild(_MakeToggle("颜色保真",isCheck=>{
            mgr.L_ToggleColorFidelity_SpecialEffectFilter(isCheck);
        }));
        div.appendChild(_MakeToggle("材质增强",isCheck=>{
            mgr.L_ToggleColorEnhancement_SpecialEffectFilter(isCheck);
        }));
        div.appendChild(_MakeSlider("亮度",0.01,-1,1,value=>{
            mgr.L_SetBrightness_SpecialEffectFilter(parseFloat(value));
        }));
        div.appendChild(_MakeSlider("对比度",0.01,-1,1,value=>{
            mgr.L_SetContrast_SpecialEffectFilter(parseFloat(value));
        }));
        div.appendChild(_MakeSlider("灰度",0.1,-1,1,value=>{
            mgr.L_SetGrayscale_SpecialEffectFilter(parseFloat(value));
        }));
        div.appendChild(_MakeSlider("曝光度",0.1,-10,10,value=>{
            mgr.L_SetExposure_SpecialEffectFilter(parseFloat(value));
        }));
        // endregion

        // region 文字
        totalText=document.createElement("div");
        totalText.innerHTML="---------------------------------";
        div.appendChild(totalText);

        totalText=document.createElement("div");
        totalText.innerHTML="环境设置";
        div.appendChild(totalText);
        // endregion

        // region 环境设置
        div.appendChild(_MakeExampleColor("天空颜色","_skyColor_Example"));
        div.appendChild(_MakeColorSlider("天空颜色-红",value=>{
            mgr.L_SetSkyOrGroundColor(parseFloat(value),undefined,undefined,
                undefined,undefined,undefined);
            _ChangeExampleColor("_skyColor_Example",_member._skyColor);
        }));
        div.appendChild(_MakeColorSlider("天空颜色-绿",value=>{
            mgr.L_SetSkyOrGroundColor(undefined,parseFloat(value),undefined,
                undefined,undefined,undefined);
            _ChangeExampleColor("_skyColor_Example",_member._skyColor);
        }));
        div.appendChild(_MakeColorSlider("天空颜色-蓝",value=>{
            mgr.L_SetSkyOrGroundColor(undefined,undefined,parseFloat(value),
                undefined,undefined,undefined);
            _ChangeExampleColor("_skyColor_Example",_member._skyColor);
        }));
        div.appendChild(_MakeExampleColor("地板颜色","_groundColor_Example"));
        div.appendChild(_MakeColorSlider("地板颜色-红",value=>{
            mgr.L_SetSkyOrGroundColor(undefined,undefined,undefined,
                parseFloat(value),undefined,undefined);
            _ChangeExampleColor("_groundColor_Example",_member._groundColor);
        }));
        div.appendChild(_MakeColorSlider("地板颜色-绿",value=>{
            mgr.L_SetSkyOrGroundColor(undefined,undefined,undefined,
                undefined,parseFloat(value),undefined);
            _ChangeExampleColor("_groundColor_Example",_member._groundColor);
        }));
        div.appendChild(_MakeColorSlider("地板颜色-蓝",value=>{
            mgr.L_SetSkyOrGroundColor(undefined,undefined,undefined,
                undefined,undefined,parseFloat(value));
            _ChangeExampleColor("_groundColor_Example",_member._groundColor);
        }));
        // endregion

        totalText=document.createElement("div");
        totalText.innerHTML="------------描边特效------------";
        totalText.style.justifySelf="center";
        div.appendChild(totalText);

        div.appendChild(_MakeToggle("描边",isCheck=>{
            ZhiUTech_MsgCenter.L_SendMsg("描边开关",isCheck);
        }));


        mgr._member._container=div;

        function _ChangeExampleColor(id,color) {
            $("#"+id).css("background-color","rgb("+color.r+","+color.g+","+color.b+")");
        }

        function _MakeToggle(content,action){
            let div=document.createElement("div");
            div.style.display="grid";
            div.style.gridTemplateColumns="1fr 0.1fr";
            div.style.alignItems="center";

            let text=document.createElement("div");
            text.innerHTML=content;
            div.appendChild(text);
            let checkBox=document.createElement("input");
            checkBox.type="checkbox";
            checkBox.style.justifySelf="center";
            checkBox.style.display="unset";
            checkBox.onclick=function () {
                action(checkBox.checked);
            };
            div.appendChild(checkBox);
            return div;
        }

        function _MakeSlider(content,step,min,max,action){
            let div=document.createElement("div");
            div.style.display="grid";
            div.style.gridTemplateColumns="1fr 1fr 0.5fr";
            div.style.alignItems="center";

            let text=document.createElement("div");
            text.innerHTML=content;
            div.appendChild(text);
            let range=document.createElement("input");
            range.type="range";
            range.step=step;
            range.min=min;
            range.max=max;
            range.value=0;
            range.oninput=function (arg) {
                action(arg.target.value);
                nowValue.innerHTML=arg.target.value;
            };
            div.appendChild(range);

            let nowValue=document.createElement("div");
            nowValue.innerHTML=range.value;
            nowValue.style.justifySelf="center";
            div.appendChild(nowValue);

            return div;
        }
        
        function _MakeExampleColor(content,id) {
            let div=document.createElement("div");
            div.style.display="grid";
            div.style.gridTemplateColumns="1fr 1fr";
            div.style.alignItems="center";

            let text=document.createElement("div");
            text.innerHTML=content;
            div.appendChild(text);

            let color=document.createElement("div");
            color.id=id;
            color.style.justifySelf="center";
            color.style.height="20px";
            color.style.width="60px";
            color.style.backgroundColor="#ffffff";
            div.appendChild(color);
            return div;
        }

        function _MakeColorSlider(content,action) {
            let div=document.createElement("div");
            div.style.display="grid";
            div.style.gridTemplateColumns="1fr 1fr 0.5fr";
            div.style.alignItems="center";

            let text=document.createElement("div");
            text.innerHTML=content;
            div.appendChild(text);
            let range=document.createElement("input");
            range.type="range";
            range.step=1;
            range.min=0;
            range.max=255;
            range.value=0;
            range.oninput=function (arg) {
                action(arg.target.value);
                nowValue.innerHTML=arg.target.value;
            };
            div.appendChild(range);

            let nowValue=document.createElement("div");
            nowValue.innerHTML=range.value;
            nowValue.style.justifySelf="center";
            div.appendChild(nowValue);

            return div;
        }

        // 不好用
        function _MakeColorPalette(content,action) {
            let div=document.createElement("div");
            div.style.display="grid";
            div.style.gridTemplateColumns="1fr 1fr";
            div.style.alignItems="center";

            let text=document.createElement("div");
            text.innerHTML=content;
            div.appendChild(text);
            let palette=document.createElement("input");
            palette.type="color";
            palette.style.justifySelf="center";
            palette.oninput=function () {
                console.warn(" >LJason< 警告：哇你看看颜色啊",palette.value);
            };
            div.appendChild(palette);
            return div;
        }
        
    })();


}



































