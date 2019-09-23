/**
 *  创建人 : LJason
 *  功能说明 : 框选功能
 *  2018.9.19 关闭所有回调
 */


/**
 * 初始化框选模块
 * @function Initialize_ZhiUTech_BoxSelection
 * @param {object} zhiu 核心成员
 */
function Initialize_ZhiUTech_BoxSelection(zhiu) {

    zhiu.ZhiUTech_BoxSelection=new _BoxSelection_Controller(zhiu);
    zhiu.ZhiUTech_BoxSelection._cursor=zhiu.viewer.canvas.style.cursor;

    // region 通知中心
    ZhiUTech_MsgCenter.L_AddListener("打开框选",_MsgCenter_StartBoxSelection);

    /**
     * 通知中心: 打开框选
     * @param {function} callback 框选结束后的回调
     * @private
     */
    function _MsgCenter_StartBoxSelection(callback) {
        zhiu.viewer.canvas.style.cursor="crosshair";
        zhiu.ZhiUTech_BoxSelection.L_StartSelection(function () {
            if(callback) callback();
            zhiu.viewer.canvas.style.cursor=zhiu.ZhiUTech_BoxSelection._cursor;
        });
    }
    // endregion
}

class _BoxSelection_Controller {

    constructor(mgr) {
        let instance=this;
        this.tool = new _BoxSelection_WindowTool(mgr.viewer);
        this.viewer = mgr.viewer;
        this.isBoxSelection = false;
        this.callback=undefined;

        this.viewer.canvas.addEventListener("mousedown",function(event){
            instance._startDrag(event);
        });
        this.viewer.canvas.addEventListener("mouseup",function(){
            instance._endDrag();
        });
        this.viewer.canvas.addEventListener("mousemove",function(event){
            instance._update(event);
        });
    }

    L_StartSelection(callback) {
        this.callback=callback;
        this.isBoxSelection = true;
    }

    _startDrag(event) {
        if (this.isBoxSelection) {
            this.viewer.setNavigationLock(true);
            this.tool.activate();
            this.tool.startDrag(event);

        }
    }

    _update(event) {
        if (this.isBoxSelection) {
            this.tool.handleMouseMove(event);
            this.tool.update();
        }
    }

    _endDrag(event){
        if (this.isBoxSelection) {
            this.viewer.setNavigationLock(false);
            // this.viewer.autocam.resetOrientation();
            this.viewer.impl.invalidate(true,true,true);
            this.tool.endDrag();
            this.tool.handleMouseMove(event);
            this.tool.update();

            this.tool.deactivate();
            this.isBoxSelection = false;

            if(this.callback){
                this.callback();
            }
        }
    }

    // 当前弃用 该方法目前无效
    _getAllData(ids){
        let dataList=[];

        let times=0;

        for (let i = 0; i < ids.length; i++) {
            this.viewer.getProperties(ids[i],function (obj) {
                times++;
                // 将父物体
                let names=  obj.name.split(" [")[0];

                let data={};
                data.name=obj.name;
                data.id=ids[i];

                if(dataList[names]){

                }else{
                    dataList[names]={};
                    dataList[names].childrenList=[];
                    dataList[names].childrenIdList=[];
                }
                dataList[names].mainName=names;
                dataList[names].childrenIdList.push(data.id);
                dataList[names].childrenList.push(data);

            })
        }
    }

}

let _BoxSelection_CrossMaxWidth;

class _BoxSelection_WindowTool {


    constructor(viewer) {
        _BoxSelection_CrossMaxWidth=20;
        // this.selectionCallback=selectionCallback;

        this.onResize = this.onResize.bind(this)

        this.selectSet = new _BoxSelection_SelectSet(viewer)

        this.partialSelect = true
        this.materialLine = null
        this.isDragging = false
        this.crossGeomX = null
        this.crossGeomY = null
        this.isActive = false
        this.rectGroup = null
        this.lineGeom = null
        this.viewer = viewer
    }

    getNames() {

        return ["selectionWindowTool"]
    }

    getName() {

        return "selectionWindowTool"
    }

    getPriority() {

        return 1000
    }

    onResize() {
        const overlay =
            this.viewer.impl.overlayScenes[
                'selectionWindowOverlay']

        if (overlay) {

            const canvas = this.viewer.canvas

            const camera = new THREE.OrthographicCamera(
                0, canvas.clientWidth,
                0, canvas.clientHeight,
                1, 1000)

            overlay.camera = camera
        }

        this.rectGroup = null
    }

    setModel(model) {

        if (this.isActive) {

            this.model = model

            this.selectSet.setModel(model)
        }
    }

    setPartialSelect(partialSelect) {

        this.partialSelect = partialSelect
    }

    activate() {

        if (!this.isActive) {

            this.viewer.clearSelection()
            this.model =
                this.viewer.activeModel ||
                this.viewer.model

            this.selectSet.setModel(this.model)

            this.materialLine = new THREE.LineBasicMaterial({
                color: new THREE.Color(0xFFFF00),
                linewidth: 3,
                opacity: 1
            })

            this.mouseStart = new THREE.Vector3(0, 0, -10)

            this.mouseEnd = new THREE.Vector3(0, 0, -10)

            const canvas = this.viewer.canvas

            const camera = new THREE.OrthographicCamera(
                0, canvas.clientWidth,
                0, canvas.clientHeight,
                1, 1000)

            this.viewer.impl.createOverlayScene(
                'selectionWindowOverlay',
                this.materialLine,
                this.materialLine,
                camera)


            this.viewer.impl.api.addEventListener(
                ZhiUTech.Viewing.VIEWER_RESIZE_EVENT,
                this.onResize)

            this.isActive = true

            // this.emit('activate')
        }
    }

    deactivate() {

        if (this.isActive) {

            this.viewer.impl.removeOverlayScene('selectionWindowOverlay');

            this.mouseStart.set(0, 0, -10);
            this.mouseEnd.set(0, 0, -10);

            this.isDragging = false;
            this.isActive = false;
            this.rectGroup = null

            this.viewer.impl.api.removeEventListener(
                ZhiUTech.Viewing.VIEWER_RESIZE_EVENT,
                this.onResize)

            this.viewer.toolController.deactivateTool(
                this.getName())

            // this.emit('deactivate')
        }
    }

    getCursor() {

        const tool = this.viewer.toolController.getTool("dolly")

        const mode = tool.getTriggeredMode()

        switch (mode) {

            case "dolly":
                return _BoxSeletcion_Cursors.dolly

            case "pan":
                return _BoxSeletcion_Cursors.pan
        }

        return _BoxSeletcion_Cursors.window
    }

    handleGesture(event) {

        return true
    }

    handleSingleClick(event, button) {

        return true
    }

    handleButtonDown(event, button) {

        //left button down
        if (button === 0) {

            this.startDrag(event)
            return true
        }

        return false
    }

    handleMouseMove(event) {
        if (this.lineGeom && this.isDragging) {
            this.pointerEnd = event.pointers
                ? event.pointers[0]
                : event

            this.mouseEnd.x = event.offsetX
            this.mouseEnd.y = event.offsetY

            // this.mouseEnd.x = event.canvasX
            // this.mouseEnd.y = event.canvasY


            return true
        }

        return false
    }

    handleButtonUp(event, button) {

        if (button === 0) {

            this.endDrag()
            return true
        }

        return false
    }

    handleKeyDown(event, keyCode) {

        if (keyCode === 27) {

            this.deactivate()
        }

        return false
    }

    startDrag(event) {

        if (this.isDragging === false) {

            this.pointerStart = event.pointers
                ? event.pointers[0]
                : event

            // begin dragging
            this.isDragging = true

            this.mouseStart.x = event.offsetX
            this.mouseStart.y = event.offsetY

            // this.mouseEnd.x = event.canvasX
            // this.mouseEnd.y = event.canvasY

            if (this.rectGroup === null) {

                this.lineGeom = new THREE.Geometry()

                // rectangle of zoom window
                this.lineGeom.vertices.push(
                    this.mouseStart.clone(),
                    this.mouseStart.clone(),
                    this.mouseStart.clone(),
                    this.mouseStart.clone(),
                    this.mouseStart.clone())

                // cross for identify zoom window center.
                this.crossGeomX = new THREE.Geometry()

                this.crossGeomX.vertices.push(
                    this.mouseStart.clone(),
                    this.mouseStart.clone())

                this.crossGeomY = new THREE.Geometry()

                this.crossGeomY.vertices.push(
                    this.mouseStart.clone(),
                    this.mouseStart.clone())

                // add geom to group
                const line_mesh = new THREE.Line(
                    this.lineGeom,
                    this.materialLine,
                    THREE.LineStrip)

                const line_cross_x = new THREE.Line(
                    this.crossGeomX,
                    this.materialLine,
                    THREE.LineStrip)

                const line_cross_y = new THREE.Line(
                    this.crossGeomY,
                    this.materialLine,
                    THREE.LineStrip)

                this.rectGroup = new THREE.Group()

                this.rectGroup.add(line_mesh)
                this.rectGroup.add(line_cross_x)
                this.rectGroup.add(line_cross_y)

            } else {

                this.lineGeom.vertices[0] = this.mouseStart.clone()
                this.lineGeom.vertices[1] = this.mouseStart.clone()
                this.lineGeom.vertices[2] = this.mouseStart.clone()
                this.lineGeom.vertices[3] = this.mouseStart.clone()
                this.lineGeom.vertices[4] = this.mouseStart.clone()

                this.crossGeomX.vertices[0] = this.mouseStart.clone()
                this.crossGeomX.vertices[1] = this.mouseStart.clone()
                this.crossGeomY.vertices[0] = this.mouseStart.clone()
                this.crossGeomY.vertices[1] = this.mouseStart.clone()

                this.crossGeomX.verticesNeedUpdate = true
                this.crossGeomY.verticesNeedUpdate = true
                this.lineGeom.verticesNeedUpdate = true
            }

            this.viewer.impl.addOverlay(
                "selectionWindowOverlay",
                this.rectGroup)
        }
    }

    endDrag() {

        if (this.isDragging === true) {

            this.viewer.impl.removeOverlay(
                "selectionWindowOverlay",
                this.rectGroup)
            this.isDragging = false
        }
    }

    update() {

        if (!this.isActive)
            return;
        if (this.lineGeom && this.isDragging) {
            // draw rectangle
            this.lineGeom.vertices[1].x = this.mouseStart.x
            this.lineGeom.vertices[1].y = this.mouseEnd.y
            this.lineGeom.vertices[2] = this.mouseEnd.clone()
            this.lineGeom.vertices[3].x = this.mouseEnd.x
            this.lineGeom.vertices[3].y = this.mouseStart.y
            this.lineGeom.vertices[4] = this.lineGeom.vertices[0]

            // draw cross
            var width = Math.abs(this.mouseEnd.x - this.mouseStart.x);
            var height = Math.abs(this.mouseEnd.y - this.mouseStart.y);
            var length = width > height ? height : width;

            if (length > _BoxSelection_CrossMaxWidth) {
                length = _BoxSelection_CrossMaxWidth;
            }

            var half_length = length * 0.5;

            var cross_center = [
                (this.mouseEnd.x + this.mouseStart.x) * 0.5,
                (this.mouseEnd.y + this.mouseStart.y) * 0.5
            ]

            this.crossGeomX.vertices[0].x = cross_center[0] - half_length
            this.crossGeomX.vertices[0].y = cross_center[1]
            this.crossGeomX.vertices[1].x = cross_center[0] + half_length
            this.crossGeomX.vertices[1].y = cross_center[1]

            this.crossGeomY.vertices[0].x = cross_center[0]
            this.crossGeomY.vertices[0].y = cross_center[1] - half_length
            this.crossGeomY.vertices[1].x = cross_center[0]
            this.crossGeomY.vertices[1].y = cross_center[1] + half_length

            this.crossGeomX.verticesNeedUpdate = true
            this.crossGeomY.verticesNeedUpdate = true
            this.lineGeom.verticesNeedUpdate = true

            // only redraw overlay
            this.viewer.impl.invalidate(false, false, true)

        } else {
            return this.select()
        }

        return false
    }

    select() {

        const rectMinX = this.mouseStart.x
        const rectMinY = this.mouseStart.y

        const rectMaxX = this.mouseEnd.x
        const rectMaxY = this.mouseEnd.y

        const rectHeight = Math.abs(rectMaxY - rectMinY);
        const rectWidth = Math.abs(rectMaxX - rectMinX);

        // region 正反选逻辑
        let isRight=true;
        let x=rectMaxX - rectMinX;
        let y=rectMaxY - rectMinY;

        if(x>0){
            isRight=false;
        }else if(x<0){
            isRight=true;
        }else{
            if(y>0){
                isRight=false;
            }else if(y<0){
                isRight=true;
            }else{
                return false
            }
        }

        this.setPartialSelect(isRight);
        // endregion

        if (rectWidth === 0 || rectHeight === 0) {
            return false
        }

        const dbIds = this.selectSet.compute(
            this.pointerStart,
            this.pointerEnd,
            this.partialSelect)

        // this.emit('selection', {
        //     model: this.model,
        //     guid: this.guid(),
        //     dbIds
        // })

        if(dbIds==undefined||dbIds.length==0){
            return;
        }

        // region 过滤后的列表
        let filteredList=[];
        let unHideList=this.viewer.getIsolatedNodes();
        if(unHideList.length<=0){
            filteredList=dbIds;
        }else{
            for(let i=0;i<dbIds.length;i++){
                if(unHideList.indexOf(dbIds[i])!=-1){
                    filteredList.push(dbIds[i]);
                }
            }
        }
        // endregion
        this.viewer.impl.selector.setSelection(
            filteredList,
            this.model);

        // if(this.selectionCallback){
        //     this.selectionCallback(dbIds);
        // }



        this.deactivate();

        return true
    }
}

class _BoxSelection_SelectSet {

    constructor(viewer) {

        this.viewer = viewer
    }

    /////////////////////////////////////////////////////////
    // Set model: required to compute the bounding boxes
    //
    /////////////////////////////////////////////////////////
    async setModel(model) {

        this.model = model;
        const instanceTree = model.getData().instanceTree;
        const rootId = instanceTree.getRootId();

        const bbox =
            await this.getComponentBoundingBox(
                model, rootId);

        this.boundingSphere = bbox.getBoundingSphere()

        const leafIds = await _BoxSelection_Toolkit.getLeafNodes(model)

        this.boundingBoxInfo = leafIds.map((dbId) => {

            const bbox = this.getLeafComponentBoundingBox(
                model, dbId)

            return {
                bbox,
                dbId
            }
        })
        ZhiUTech_MsgCenter.L_SendMsg("警告","框选需要修正的地方");
    }

    /////////////////////////////////////////////////////////
    // Returns bounding box as it appears in the viewer
    // (transformations could be applied)
    //
    /////////////////////////////////////////////////////////
    getModifiedWorldBoundingBox(fragIds, fragList) {

        const fragbBox = new THREE.Box3()
        const nodebBox = new THREE.Box3()

        fragIds.forEach(function (fragId) {

            fragList.getWorldBounds(fragId, fragbBox)

            nodebBox.union(fragbBox)
        })

        return nodebBox
    }

    /////////////////////////////////////////////////////////
    // Returns bounding box for fragment list
    //
    /////////////////////////////////////////////////////////
    async getComponentBoundingBox(model, dbId) {

        const fragIds = await _BoxSelection_Toolkit.getFragIds(
            model, dbId)

        const fragList = model.getFragmentList()

        return this.getModifiedWorldBoundingBox(
            fragIds, fragList)
    }

    getLeafComponentBoundingBox(model, dbId) {

        const fragIds = _BoxSelection_Toolkit.getLeafFragIds(
            model, dbId)

        const fragList = model.getFragmentList()

        return this.getModifiedWorldBoundingBox(
            fragIds, fragList)
    }

    /////////////////////////////////////////////////////////
    // Creates Raycaster object from the mouse pointer
    //
    /////////////////////////////////////////////////////////
    pointerToRay(pointer) {

        const camera = this.viewer.navigation.getCamera()
        const pointerVector = new THREE.Vector3()
        const rayCaster = new THREE.Raycaster()
        const pointerDir = new THREE.Vector3()
        const domElement = this.viewer.canvas

        const rect = domElement.getBoundingClientRect()

        const x = ((pointer.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((pointer.clientY - rect.top) / rect.height) * 2 + 1

        if (camera.isPerspective) {

            pointerVector.set(x, y, 0.5)

            pointerVector.unproject(camera)

            rayCaster.set(camera.position,
                pointerVector.sub(
                    camera.position).normalize())

        } else {

            pointerVector.set(x, y, -15)

            pointerVector.unproject(camera)

            pointerDir.set(0, 0, -1)

            rayCaster.set(pointerVector,
                pointerDir.transformDirection(
                    camera.matrixWorld))
        }

        return rayCaster.ray
    }

    /////////////////////////////////////////////////////////
    // Returns true if the box is contained inside the
    // closed volume defined by the the input planes
    //
    /////////////////////////////////////////////////////////
    containsBox(planes, box) {

        const {min, max} = box

        const vertices = [
            new THREE.Vector3(min.x, min.y, min.z),
            new THREE.Vector3(min.x, min.y, max.z),
            new THREE.Vector3(min.x, max.y, max.z),
            new THREE.Vector3(max.x, max.y, max.z),
            new THREE.Vector3(max.x, max.y, min.z),
            new THREE.Vector3(max.x, min.y, min.z),
            new THREE.Vector3(min.x, max.y, min.z),
            new THREE.Vector3(max.x, min.y, max.z)
        ]

        for (let vertex of vertices) {

            for (let plane of planes) {

                if (plane.distanceToPoint(vertex) < 0) {

                    return false
                }
            }
        }

        return true
    }

    /////////////////////////////////////////////////////////
    // Returns true if at least one vertex is contained in
    // closed volume defined by the the input planes
    //
    /////////////////////////////////////////////////////////
    containsVertex(planes, vertices) {

        for (let vertex of vertices) {

            let isInside = true

            for (let plane of planes) {

                if (plane.distanceToPoint(vertex) < 0) {

                    isInside = false
                    break
                }
            }

            if (isInside) {

                return true
            }
        }

        return false
    }

    /////////////////////////////////////////////////////////
    // Returns the oriented camera plane
    //
    /////////////////////////////////////////////////////////
    getCameraPlane() {

        const camera = this.viewer.navigation.getCamera()

        const normal = camera.target.clone().sub(
            camera.position).normalize()

        const pos = camera.position

        const dist =
            -normal.x * pos.x
            - normal.y * pos.y
            - normal.z * pos.z

        return new THREE.Plane(normal, dist)
    }

    /////////////////////////////////////////////////////////
    // Creates pyramid geometry to perform tri-box
    // intersection analysis
    //
    /////////////////////////////////////////////////////////
    createPyramidGeometry(vertices) {

        var geometry = new THREE.Geometry()

        geometry.vertices = vertices

        geometry.faces = [
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(0, 2, 3),
            new THREE.Face3(1, 0, 4),
            new THREE.Face3(2, 1, 4),
            new THREE.Face3(3, 2, 4),
            new THREE.Face3(0, 3, 4)
        ]

        return geometry
    }

    /////////////////////////////////////////////////////////
    // Determine if the bounding boxes are
    // inside, outside or intersect with the selection window
    //
    /////////////////////////////////////////////////////////
    filterBoundingBoxes(planes, vertices, partialSelect) {

        const geometry = this.createPyramidGeometry(vertices)

        const intersect = []
        const outside = []
        const inside = []

        for (let bboxInfo of this.boundingBoxInfo) {

            // if bounding box inside, then we can be sure
            // the mesh is inside too

            if (this.containsBox(planes, bboxInfo.bbox)) {

                inside.push(bboxInfo)

            } else if (partialSelect) {

                // otherwise need a more precise tri-box
                // analysis to determine if the bbox intersect
                // the pyramid geometry

                const intersects = geometryIntersectsBox3(
                    geometry, bboxInfo.bbox)

                intersects.length
                    ? intersect.push(bboxInfo)
                    : outside.push(bboxInfo)

            } else {

                outside.push(bboxInfo)
            }
        }

        return {
            intersect,
            outside,
            inside
        }
    }

    /////////////////////////////////////////////////////////
    // Runs the main logic of the select set:
    // computes a pyramid shape from the selection window
    // corners and determines enclosed meshes from the model
    //
    /////////////////////////////////////////////////////////
    compute(pointer1, pointer2, partialSelect) {

        // build 4 rays to project the 4 corners
        // of the selection window

        const xMin = Math.min(pointer1.clientX, pointer2.clientX);
        const xMax = Math.max(pointer1.clientX, pointer2.clientX);

        const yMin = Math.min(pointer1.clientY, pointer2.clientY);
        const yMax = Math.max(pointer1.clientY, pointer2.clientY);

        const ray1 = this.pointerToRay({
            clientX: xMin,
            clientY: yMin
        })

        const ray2 = this.pointerToRay({
            clientX: xMax,
            clientY: yMin
        })

        const ray3 = this.pointerToRay({
            clientX: xMax,
            clientY: yMax
        })

        const ray4 = this.pointerToRay({
            clientX: xMin,
            clientY: yMax
        })

        // first we compute the top of the pyramid
        const top = new THREE.Vector3(0, 0, 0)

        top.add(ray1.origin)
        top.add(ray2.origin)
        top.add(ray3.origin)
        top.add(ray4.origin)

        top.multiplyScalar(0.25)

        // we use the bounding sphere to determine
        // the height of the pyramid
        const {center, radius} = this.boundingSphere

        // compute distance from pyramid top to center
        // of bounding sphere

        const dist = new THREE.Vector3(
            top.x - center.x,
            top.y - center.y,
            top.z - center.z)

        // compute height of the pyramid:
        // to make sure we go far enough,
        // we add the radius of the bounding sphere

        const height = radius + dist.length()

        // compute the length of the side edges

        const angle = ray1.direction.angleTo(
            ray2.direction)

        const length = height / Math.cos(angle * 0.5)

        // compute bottom vertices

        const v1 = new THREE.Vector3(
            ray1.origin.x + ray1.direction.x * length,
            ray1.origin.y + ray1.direction.y * length,
            ray1.origin.z + ray1.direction.z * length)

        const v2 = new THREE.Vector3(
            ray2.origin.x + ray2.direction.x * length,
            ray2.origin.y + ray2.direction.y * length,
            ray2.origin.z + ray2.direction.z * length)

        const v3 = new THREE.Vector3(
            ray3.origin.x + ray3.direction.x * length,
            ray3.origin.y + ray3.direction.y * length,
            ray3.origin.z + ray3.direction.z * length)

        const v4 = new THREE.Vector3(
            ray4.origin.x + ray4.direction.x * length,
            ray4.origin.y + ray4.direction.y * length,
            ray4.origin.z + ray4.direction.z * length)

        // create planes

        const plane1 = new THREE.Plane()
        const plane2 = new THREE.Plane()
        const plane3 = new THREE.Plane()
        const plane4 = new THREE.Plane()
        const plane5 = new THREE.Plane()

        plane1.setFromCoplanarPoints(top, v1, v2)
        plane2.setFromCoplanarPoints(top, v2, v3)
        plane3.setFromCoplanarPoints(top, v3, v4)
        plane4.setFromCoplanarPoints(top, v4, v1)
        plane5.setFromCoplanarPoints(v3, v2, v1)

        const planes = [
            plane1, plane2,
            plane3, plane4,
            plane5
        ]

        const vertices = [
            v1, v2, v3, v4, top
        ]

        // filter all bounding boxes to determine
        // if inside, outside or intersect

        const result = this.filterBoundingBoxes(
            planes, vertices, partialSelect)

        // all inside bboxes need to be part of the selection

        const dbIdsInside = result.inside.map((bboxInfo) => {

            return bboxInfo.dbId
        })

        // if partialSelect = true
        // we need to return the intersect bboxes

        if (partialSelect) {

            const dbIdsIntersect = result.intersect.map((bboxInfo) => {

                return bboxInfo.dbId
            })

            // At this point perform a finer analysis
            // to determine if the any of the mesh vertices are inside
            // or outside the selection window but it would
            // be a much more expensive computation

            //const dbIdsIntersectAccurate =
            //  dbIdsIntersect.filter((dbId) => {
            //
            //    const geometry =
            //      Toolkit.buildComponentGeometry(
            //        this.viewer, this.viewer.model, dbId)
            //
            //    return this.containsVertex(
            //      planes, geometry.vertices)
            //  })

            return [...dbIdsInside, ...dbIdsIntersect]
        }

        return dbIdsInside
    }
}

//region 几何运算

let norm = new THREE.Vector3()
let t1 = new THREE.Vector3()
let t2 = new THREE.Vector3()
let depth = 0

function checkBoxSeparation(
    phase,
    minX, minY, minZ,
    maxX, maxY, maxZ,
    norm, v1, v2, v3) {

    const minQ =
        norm.x * (norm.x > 0 ? minX : maxX) +
        norm.y * (norm.y > 0 ? minY : maxY) +
        norm.z * (norm.z > 0 ? minZ : maxZ)

    const maxQ =
        norm.x * (norm.x > 0 ? maxX : minX) +
        norm.y * (norm.y > 0 ? maxY : minY) +
        norm.z * (norm.z > 0 ? maxZ : minZ)

    const q1 = norm.x * v1.x + norm.y * v1.y + norm.z * v1.z
    const q2 = norm.x * v2.x + norm.y * v2.y + norm.z * v2.z
    const q3 = norm.x * v3.x + norm.y * v3.y + norm.z * v3.z

    const vMinQ = Math.min(q1, q2, q3)
    const vMaxQ = Math.max(q1, q2, q3)

    if (phase === 0) {

        // just check the collision
        return (minQ > vMaxQ) || (maxQ < vMinQ)

    } else {

        // compute penetration depth
        const sq = 1 / norm.length()

        if (!isFinite(sq)) {

            return
        }

        depth = Math.min(
            depth,
            (vMaxQ - minQ) * sq,
            (maxQ - vMinQ) * sq)
    }
}

function geometryIntersectsBox3_PassThree(
    phase,
    minX, minY, minZ,
    maxX, maxY, maxZ,
    axis, v1, v2, v3, t1) {

    t1.subVectors(v1, v2)

    switch (axis) {

        case 0:
            t1.set(0, -t1.z, t1.y)
            break

        case 1:
            t1.set(-t1.z, 0, t1.x)
            break

        case 2:
            t1.set(-t1.y, t1.x, 0)
            break;
    }

    return checkBoxSeparation(
        phase,
        minX, minY, minZ,
        maxX, maxY, maxZ,
        t1, v1, v2, v3)
}

function geometryIntersectsBox3(geometry, box) {

    // Tomas Akenine-Möller. 2005.
    // Fast 3D triangle-box overlap testing.
    // http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/tribox_tam.pdf

    const {faces, vertices} = geometry

    const minX = box.min.x
    const minY = box.min.y
    const minZ = box.min.z

    const maxX = box.max.x
    const maxY = box.max.y
    const maxZ = box.max.z

    const results = []

    for (var fI = 0; fI < faces.length; ++fI) {

        const face = faces[fI]

        const v1 = vertices[face.a]
        const v2 = vertices[face.b]
        const v3 = vertices[face.c]

        const vMinX = Math.min(v1.x, v2.x, v3.x)
        const vMinY = Math.min(v1.y, v2.y, v3.y)
        const vMinZ = Math.min(v1.z, v2.z, v3.z)

        const vMaxX = Math.max(v1.x, v2.x, v3.x)
        const vMaxY = Math.max(v1.y, v2.y, v3.y)
        const vMaxZ = Math.max(v1.z, v2.z, v3.z)

        // bounding AABB cull
        if (
            vMinX > maxX ||
            vMinY > maxY ||
            vMinZ > maxZ ||
            vMaxX < minX ||
            vMaxY < minY ||
            vMaxZ < minZ
        ) {
            // never be intersecting
            continue
        }

        t1.subVectors(v2, v1)
        t2.subVectors(v3, v1)

        norm.crossVectors(t1, t2)

        if (
            checkBoxSeparation(0, minX, minY, minZ, maxX, maxY, maxZ, norm, v1, v2, v3) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 0, v1, v2, v3, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 0, v1, v3, v2, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 0, v2, v3, v1, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 1, v1, v2, v3, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 1, v1, v3, v2, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 1, v2, v3, v1, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 2, v1, v2, v3, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 2, v1, v3, v2, t1) ||
            geometryIntersectsBox3_PassThree(0, minX, minY, minZ, maxX, maxY, maxZ, 2, v2, v3, v1, t1)
        ) {

            // never be intersecting
            continue
        }

        // compute depth
        depth = Infinity

        checkBoxSeparation(1, minX, minY, minZ, maxX, maxY, maxZ, norm, v1, v2, v3)

        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 0, v1, v2, v3, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 0, v1, v3, v2, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 0, v2, v3, v1, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 1, v1, v2, v3, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 1, v1, v3, v2, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 1, v2, v3, v1, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 2, v1, v2, v3, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 2, v1, v3, v2, t1)
        geometryIntersectsBox3_PassThree(1, minX, minY, minZ, maxX, maxY, maxZ, 2, v2, v3, v1, t1)

        // triangle touches the box
        results.push({
            faceIndex: fI,
            depth: depth
        })
    }

    return results
}

//endregion

class _BoxSelection_Toolkit {

    ///////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////
    static guid(format = 'xxxxxxxxxxxx') {

        var d = new Date().getTime();

        var guid = format.replace(
            /[xy]/g,
            function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });

        return guid;
    }

    /////////////////////////////////////////////
    //mobile detection
    //
    /////////////////////////////////////////////
    static get mobile() {

        return {

            getUserAgent: function () {
                return navigator.userAgent;
            },
            isAndroid: function () {
                return this.getUserAgent().match(/Android/i);
            },
            isBlackBerry: function () {
                return this.getUserAgent().match(/BlackBerry/i);
            },
            isIOS: function () {
                return this.getUserAgent().match(/iPhone|iPad|iPod/i);
            },
            isOpera: function () {
                return this.getUserAgent().match(/Opera Mini/i);
            },
            isWindows: function () {
                return this.isWindowsDesktop() || this.isWindowsMobile();
            },
            isWindowsMobile: function () {
                return this.getUserAgent().match(/IEMobile/i);
            },
            isWindowsDesktop: function () {
                return this.getUserAgent().match(/WPDesktop/i);
            },
            isAny: function () {

                return this.isAndroid() ||
                    this.isBlackBerry() ||
                    this.isIOS() ||
                    this.isWindowsMobile();
            }
        }
    }

    /////////////////////////////////////////////////////////
    // Load a document from URN
    //
    /////////////////////////////////////////////////////////
    static loadDocument(urn) {

        return new Promise((resolve, reject) => {

            const paramUrn = !urn.startsWith('urn:')
                ? 'urn:' + urn
                : urn

            Autodesk.Viewing.Document.load(paramUrn, (doc) => {

                resolve(doc)

            }, (error) => {

                reject(error)
            })
        })
    }

    /////////////////////////////////////////////////////////
    // Return viewables
    //
    /////////////////////////////////////////////////////////
    static getViewableItems(doc, roles = ['3d', '2d']) {

        const rootItem = doc.getRootItem()

        let items = []

        const roleArray = roles
            ? (Array.isArray(roles) ? roles : [roles])
            : []

        roleArray.forEach((role) => {

            items = [...items,
                ...Autodesk.Viewing.Document.getSubItemsWithProperties(
                    rootItem, {
                        type: 'geometry',
                        role
                    }, true)]
        })

        return items
    }

    /////////////////////////////////////////////////////////
    // Toolbar button
    //
    /////////////////////////////////////////////////////////
    static createButton(id, className, tooltip, handler) {

        var button = new Autodesk.Viewing.UI.Button(id)

        button.icon.style.fontSize = '24px'

        button.icon.className = className

        button.setToolTip(tooltip)

        button.onClick = handler

        return button
    }

    /////////////////////////////////////////////////////////
    // Control group
    //
    /////////////////////////////////////////////////////////
    static createControlGroup(viewer, ctrlGroupName) {

        var viewerToolbar = viewer.getToolbar(true)

        if (viewerToolbar) {

            var ctrlGroup = new Autodesk.Viewing.UI.ControlGroup(
                ctrlGroupName)

            viewerToolbar.addControl(ctrlGroup)

            return ctrlGroup
        }
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static getLeafNodes(model, dbIds) {

        return new Promise((resolve, reject) => {

            try {

                const instanceTree =
                    model.getData().instanceTree ||
                    model.getFragmentMap()

                dbIds = dbIds || instanceTree.getRootId()

                const dbIdArray = Array.isArray(dbIds)
                    ? dbIds
                    : [dbIds]

                const leafIds = []

                const getLeafNodeIdsRec = (id) => {

                    let childCount = 0;

                    instanceTree.enumNodeChildren(id, (childId) => {
                        getLeafNodeIdsRec(childId)
                        ++childCount
                    })

                    if (childCount === 0) {

                        leafIds.push(id)
                    }
                }

                dbIdArray.forEach((dbId) => {
                    getLeafNodeIdsRec(dbId)
                })

                return resolve(leafIds)

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////
    // get node fragIds
    //
    /////////////////////////////////////////////////////////
    static getFragIds(model, dbIds) {

        return new Promise(async (resolve, reject) => {

            try {

                const it = model.getData().instanceTree

                dbIds = dbIds || it.getRootId()

                const dbIdArray = Array.isArray(dbIds)
                    ? dbIds : [dbIds]

                const leafIds = it
                    ? await _BoxSelection_Toolkit.getLeafNodes(model, dbIdArray)
                    : dbIdArray

                let fragIds = []

                for (var i = 0; i < leafIds.length; ++i) {

                    if (it) {

                        it.enumNodeFragments(
                            leafIds[i], (fragId) => {
                                fragIds.push(fragId)
                            })

                    } else {

                        const leafFragIds =
                            _BoxSelection_Toolkit.getLeafFragIds(
                                model, leafIds[i])

                        fragIds = [
                            ...fragIds,
                            ...leafFragIds
                        ]
                    }
                }

                return resolve(fragIds)

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////
    // get leaf node fragIds
    //
    /////////////////////////////////////////////////////////
    static getLeafFragIds(model, leafId) {

        if (model.getData().instanceTree) {

            const it = model.getData().instanceTree

            const fragIds = []

            it.enumNodeFragments(
                leafId, (fragId) => {
                    fragIds.push(fragId)
                })

            return fragIds

        } else {

            const fragments = model.getData().fragments

            const fragIds = fragments.dbId2fragId[leafId]

            return !Array.isArray(fragIds)
                ? [fragIds]
                : fragIds
        }
    }

    /////////////////////////////////////////////////////////
    // Node bounding box
    //
    /////////////////////////////////////////////////////////
    static getWorldBoundingBox(model, dbId) {

        return new Promise(async (resolve, reject) => {

            try {

                var fragIds =
                    await _BoxSelection_Toolkit.getFragIds(
                        model, dbId)

                if (!fragIds.length) {

                    return reject('No geometry, invalid dbId?')
                }

                var fragList = model.getFragmentList()

                var fragbBox = new THREE.Box3()
                var nodebBox = new THREE.Box3()

                fragIds.forEach(function (fragId) {

                    fragList.getWorldBounds(fragId, fragbBox)
                    nodebBox.union(fragbBox)
                })

                return resolve(nodebBox)

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////
    // Gets properties from component
    //
    /////////////////////////////////////////////////////////
    static getProperties(model, dbId, requestedProps = null) {

        return new Promise((resolve, reject) => {

            try {

                const dbIdInt = parseInt(dbId)

                if (isNaN(dbIdInt)) {

                    return reject(dbId + ' is not a valid integer')
                }

                if (requestedProps) {

                    const propTasks = requestedProps.map((displayName) => {

                        return _BoxSelection_Toolkit.getProperty(
                            model, dbIdInt, displayName, 'Not Available')
                    })

                    Promise.all(propTasks).then((properties) => {

                        resolve(properties)
                    })

                } else {

                    model.getProperties(dbIdInt, (result) => {

                        if (result.properties) {

                            return resolve(
                                result.properties)
                        }

                        return reject('No Properties')
                    })
                }

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static getProperty(model, dbId, displayName, defaultValue) {

        return new Promise((resolve, reject) => {

            try {

                model.getProperties(dbId, (result) => {

                    if (result.properties) {

                        result.properties.forEach((prop) => {

                            prop.dbId = dbId

                            if (typeof displayName === 'function') {

                                if (displayName(prop.displayName)) {

                                    resolve(prop)
                                }

                            } else if (displayName === prop.displayName) {

                                resolve(prop)
                            }
                        })

                        if (defaultValue) {

                            return resolve({
                                displayValue: defaultValue,
                                displayName,
                                dbId
                            })
                        }

                        reject(new Error('Not Found'))

                    } else {

                        reject(new Error('Error getting properties'));
                    }
                })

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////
    // Gets all existing properties from component  dbIds
    //
    /////////////////////////////////////////////////////////
    static getPropertyList(viewer, dbIds, model = null) {

        return new Promise(async (resolve, reject) => {

            try {

                model = model || viewer.activeModel || viewer.model

                var propertyTasks = dbIds.map((dbId) => {

                    return _BoxSelection_Toolkit.getProperties(model, dbId)
                })

                var propertyResults = await Promise.all(
                    propertyTasks)

                var properties = []

                propertyResults.forEach((propertyResult) => {

                    propertyResult.forEach((prop) => {

                        if (properties.indexOf(prop.displayName) < 0) {

                            properties.push(prop.displayName)
                        }
                    })
                })

                return resolve(properties.sort())

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static getBulkPropertiesAsync(model, dbIds, propFilter) {

        return new Promise(async (resolve, reject) => {

            if (typeof propFilter === 'function') {

                const propTasks = dbIds.map((dbId) => {

                    return this.getProperty(
                        model, dbId, propFilter, 'Not Found')
                })

                const propRes = await Promise.all(propTasks)

                const filteredRes = propRes.filter((res) => {

                    return res.displayValue !== 'Not Found'
                })

                resolve(filteredRes.map((res) => {

                    return {
                        properties: [res],
                        dbId: res.dbId
                    }
                }))

            } else {

                const propFilterArray = Array.isArray(propFilter)
                    ? propFilter : [propFilter]

                model.getBulkProperties(dbIds, propFilterArray, (result) => {

                    resolve(result)

                }, (error) => {

                    reject(error)
                })
            }
        })
    }

    /////////////////////////////////////////////////////////
    // Maps components by property
    //
    /////////////////////////////////////////////////////////
    static mapComponentsByProp(model, propFilter, components, defaultProp) {

        return new Promise(async (resolve, reject) => {

            try {

                const results = await _BoxSelection_Toolkit.getBulkPropertiesAsync(
                    model, components, propFilter)

                const propertyResults = results.map((result) => {

                    const prop = result.properties[0]

                    return Object.assign({}, prop, {
                        dbId: result.dbId
                    })
                })

                var componentsMap = {};

                propertyResults.forEach((result) => {

                    var value = result.displayValue;

                    if (typeof value == 'string') {

                        value = value.split(':')[0]
                    }

                    if (!componentsMap[value]) {

                        componentsMap[value] = []
                    }

                    componentsMap[value].push(result.dbId)
                })

                return resolve(componentsMap)

            } catch (ex) {

                return reject(ex)
            }
        })
    }

    /////////////////////////////////////////////////////////////
    // Runs recursively the argument task on each node
    // of the data tree
    //
    /////////////////////////////////////////////////////////////
    static runTaskOnDataTree(root, taskFunc) {

        var tasks = [];

        var runTaskOnDataTreeRec = (node, parent = null) => {

            if (node.children) {

                node.children.forEach((childNode) => {

                    runTaskOnDataTreeRec(childNode, node);
                });
            }

            var task = taskFunc(node, parent);

            tasks.push(task);
        }

        runTaskOnDataTreeRec(root);

        return Promise.all(tasks);
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static drawBox(viewer, min, max, material, overlayId) {

        const geometry = new THREE.Geometry()

        geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
        geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))

        geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
        geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))

        geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
        geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))

        geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
        geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))

        geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))
        geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

        geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))
        geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

        geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))
        geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

        geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))
        geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

        geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
        geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

        geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
        geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

        geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
        geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

        geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
        geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

        const lines = new THREE.Line(geometry,
            material, THREE.LinePieces)

        viewer.impl.addOverlay(overlayId, lines)

        viewer.impl.invalidate(
            true, true, true)

        return lines
    }

    /////////////////////////////////////////////////////////
    // Set component material
    //
    /////////////////////////////////////////////////////////
    static async setMaterial(model, dbId, material) {

        const fragIds = await _BoxSelection_Toolkit.getFragIds(
            model, dbId)

        const fragList = model.getFragmentList()

        fragIds.forEach((fragId) => {

            fragList.setMaterial(fragId, material)
        })
    }

    /////////////////////////////////////////////////////////
    // Recursively builds the model tree
    //
    /////////////////////////////////////////////////////////
    static buildModelTree(model, createNodeFunc = null) {

        //builds model tree recursively
        function _buildModelTreeRec(node) {

            instanceTree.enumNodeChildren(node.dbId,
                function (childId) {

                    var childNode = null;

                    if (createNodeFunc) {

                        childNode = createNodeFunc(childId);

                    } else {

                        node.children = node.children || [];

                        childNode = {
                            dbId: childId,
                            name: instanceTree.getNodeName(childId)
                        }

                        node.children.push(childNode)
                    }

                    _buildModelTreeRec(childNode)
                })
        }

        //get model instance tree and root component
        var instanceTree = model.getData().instanceTree

        var rootId = instanceTree.getRootId()

        var rootNode = {
            dbId: rootId,
            name: instanceTree.getNodeName(rootId)
        }

        _buildModelTreeRec(rootNode)

        return rootNode
    }

    /////////////////////////////////////////////////////////
    // Recursively execute task on model tree
    //
    /////////////////////////////////////////////////////////
    static executeTaskOnModelTree(model, task) {

        const taskResults = []

        function executeTaskOnModelTreeRec(dbId) {

            instanceTree.enumNodeChildren(dbId,
                function (childId) {

                    taskResults.push(task(model, childId))

                    executeTaskOnModelTreeRec(childId)
                })
        }

        //get model instance tree and root component
        const instanceTree = model.getData().instanceTree

        const rootId = instanceTree.getRootId()

        executeTaskOnModelTreeRec(rootId)

        return taskResults
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static hide(viewer, dbIds = [], model = null) {

        try {

            model = model || viewer.activeModel || viewer.model

            viewer.hide(dbIds)

            const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds]

            const tasks = targetIds.map((dbId) => {

                return new Promise((resolve) => {

                    viewer.impl.visibilityManager.setNodeOff(
                        dbId, true)

                    resolve()
                })
            })

            return Promise.all(tasks)

        } catch (ex) {

            return Promise.reject(ex)
        }
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static show(viewer, dbIds = [], model = null) {

        try {

            model = model || viewer.activeModel || viewer.model

            viewer.show(dbIds)

            const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds]

            targetIds.forEach((dbId) => {

                viewer.impl.visibilityManager.setNodeOff(
                    dbId, false)
            })

            return Promise.resolve()

        } catch (ex) {

            return Promise.reject(ex)
        }
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static async isolateFull(viewer, dbIds = [], model = null) {

        try {

            model = model || viewer.activeModel || viewer.model

            const vizMng = viewer.impl.visibilityManager

            vizMng.isolate(dbIds, model)

            const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds]

            const targetLeafIds = await _BoxSelection_Toolkit.getLeafNodes(
                model, targetIds)

            const leafIds = await _BoxSelection_Toolkit.getLeafNodes(model)

            const leafTasks = leafIds.map((dbId) => {

                return new Promise((resolveLeaf) => {

                    const show = !targetLeafIds.length ||
                        targetLeafIds.indexOf(dbId) > -1

                    vizMng.setNodeOff(dbId, !show, model)

                    resolveLeaf()
                })
            })

            return Promise.all(leafTasks)

        } catch (ex) {

            return Promise.reject(ex)
        }
    }

    ///////////////////////////////////////////////////////////////////
    // Rotate selected fragments
    //
    ///////////////////////////////////////////////////////////////////
    static rotateFragments(viewer, fragIds, axis, angle, center, model = null) {

        var quaternion = new THREE.Quaternion()

        quaternion.setFromAxisAngle(axis, angle)

        model = model || viewer.activeModel || viewer.model

        fragIds.forEach((fragId) => {

            var fragProxy = viewer.impl.getFragmentProxy(
                model, fragId)

            fragProxy.getAnimTransform()

            var position = new THREE.Vector3(
                fragProxy.position.x - center.x,
                fragProxy.position.y - center.y,
                fragProxy.position.z - center.z)

            position.applyQuaternion(quaternion)

            position.add(center)

            fragProxy.position = position

            fragProxy.quaternion.multiplyQuaternions(
                quaternion, fragProxy.quaternion)

            fragProxy.updateAnimTransform()
        })
    }

    /////////////////////////////////////////////////////////
    // A fix for viewer.restoreState
    // that also restores pivotPoint
    //
    /////////////////////////////////////////////////////////
    static restoreStateWithPivot(
        viewer, state, filter = null, immediate = false) {

        const onStateRestored = () => {

            viewer.removeEventListener(
                Autodesk.Viewing.VIEWER_STATE_RESTORED_EVENT,
                onStateRestored)

            const pivot = state.viewport.pivotPoint

            setTimeout(() => {

                viewer.navigation.setPivotPoint(
                    new THREE.Vector3(
                        pivot[0], pivot[1], pivot[2]))
            }, immediate ? 0 : 1250)
        }

        viewer.addEventListener(
            Autodesk.Viewing.VIEWER_STATE_RESTORED_EVENT,
            onStateRestored)

        viewer.restoreState(state, filter, immediate)
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static getComponentsByParentName(name, model) {

        const instanceTree = model.getData().instanceTree

        const rootId = instanceTree.getRootId()

        let parentId = 0

        instanceTree.enumNodeChildren(rootId,
            (childId) => {

                const nodeName = instanceTree.getNodeName(childId)

                if (nodeName.indexOf(name) > -1) {

                    parentId = childId
                }
            })

        return parentId > 0
            ? _BoxSelection_Toolkit.getLeafNodes(model, parentId)
            : []
    }

    /////////////////////////////////////////////////////////
    // Creates a standard THREE.Mesh out of a Viewer
    // component
    //
    /////////////////////////////////////////////////////////
    static buildComponentGeometry(
        viewer, model, dbId, faceFilter) {

        // first we assume the component dbId is a leaf
        // component: ie has no child so contains
        // geometry. This util method will return all fragIds
        // associated with that specific dbId
        const fragIds = _BoxSelection_Toolkit.getLeafFragIds(model, dbId)

        let matrixWorld = null

        const meshGeometry = new THREE.Geometry()

        fragIds.forEach((fragId) => {

            // for each fragId, get the proxy in order to access
            // THREE geometry
            const renderProxy =
                viewer.impl.getRenderProxy(
                    model, fragId)

            matrixWorld = matrixWorld || renderProxy.matrixWorld

            const geometry = renderProxy.geometry

            const attributes = geometry.attributes

            const positions = geometry.vb
                ? geometry.vb
                : attributes.position.array

            const indices = attributes.index.array || geometry.ib

            const stride = geometry.vb ? geometry.vbstride : 3

            const offsets = [{
                count: indices.length,
                index: 0,
                start: 0
            }]

            for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {

                var start = offsets[oi].start
                var count = offsets[oi].count
                var index = offsets[oi].index

                for (var i = start, il = start + count; i < il; i += 3) {

                    const a = index + indices[i]
                    const b = index + indices[i + 1]
                    const c = index + indices[i + 2]

                    const vA = new THREE.Vector3()
                    const vB = new THREE.Vector3()
                    const vC = new THREE.Vector3()

                    vA.fromArray(positions, a * stride)
                    vB.fromArray(positions, b * stride)
                    vC.fromArray(positions, c * stride)

                    if (!faceFilter || faceFilter(vA, vB, vC)) {

                        const faceIdx = meshGeometry.vertices.length

                        meshGeometry.vertices.push(vA)
                        meshGeometry.vertices.push(vB)
                        meshGeometry.vertices.push(vC)

                        const face = new THREE.Face3(
                            faceIdx, faceIdx + 1, faceIdx + 2)

                        meshGeometry.faces.push(face)
                    }
                }
            }
        })

        meshGeometry.applyMatrix(matrixWorld)

        return meshGeometry
    }

    /////////////////////////////////////////////////////////
    // Creates a standard THREE.Mesh out of a Viewer
    // component
    //
    /////////////////////////////////////////////////////////
    static buildComponentMesh(
        viewer, model, dbId, faceFilter, material) {

        const meshGeometry =
            _BoxSelection_Toolkit.buildComponentGeometry(
                viewer, model, dbId, faceFilter)

        meshGeometry.computeFaceNormals()
        meshGeometry.computeVertexNormals()

        // creates THREE.Mesh
        const mesh = new THREE.Mesh(
            meshGeometry, material)

        mesh.dbId = dbId

        return mesh
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    static selectiveExplode(viewer, scale, excludedFragIds, model = null) {

        model = model || viewer.activeModel || viewer.model

        var svf = model.getData();

        var mc = model.getVisibleBounds(true).center();

        var fragList = model.getFragmentList();

        var pt = new THREE.Vector3();

        //Input scale is in the range 0-1, where 0
        //means no displacement, and 1 maximum reasonable displacement.
        scale *= 2;

        //If we have a full part hierarchy we can use a
        //better grouping strategy when exploding
        if (svf.instanceTree && svf.instanceTree.nodeAccess.nodeBoxes && scale !== 0) {

            var scaledExplodeDepth = scale * (svf.instanceTree.maxDepth - 1) + 1;
            var explodeDepth = 0 | scaledExplodeDepth;
            var currentSegmentFraction = scaledExplodeDepth - explodeDepth;

            var it = svf.instanceTree;
            var tmpBox = new Float32Array(6);

            (function explodeRec(nodeId, depth, cx, cy, cz, ox, oy, oz) {

                var oscale = scale * 2;

                // smooth transition of this tree depth
                // from non-exploded to exploded state
                if (depth == explodeDepth)
                    oscale *= currentSegmentFraction;

                it.getNodeBox(nodeId, tmpBox);

                var mycx = 0.5 * (tmpBox[0] + tmpBox[3]);
                var mycy = 0.5 * (tmpBox[1] + tmpBox[4]);
                var mycz = 0.5 * (tmpBox[2] + tmpBox[5]);

                if (depth > 0 && depth <= explodeDepth) {
                    var dx = (mycx - cx) * oscale;
                    var dy = (mycy - cy) * oscale;
                    var dz = (mycz - cz) * oscale;

                    //var omax = Math.max(dx, Math.max(dy, dz));
                    ox += dx;
                    oy += dy;
                    oz += dz;
                }

                svf.instanceTree.enumNodeChildren(nodeId, function (dbId) {

                    explodeRec(dbId, depth + 1, mycx, mycy, mycz, ox, oy, oz);

                }, false);

                svf.instanceTree.enumNodeFragments(nodeId, function (fragId) {

                    if (excludedFragIds.indexOf(fragId.toString()) < 0) {

                        pt.x = ox;
                        pt.y = oy;
                        pt.z = oz;

                        fragList.updateAnimTransform(fragId, null, null, pt);
                    }

                }, false);

            })(svf.instanceTree.getRootId(), 0, mc.x, mc.y, mc.x, 0, 0, 0);

        } else {

            var boxes = fragList.fragments.boxes;

            var nbFrags = fragList.getCount()

            for (var fragId = 0; fragId < nbFrags; ++fragId) {

                if (excludedFragIds.indexOf(fragId.toString()) < 0) {

                    if (scale == 0) {

                        fragList.updateAnimTransform(fragId);

                    } else {

                        var box_offset = fragId * 6;

                        var cx = 0.5 * (boxes[box_offset] + boxes[box_offset + 3]);
                        var cy = 0.5 * (boxes[box_offset + 1] + boxes[box_offset + 4]);
                        var cz = 0.5 * (boxes[box_offset + 2] + boxes[box_offset + 5]);

                        cx = scale * (cx - mc.x);
                        cy = scale * (cy - mc.y);
                        cz = scale * (cz - mc.z);

                        pt.x = cx;
                        pt.y = cy;
                        pt.z = cz;

                        fragList.updateAnimTransform(fragId, null, null, pt);
                    }
                }
            }
        }
    }
}

let _BoxSeletcion_Cursors = {

    window: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAADWSURBVEiJ1ZVNEsIwCEYfTg/UjTPuemcvojfCRRMlNKGdKguZyaLkK4/8EERVybQJQERCUU3C63p+n/Bk9QHDRtbIX2GqKh6woRfxLdL0/M1KzYRaA+7AXDW9wN5fvrXEWud6AOABLD7QwREDgCdw7WV6ZjSAsi0Lzn4JmEcHeHbYWxQXw3FTEWmvaWY1X9Iie4CIKHE1fwfIsnSAZD/X/79FGbdISyzA9QMDG3axTTTVwx3NaNbm5B2dRHY1DWCUyd4qIs0bUB8nuz32/11Cu+KPM7sOXlrOS4sOkzb1AAAAAElFTkSuQmCC), auto",
    dolly: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAgVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8mJiYAAADNzc2/v7+fn59paWlPT08MDAwICAj6+vqpqak7Ozv29vby8vLp6em2traAgIBkZGRZWVlAQEAaGhpISEgkS7tbAAAAFHRSTlMAOvhpZD8mkQWegMy9qY1YVE01EYiqlE0AAADZSURBVCjPbY9ZloMgEAAbEbfsmRZZXbJn7n/AAX2RQVN/VD26AXLOeZLDGo6IbfI9tHq8cdxuj1HwvgCoaiHqKoRk+M3hB9jueUW8PnfsE/bJ3vms7nCkq7NoE3s99AXxoh8vFoXCpknrn5faAuJCenT0xPkYqnxQFJaU0gdZrsKm8aHZrAIffBj40mc1jsTfIJRWegq6opTMvlfqLqYg7kr1ZB7jFgeaMC59N//8O4WZ1IiPF8b5wMHcJn8zB4g4mc77zpxgAbMSUVoGK4iV0hL4wrksz+H0Bw5+E+HrniDQAAAAAElFTkSuQmCC), auto",
    pan: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABHVBMVEUAAABPTk4AAAAAAAAJCQkRERE0MzQQEBAODg4QEBB4d3dbWlo9PDw/Pj4vLy8sLCwZGBgWFhYcHBwKCgoSEhIAAAAKCgoICAgKCgoQEBAODg4EBAQICAgPDw8REREMDAx2dnY0NDQvLy9QUFAaGhomJSYjIyM7OjokJCQNDA0mJiYNDQ0AAAAUFBQJCQkQEBAEBAQNDQ0PDw8VFRX///+amJkAAAD5+fnz8/PKycn9/f339vbi4eLR0dDNzMyAgIB8e3xycHH7+/vw7+/o6OjX1ta7urq4t7iwsLCnp6eioqKbmppva21OTk74+Pjl5eXc3Nzb29vLy8vDw8PDwsKrqqqdnZ2WlpaSkpKTkZKMiouEg4NkZGRISEgxLzBpgbsEAAAANHRSTlMA+fiQXgngKSYG/vX17uvBuqackpCNg3BpUkpAPBwTDvj18+vl0s/NwrOwoZZ+TDg4NBkBGrzX8QAAAP5JREFUKM99j9Vuw0AQRdeuKZyGkyZNmbnXDLHDVGb8/8/oy7paK1bO0+oc7WiGnGiaxq+QRTQAOh8f9Jv4H/Ge8PZPrCdlvkxfYluUT2WyyCq3mZ7unwlKVLcqOzA/Mf71j0TWJ/Ym6rPeca05Ni4iIevYc7yoUD2zQFhq71BdI9nvBeBabFDSPe8DswlUc1Riw3VxbH0NHBUPQ0jrbDnPYDjALQBMq9E7nkC5y7VDKTZlUg8Q0lmjvl74zlYErgvKa42GPKf3/a0kQmYCDY1SYMDosqMoiWrGwz/uAbNvc/fNon4kXRKGq+PUo2Mb96afV0iUxqGU2s4VBbKUP65NL/LKF+7ZAAAAAElFTkSuQmCC), auto"
}

