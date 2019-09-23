
/**
 *  创建人 : LJason
 *  功能说明 : 通知中心 及log管理器
 *  @function Initialize_ZhiUTech_MsgCenter
 *  @return {object} 通知中心句柄
 */
var ZhiUTech_MsgCenter={};
ZhiUTech_MsgCenter._isOpenLog=true;
_Reset_ZhiUTech_MsgCenter();
function _Reset_ZhiUTech_MsgCenter(){
    ZhiUTech_MsgCenter.LogMgr=LogManager();
    /**
     * 添加监听
     * @function L_AddListener
     * @param {string} eventName 消息名
     * @param {function} action 委托
     */
    ZhiUTech_MsgCenter.L_AddListener=function (eventName, action) {
        if(!ZhiUTech_MsgCenter[eventName]){
            ZhiUTech_MsgCenter[eventName]=[];
        }
        ZhiUTech_MsgCenter[eventName].push(action);
        ZhiUTech_MsgCenter.L_SendMsg("日志",eventName+" 事件添加成功");
    };
    /**
     * 删除监听
     * @function L_RemoveListener
     * @param {string} eventName 消息名
     * @param {function} action 委托
     */
    ZhiUTech_MsgCenter.L_RemoveListener=function (eventName, action) {
        if(ZhiUTech_MsgCenter[eventName]){
            if(ZhiUTech_MsgCenter[eventName].includes(action)){
                let index= ZhiUTech_MsgCenter[eventName].indexOf(action);
                ZhiUTech_MsgCenter[eventName].splice(index,1);
                ZhiUTech_MsgCenter.L_SendMsg("日志","删除事件成功？？？");
            }
        }
    };
    /**
     * 根据消息名删除所有监听
     * @function L_ClearEventWithName
     * @param {string} eventName 消息名
     */
    ZhiUTech_MsgCenter.L_ClearEventWithName=function (eventName) {
        if(ZhiUTech_MsgCenter[eventName]){
            ZhiUTech_MsgCenter[eventName]=null;
            ZhiUTech_MsgCenter.L_SendMsg("日志",[eventName," 事件全部清空"]);
        }
    };
    /**
     * 发送消息
     * @function L_SendMsg
     * @param {string} eventName 消息名称
     * @param {*} [argsList] 参数列表
     */
    ZhiUTech_MsgCenter.L_SendMsg=function (eventName, argsList) {
        if(ZhiUTech_MsgCenter[eventName]){
            let list=ZhiUTech_MsgCenter[eventName];
            for (let i = 0; i < list.length; i++){
                if(argsList!==undefined){
                    list[i](argsList);
                }else{
                    list[i]();
                }
            }
        }else{
            ZhiUTech_MsgCenter.L_SendMsg("警告",eventName+" 该事件未被监听");
        }
    };
    /**
     * 清空所有
     * @function L_ClearAll
     */
    ZhiUTech_MsgCenter.L_ClearAllAndReset=function (isOpenLog=true) {
        ZhiUTech_MsgCenter={};
        ZhiUTech_MsgCenter._isOpenLog=isOpenLog;
        _Reset_ZhiUTech_MsgCenter();
    };

    function LogManager() {
        let mgr={};
        mgr._Log=function (msg) {
            if(!ZhiUTech_MsgCenter._isOpenLog) return;
            if(Array.isArray(msg)){
                for (let i = 0; i < msg.length; i++) {
                    console.log(" >LJason< 日志："+"第"+(i+1)+"条信息 : ",msg[i]);
                }
            }else{
                console.log(" >LJason< 日志：",msg);
            }
        };
        mgr._Warning=function (msg) {
            if(!ZhiUTech_MsgCenter._isOpenLog) return;
            if(Array.isArray(msg)){
                for (let i = 0; i < msg.length; i++) {
                    console.warn(" >LJason< 警告："+"第"+(i+1)+"条信息 : ",msg[i]);
                }
            }else{
                console.warn(" >LJason< 警告：",msg);
            }
        };
        mgr._Error=function (msg) {
            if(!ZhiUTech_MsgCenter._isOpenLog) return;
            if(Array.isArray(msg)){
                for (let i = 0; i < msg.length; i++) {
                    console.error(" >LJason< 错误："+"第"+(i+1)+"条信息 : ",msg[i]);
                }
            }else{
                console.error(" >LJason< 错误：",msg);
            }
        };
        return mgr;
    }

    function _MsgCenter_ToggleLog(isOpenLog){
        ZhiUTech_MsgCenter._isOpenLog=isOpenLog;
    }

    // region 通知中心 Listener 内部
    ZhiUTech_MsgCenter.L_AddListener("日志",ZhiUTech_MsgCenter.LogMgr._Log);
    ZhiUTech_MsgCenter.L_AddListener("警告",ZhiUTech_MsgCenter.LogMgr._Warning);
    ZhiUTech_MsgCenter.L_AddListener("错误",ZhiUTech_MsgCenter.LogMgr._Error);
    ZhiUTech_MsgCenter.L_AddListener("开关LOG",_MsgCenter_ToggleLog);
    // endregion
}

















































