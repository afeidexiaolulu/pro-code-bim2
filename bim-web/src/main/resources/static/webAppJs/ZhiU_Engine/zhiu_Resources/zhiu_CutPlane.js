/**
 *  创建人 : LJason
 *  功能说明 : 剪切板,方便使用
 */
// region 工区样板
let workAreaData={};
workAreaData.FirstPos=new THREE.Vector3(126,-11,16);
workAreaData.SecondPos=new THREE.Vector3(-63,98,-6);
workAreaData.BoxColor="#33ff10";
workAreaData.IsBoxEnable=true;
workAreaData.AreaName="工区的名称";
workAreaData.AreaManager="管理人员名称";
workAreaData.AreaLabor="人力值";
workAreaData.AreaMachine="机械值";
workAreaData.AreaMaterial="材料值";
workAreaData.AreaProductivity="总产值";
workAreaData.workAreaBoxWidth=150;
workAreaData.workAreaBoxTop=150;
workAreaData.workAreaBoxBottom=-100;
workAreaData.workAreaOffset=50;
lj=zhiu.ZhiUTech_ThreeJsMaker.L_MakeWorkArea(workAreaData);
// endregion

// region jsdoc
// jsdoc --readme README.md --configure conf.json -d ZhiU_Engine/zhiu_API/
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js" ></script>
// <script src="../public_Core/jquery.min.js"></script>
// endregion


// region ztree使用
function _IsParent() {
    if(zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObj.getSelectedNodes()[0].isParent)
        console.log(" >LJason< 日志：是的");
    else
        console.log(" >LJason< 日志：当然不是啦");
}

let _allNodes=zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObj.transformToArray(zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObj.getNodes());

let _needNodes=zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObjNormal.getNodesByFilter(
    arg=>{
        return arg._customPropertyName!==undefined&&arg._customPropertyName.indexOf("KTJ02")===-1;
    });
let __needNodes=zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObjNormal.getNodesByFilter(
    arg=>{
        return arg._externalId!==undefined;
    });

zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObjNormal.getNodesByParamFuzzy("_externalId","");

function _RecursionTreeNode(node,list){
    if(node.isParent){
        let isLast=false;
        for (let i = 0; i < node.children.length; i++) {
            if(!node.children[i].isParent){
                // 找到儿子了
                isLast=true;
                break;
            }
        }
        if(isLast){
            for (let i = 0; i < node.children.length; i++) {
                if(!node.children[i].isHidden){
                    return;
                }
            }
            list.push(node);
        }else{
            _RecursionTreeNode(node,list);
        }

        if(!node.isHidden){
            // 找到没有隐藏的点了
        }
    }
}
function _GetParentNodeWithParameter() {
   return  zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObjNormal.getNodesByFilter(
        arg=>{
            return !arg.isHidden&&arg.isParent;
        });
}

// endregion



result=zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObj.getNodesByFilter(
    arg=>{
        return arg._customPropertyName!==undefined&&arg._customPropertyName.indexOf("KTJ02")===-1;
    });
zhiu_Viewer.ZhiUTech_NewTree._member.zTreeObj.hideNodes(result);



zhiu_Viewer.viewer.getExtension('ZhiUTech.Measure').getMeasurement()// 获取当前测量的数据
zhiu_Viewer.viewer.getExtension('ZhiUTech.Measure').measureTool.deselectAllMeasurements()// 关闭所有选中

zhiu_Viewer.viewer.getExtension('ZhiUTech.Measure').measureTool.clearCurrentMeasurement()// 删除当前选中的测量


zhiu_Viewer.viewer.getExtension('ZhiUTech.Measure').measureTool.deleteCurrentPick()// 删除当前拾取点





try{
    if(zhiu_Viewer.viewer.getExtension('ZhiUTech.Measure').getMeasurement()){
        console.log(" >LJason< 日志：youdpongixisjdifkjasidjfi");
    }
}catch{}



_CloseAllSecondMenu();









































