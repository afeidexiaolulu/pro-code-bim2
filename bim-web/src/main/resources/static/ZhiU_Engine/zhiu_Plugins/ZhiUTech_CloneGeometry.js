/**
 *  创建人 : LJason
 *  功能说明 : 克隆几何
 */

// region THREE.EdgesGeometry 拓展
(()=>{
    function EdgesGeometry( geometry, thresholdAngle ) {

        THREE.BufferGeometry.call( this );

        this.type = 'EdgesGeometry';

        this.parameters = {
            thresholdAngle: thresholdAngle
        };

        thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;

        // buffer

        let vertices = [];

        // helper letiables

        let thresholdDot = Math.cos( (Math.PI / 180) * thresholdAngle );
        let edge = [ 0, 0 ], edges = {}, edge1, edge2;
        let key, keys = [ 'a', 'b', 'c' ];

        // prepare source geometry

        let geometry2;

        if ( geometry.isBufferGeometry ) {

            geometry2 = new THREE.Geometry();
            geometry2.fromBufferGeometry( geometry );

        } else {

            geometry2 = geometry.clone();

        }

        geometry2.mergeVertices();
        geometry2.computeFaceNormals();

        let sourceVertices = geometry2.vertices;
        let faces = geometry2.faces;

        // now create a data structure where each entry represents an edge with its adjoining faces

        for ( let i = 0, l = faces.length; i < l; i ++ ) {

            let face = faces[ i ];

            for ( let j = 0; j < 3; j ++ ) {

                edge1 = face[ keys[ j ] ];
                edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
                edge[ 0 ] = Math.min( edge1, edge2 );
                edge[ 1 ] = Math.max( edge1, edge2 );

                key = edge[ 0 ] + ',' + edge[ 1 ];

                if ( edges[ key ] === undefined ) {

                    edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ], face1: i, face2: undefined };

                } else {

                    edges[ key ].face2 = i;

                }

            }

        }

        // generate vertices

        for ( key in edges ) {

            let e = edges[ key ];

            // an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.

            if ( e.face2 === undefined || faces[ e.face1 ].normal.dot( faces[ e.face2 ].normal ) <= thresholdDot ) {

                let vertex = sourceVertices[ e.index1 ];
                vertices.push( vertex.x, vertex.y, vertex.z );

                vertex = sourceVertices[ e.index2 ];
                vertices.push( vertex.x, vertex.y, vertex.z );

            }

        }

        // build geometry

        this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

    }

    EdgesGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
    EdgesGeometry.prototype.constructor = EdgesGeometry;

    THREE.EdgesGeometry=EdgesGeometry;

    function Float32BufferAttribute( array, itemSize, normalized ) {

        BufferAttribute.call( this, new Float32Array( array ), itemSize, normalized );

    }

    Float32BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
    Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;

    function BufferAttribute( array, itemSize, normalized ) {

        if ( Array.isArray( array ) ) {

            throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

        }

        this.uuid = THREE.Math.generateUUID();
        this.name = '';

        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;

        this.dynamic = false;
        this.updateRange = { offset: 0, count: - 1 };

        this.onUploadCallback = function () {};

        this.version = 0;

    }

})();
// endregion

// region CloneGeometry
function Initialize_ZhiUTech_CloneGeometry(zhiu){
    let mgr={};
    let member={};
    member._scene={};
    member._sceneName="ZhiuViewer_CloneGeometry";
    member._meshCoverList={};
    member._material=undefined;
    member._isComplete=false;
    member._stoke=undefined;

    (()=>{
        zhiu.viewer.impl.createOverlayScene(member._sceneName);
        member._scene=zhiu.viewer.impl.overlayScenes[member._sceneName];
        member._stoke=new THREE.Group();
        member._stoke.name="ZhiuViewer_CloneGeometry";
        zhiu.viewer.impl.addOverlay(member._sceneName,member._stoke);
        ZhiUTech_MsgCenter.L_AddListener("描边开关", function (arg) {
            if(arg){
                if(member._isComplete){
                    member._stoke.visible=true;
                }else{
                    let models=zhiu.viewer.impl.modelQueue().getModels();
                    for (let i = 0; i < models.length; i++) {
                        mgr.L_CreateAllStroke(models[i]);
                    }
                    member._isComplete=true;
                }
            }else{
                if(member._isComplete){
                    member._stoke.visible=false;
                }
            }
            mgr.zhiu_Refresh();
        });

    })();

    // region 创建同样模型
    mgr.zhiu_GetLeafFragIds=function(model, leafId){
        const instanceTree = model.getData().instanceTree;
        const fragIds = [];

        instanceTree.enumNodeFragments(leafId, function (fragId) {
            fragIds.push(fragId);
        });

        return fragIds;
    };

    mgr.zhiu_GetModifiedWorldBoundingBox=function(fragIds, fragList){
        const fragbBox = new THREE.Box3();
        const nodebBox = new THREE.Box3();

        fragIds.forEach(function (fragId) {
            fragList.getWorldBounds(fragId, fragbBox);

            nodebBox.union(fragbBox);
        });


        return nodebBox;
    };

    mgr.zhiu_GetComponentBoundingBox=function(model, dbId){
        const fragIds = mgr.zhiu_GetLeafFragIds(model, dbId);
        const fragList = model.getFragmentList();

        return mgr.zhiu_GetModifiedWorldBoundingBox(fragIds, fragList);
    };

    mgr.zhiu_GetMeshGeometry=function(data, vertexArray){
        const offsets = [{
            count: data.indices.length,
            index: 0,
            start: 0
        }];

        for (let oi = 0, ol = offsets.length; oi < ol; ++oi) {

            let start = offsets[oi].start;
            let count = offsets[oi].count;
            let index = offsets[oi].index;

            for (let i = start, il = start + count; i < il; i += 3) {

                const a = index + data.indices[i];
                const b = index + data.indices[i + 1];
                const c = index + data.indices[i + 2];

                const vA = new THREE.Vector3();
                const vB = new THREE.Vector3();
                const vC = new THREE.Vector3();

                vA.fromArray(data.positions, a * data.stride);
                vB.fromArray(data.positions, b * data.stride);
                vC.fromArray(data.positions, c * data.stride);

                vertexArray.push(vA);
                vertexArray.push(vB);
                vertexArray.push(vC);
            }
        }
    };

    mgr.zhiu_BuildComponentMesh=function(model,dbId){
        let geometry = mgr.zhiu_GetComponentGeometry(model,dbId);

        const boundingBox = mgr.zhiu_GetComponentBoundingBox(model,dbId);
        //let matrixWorld = geometry.matrixWorld;
        const nbMeshes = geometry.meshes.length;

        const vertexArray = [];

        for (let idx = 0; idx < nbMeshes; ++idx) {
            const mesh = geometry.meshes[idx];

            const meshData = {
                positions: mesh.positions,
                indices: mesh.indices,
                stride: mesh.stride
            };

            mgr.zhiu_GetMeshGeometry(meshData, vertexArray);
        }

        geometry = new THREE.Geometry();

        for (let i = 0; i < vertexArray.length; i += 3) {
            // console.log(" >LJason< 日志：计数系列");
            geometry.vertices.push(vertexArray[i]);
            geometry.vertices.push(vertexArray[i + 1]);
            geometry.vertices.push(vertexArray[i + 2]);

            const face = new THREE.Face3(i, i + 1, i + 2);

            geometry.faces.push(face);
        }



        const mesh = new THREE.Mesh(geometry);

        // region  旧的矩阵转换
        // let matrixWorld = new THREE.Matrix4();
        //
        // matrixWorld.fromArray( matrixWorld );
        //
        // mesh.applyMatrix( matrixWorld );
        // endregion

        // region ljason修改矩阵转换
        let renderProxy;
        let matrix;
        model.getData().instanceTree.enumNodeFragments(dbId, function (fragId) {
            renderProxy = zhiu.viewer.impl.getRenderProxy(
                model,
                fragId);
            matrix = renderProxy.matrixWorld;

            mesh.applyMatrix(matrix);// 修改矩阵转换
        });


        // endregion

        mesh.boundingBox = boundingBox;

        mesh.dbId = dbId;

        return mesh;
    };

    mgr.zhiu_GetAllVertexs=function(model,dbId){
        let geometry = mgr.zhiu_GetComponentGeometry(model,dbId);

        const nbMeshes = geometry.meshes.length;

        const vertexArray = [];

        for (let idx = 0; idx < nbMeshes; ++idx) {
            const mesh = geometry.meshes[idx];

            const meshData = {
                positions: mesh.positions,
                indices: mesh.indices,
                stride: mesh.stride
            };

            mgr.zhiu_GetMeshGeometry(meshData, vertexArray);
        }

        let list=[];

        for (let i = 0; i < vertexArray.length; i ++) {
            list.push(vertexArray[i]);
        }
        console.log(" >LJason< 日志：",list);
        return list;
    };

    // 获取组件中所有片段的几何图形  应该是所有顶点。。。
    mgr.zhiu_GetComponentGeometry=function(model,dbId){
        const fragIds = mgr.zhiu_GetLeafFragIds(model, dbId);

        let matrixWorld = null;

        const meshes = fragIds.map(function (fragId) {

            const renderProxy = zhiu.viewer.impl.getRenderProxy(model, fragId);

            const geometry = renderProxy.geometry;// 几何体
            const attributes = geometry.attributes;// 属性
            const positions = geometry.vb ? geometry.vb : attributes.position.array;// 位置

            const indices = attributes.index.array || geometry.ib;// 指数？
            const stride = geometry.vb ? geometry.vbstride : 3;// 步长？
            const offsets = geometry.offsets;// 偏移量？

            matrixWorld = matrixWorld || renderProxy.matrixWorld.elements;

            return {
                positions,
                indices,
                offsets,
                stride
            };
        });


        return {
            matrixWorld,
            meshes
        };
    };
    // endregion

    // region 常用

    mgr.zhiu_GetMaterial= function () {
        if (member._material) {
            return member._material;
        } else {
            member._material = new THREE.MeshBasicMaterial({
                color: 0xffff00
            });
            return member._material;
        }
    };
    // 根据id绘制同样的模型
    mgr.zhiu_CreateMeshCover= function (model,dbId) {
        let mesh = mgr.zhiu_GetMeshCover(model,dbId);

        zhiu.viewer.impl.scene.add(mesh);
        mgr.zhiu_Refresh();
    };

    // 获取同样的模型网格
    mgr.zhiu_GetMeshCover= function (model,dbId) {
        let mesh = mgr.zhiu_BuildComponentMesh( model,dbId);
        mesh.name = dbId;
        return mesh;
    };

    // 根据id绘制包围盒
    mgr.zhiu_CreateBBox= function (model,dbId) {
        var tree = model.getData().instanceTree;
        var tmpBox = new Float32Array(6);
        tree.getNodeBox(dbId, tmpBox);

        var min = new THREE.Vector3(tmpBox[0], tmpBox[1], tmpBox[2]);
        var max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);

        zhiu.viewer.impl.scene.add(mgr.zhiu_GetBox(min, max));
        mgr.zhiu_Refresh();
    };

    // 创建指定大小盒子
    mgr.zhiu_GetBox= function (min, max) {

        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });

        let geometry = new THREE.Geometry();

        // 顶点组合
        let vertices = [
            new THREE.Vector3(min.x, max.y, max.z),
            new THREE.Vector3(max.x, max.y, max.z),
            new THREE.Vector3(min.x, max.y, min.z),
            new THREE.Vector3(max.x, max.y, min.z),

            new THREE.Vector3(min.x, min.y, max.z),
            new THREE.Vector3(max.x, min.y, max.z),
            new THREE.Vector3(min.x, min.y, min.z),
            new THREE.Vector3(max.x, min.y, min.z)
        ];
        // 连线组合
        let faces = [
            new THREE.Face3(2, 0, 1),
            new THREE.Face3(2, 1, 3),

            new THREE.Face3(6, 7, 5),
            new THREE.Face3(6, 5, 4),

            new THREE.Face3(6, 2, 3),
            new THREE.Face3(6, 3, 7),

            new THREE.Face3(5, 1, 0),
            new THREE.Face3(5, 0, 4),

            new THREE.Face3(7, 3, 1),
            new THREE.Face3(7, 1, 5),

            new THREE.Face3(4, 0, 2),
            new THREE.Face3(4, 2, 6)
        ];

        geometry.vertices = vertices;
        geometry.faces = faces;

        let bBox = new THREE.Mesh(geometry, material);


        return bBox;
    };

    // 创建百分比包围盒
    // direction： x y z 字符用来控制方向 x：左右 y：前后 z：上下
    // progress：0-1小数用于表示完成进度
    // isBack：是否反转方向
    mgr.zhiu_CreateBoxWithProgress= function (model,dbId, direction, progress, isBack) {
        zhiu.viewer.impl.scene.add(mgr.zhiu_GetBoxWithProgress( model,dbId, direction, progress, isBack));
        mgr.zhiu_Refresh();
    };

    // 创建百分比包围盒
    // direction： x y z 字符用来控制方向 x：左右 y：前后 z：上下
    // progress：0-1小数用于表示完成进度
    // isBack：是否反转方向
    mgr.zhiu_GetBoxWithProgress= function (model,dbId, direction, progress, isBack) {
        let tree = model.getData().instanceTree;
        let tmpBox = new Float32Array(6);
        tree.getNodeBox(dbId, tmpBox);
        let min = new THREE.Vector3(tmpBox[0], tmpBox[1], tmpBox[2]);
        let max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);
        progress = 1 - progress;
        switch (direction) {
            case 'x' :
                if (isBack)
                    max.x = (min.x - max.x) * progress + max.x;
                else
                    min.x = (max.x - min.x) * progress + min.x;
                break;
            case 'y':
                if (isBack)
                    max.y = (min.y - max.y) * progress + max.y;
                else
                    min.y = (max.y - min.y) * progress + min.y;
                break;
            case 'z':
                if (isBack)
                    max.z = (min.z - max.z) * progress + max.z;
                else
                    min.z = (max.z - min.z) * progress + min.z;
                break;
        }
        return mgr.zhiu_GetBox(min, max);
    };

    // 删除物体
    // name：物体名称
    mgr.zhiu_DeleteGameObjectWithName= function (name) {
        let children = zhiu.viewer.impl.scene.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i] instanceof THREE.Mesh) {
                if (children[i].name === name) {
                    zhiu.viewer.impl.scene.remove(children[i]);
                    mgr.zhiu_ForceRefresh();
                    return;
                }
            }
        }
        console.error(" >LJason< 错误：未找到该模型：", name);
    };

    // 删除所有物体
    mgr.zhiu_DeleteAllGameObject= function () {
        let children = zhiu.viewer.impl.scene.children;
        for (let i = 0; i < children.length;) {
            if (children[i] instanceof THREE.Mesh) {
                zhiu.viewer.impl.scene.remove(children[i]);
                i = 0;
            } else {
                i++;
            }
        }
        mgr.zhiu_ForceRefresh();
    };

    // 刷新场景
    mgr.zhiu_Refresh= function () {
        zhiu.viewer.impl.invalidate(false, true, true);
    };

    // 强制刷新场景
    mgr.zhiu_ForceRefresh= function () {
        if (zhiu.viewer.autocam.camera.isPerspective) {
            zhiu.viewer.autocam.resetOrientation();
            zhiu.viewer.autocam.toPerspective();
        } else {
            zhiu.viewer.autocam.resetOrientation();
            zhiu.viewer.autocam.toOrthographic();
        }
    };

    // 创建线 测试使用
    mgr.zhiu_TestCreateLine= function () {
        let geometry = new THREE.Geometry();

        geometry.vertices.push(new THREE.Vector3(-100, 0, 0));

        geometry.vertices.push(new THREE.Vector3(0, 100, 0));

        geometry.vertices.push(new THREE.Vector3(100, 0, 0));

        let _lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 10
        });
        //使用Line方法将线初始化

        let line = new THREE.Line(geometry, _lineMaterial);

        zhiu.viewer.impl.scene.add(line);
        mgr.zhiu_Refresh();
    };

    // 获取切割模型
    mgr.zhiu_GetCutMesh= function (model,dbId, direction, progress, isBack) {
        // 相同模型的mesh
        let coverMesh = mgr.zhiu_GetMeshCover(model,dbId);

        // 用于裁剪的mesh
        let cutMesh = mgr.zhiu_GetBoxWithProgress(model,dbId, direction, progress, isBack);

        console.time("生成BSP原始模型");
        let coverBSP = new ThreeBSP(coverMesh);
        let cutBSP = new ThreeBSP(cutMesh);
        console.timeEnd("生成BSP原始模型");
        console.time("BSP切割");
        let resultBSP = coverBSP.subtract(cutBSP);
        console.timeEnd("BSP切割");
        console.time("BSP转换Mesh");
        let resultMesh = resultBSP.toMesh();
        console.timeEnd("BSP转换Mesh");

        console.time("---BSP运算法线");
        resultMesh.geometry.computeFaceNormals();
        resultMesh.geometry.computeVertexNormals();
        console.timeEnd("---BSP运算法线");
        resultMesh.material = mgr.zhiu_GetMaterial();


        return resultMesh;
    };
    // endregion

    // region 内部
    function _CreataStroke(model,dbId){
        let mesh=mgr.zhiu_GetMeshCover(model,dbId);
        console.warn(" >LJason< 警告：",mesh.geometry.vertices.length);
        let edge=new THREE.EdgesGeometry(mesh.geometry,1);
        var linesMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 2
        });
        let edgeGeometry=new THREE.Geometry();
        let array=edge.attributes.position.array;
        for (let i = 0; i < array.length; i+=3) {
            edgeGeometry.vertices.push(new THREE.Vector3(array[i],array[i+1],array[i+2]));
        }
        let line = new THREE.Line( edgeGeometry, linesMaterial,THREE.LinePieces );
        line.applyMatrix(mesh.matrix);
        member._stoke.add(line);
    }
    function _RecursionGetChild(data,id, list) {
        let length = data.getNumChildren(id);
        if (length < 1) {
            if (list.indexOf(id) === -1) {
                list.push(id);
            }
            return;
        }
        data.findNodeChild(id, function (id) {
            _RecursionGetChild(data,id, list);
        });
    }
    function _GetAllChildIdList(model) {
        let list = [];
        let data=model.getData().instanceTree.nodeAccess;
        _RecursionGetChild(data,model.getRootId(), list);
        return list;
    }
    // endregion

    mgr.L_CreateAllStroke=function (model) {
        let list=_GetAllChildIdList(model);
        for (let i = 0; i < list.length; i++) {
            _CreataStroke(model,list[i]);
        }
    };
    mgr.L_CreateStroke=function (model,id) {
        _CreataStroke(model,id);
    };
    mgr._GetAllChildIdList=_GetAllChildIdList;
    mgr._member=member;
    zhiu.CloneGeometry=mgr;
}
// endregion

// region 替换使用
// endregion



































