// region THREE.CanvasTexture 拓展
THREE.CanvasTexture = function (canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {

    THREE.Texture.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);

    this.needsUpdate = true;

};
THREE.CanvasTexture.prototype = Object.create(THREE.Texture.prototype);
THREE.CanvasTexture.prototype.constructor = THREE.CanvasTexture;
// endregion

// region THREE.OBJMTLLoader 拓展
THREE.OBJMTLLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};
THREE.OBJMTLLoader.prototype = {

    constructor: THREE.OBJMTLLoader,

    load: function ( url, mtlurl, onLoad, onProgress, onError ) {

        var scope = this;

        var mtlLoader = new THREE.MTLLoader( this.manager );
        mtlLoader.setBaseUrl( url.substr( 0, url.lastIndexOf( "/" ) + 1 ) );
        mtlLoader.setCrossOrigin( this.crossOrigin );
        mtlLoader.load( mtlurl, function ( materials ) {

            var materialsCreator = materials;
            materialsCreator.preload();

            var loader = new THREE.XHRLoader( scope.manager );
            loader.setCrossOrigin( scope.crossOrigin );
            loader.load( url, function ( text ) {

                var object = scope.parse( text );

                object.traverse( function ( object ) {

                    if ( object instanceof THREE.Mesh ) {

                        if ( object.material.name ) {

                            var material = materialsCreator.create( object.material.name );

                            if ( material ) object.material = material;

                        }

                    }

                } );

                onLoad( object );

            }, onProgress, onError );

        }, onProgress, onError );

    },

    setCrossOrigin: function ( value ) {

        this.crossOrigin = value;

    },

    /**
     * Parses loaded .obj file
     * @param data - content of .obj file
     * @param mtllibCallback - callback to handle mtllib declaration (optional)
     * @return {THREE.Object3D} - Object3D (with default material)
     */

    parse: function ( data, mtllibCallback ) {

        function vector( x, y, z ) {

            return new THREE.Vector3( x, y, z );

        }

        function uv( u, v ) {

            return new THREE.Vector2( u, v );

        }

        function face3( a, b, c, normals ) {

            return new THREE.Face3( a, b, c, normals );

        }

        var face_offset = 0;

        function meshN( meshName, materialName ) {

            if ( vertices.length > 0 ) {

                geometry.vertices = vertices;

                geometry.mergeVertices();
                geometry.computeFaceNormals();
                geometry.computeBoundingSphere();

                object.add( mesh );

                geometry = new THREE.Geometry();
                mesh = new THREE.Mesh( geometry, material );

            }

            if ( meshName !== undefined ) mesh.name = meshName;

            if ( materialName !== undefined ) {

                material = new THREE.MeshLambertMaterial();
                material.name = materialName;

                mesh.material = material;

            }

        }

        var group = new THREE.Group();
        var object = group;

        var geometry = new THREE.Geometry();
        var material = new THREE.MeshLambertMaterial();
        var mesh = new THREE.Mesh( geometry, material );

        var vertices = [];
        var normals = [];
        var uvs = [];

        function add_face( a, b, c, normals_inds ) {

            if ( normals_inds === undefined ) {

                geometry.faces.push( face3(
                    parseInt( a ) - ( face_offset + 1 ),
                    parseInt( b ) - ( face_offset + 1 ),
                    parseInt( c ) - ( face_offset + 1 )
                ) );

            } else {

                geometry.faces.push( face3(
                    parseInt( a ) - ( face_offset + 1 ),
                    parseInt( b ) - ( face_offset + 1 ),
                    parseInt( c ) - ( face_offset + 1 ),
                    [
                        normals[ parseInt( normals_inds[ 0 ] ) - 1 ].clone(),
                        normals[ parseInt( normals_inds[ 1 ] ) - 1 ].clone(),
                        normals[ parseInt( normals_inds[ 2 ] ) - 1 ].clone()
                    ]
                ) );

            }

        }

        function add_uvs( a, b, c ) {

            geometry.faceVertexUvs[ 0 ].push( [
                uvs[ parseInt( a ) - 1 ].clone(),
                uvs[ parseInt( b ) - 1 ].clone(),
                uvs[ parseInt( c ) - 1 ].clone()
            ] );

        }

        function handle_face_line( faces, uvs, normals_inds ) {

            if ( faces[ 3 ] === undefined ) {

                add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );

                if ( ! ( uvs === undefined ) && uvs.length > 0 ) {

                    add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 2 ] );

                }

            } else {

                if ( ! ( normals_inds === undefined ) && normals_inds.length > 0 ) {

                    add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ] );
                    add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ] );

                } else {

                    add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ] );
                    add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ] );

                }

                if ( ! ( uvs === undefined ) && uvs.length > 0 ) {

                    add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] );
                    add_uvs( uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] );

                }

            }

        }


        // v float float float

        var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // vn float float float

        var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // vt float float

        var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // f vertex vertex vertex ...

        var face_pattern1 = /f( +\d+)( +\d+)( +\d+)( +\d+)?/;

        // f vertex/uv vertex/uv vertex/uv ...

        var face_pattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/;

        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

        var face_pattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/;

        // f vertex//normal vertex//normal vertex//normal ...

        var face_pattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/;

        //

        var lines = data.split( "\n" );

        for ( var i = 0; i < lines.length; i ++ ) {

            var line = lines[ i ];
            line = line.trim();

            var result;

            if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

                continue;

            } else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

                // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                vertices.push( vector(
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] ),
                    parseFloat( result[ 3 ] )
                ) );

            } else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                normals.push( vector(
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] ),
                    parseFloat( result[ 3 ] )
                ) );

            } else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

                // ["vt 0.1 0.2", "0.1", "0.2"]

                uvs.push( uv(
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] )
                ) );

            } else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

                // ["f 1 2 3", "1", "2", "3", undefined]

                handle_face_line( [ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ] );

            } else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

                // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

                handle_face_line(
                    [ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
                    [ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
                );

            } else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

                // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

                handle_face_line(
                    [ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
                    [ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
                    [ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
                );

            } else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

                // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

                handle_face_line(
                    [ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
                    [ ], //uv
                    [ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
                );

            } else if ( /^o /.test( line ) ) {

                // object

                meshN();
                face_offset = face_offset + vertices.length;
                vertices = [];
                object = new THREE.Object3D();
                object.name = line.substring( 2 ).trim();
                group.add( object );

            } else if ( /^g /.test( line ) ) {

                // group

                meshN( line.substring( 2 ).trim(), undefined );

            } else if ( /^usemtl /.test( line ) ) {

                // material

                meshN( undefined, line.substring( 7 ).trim() );

            } else if ( /^mtllib /.test( line ) ) {

                // mtl file

                if ( mtllibCallback ) {

                    var mtlfile = line.substring( 7 );
                    mtlfile = mtlfile.trim();
                    mtllibCallback( mtlfile );

                }

            } else if ( /^s /.test( line ) ) {

                // Smooth shading

            } else {

                console.log( "THREE.OBJMTLLoader: Unhandled line " + line );

            }

        }

        //Add last object
        meshN( undefined, undefined );

        return group;

    }

};
THREE.MTLLoader = function( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};
THREE.MTLLoader.prototype = {

    constructor: THREE.MTLLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var loader = new THREE.XHRLoader( this.manager );
        loader.setCrossOrigin( this.crossOrigin );
        loader.load( url, function ( text ) {

            onLoad( scope.parse( text ) );

        }, onProgress, onError );

    },

    setBaseUrl: function( value ) {

        this.baseUrl = value;

    },

    setCrossOrigin: function ( value ) {

        this.crossOrigin = value;

    },

    setMaterialOptions: function ( value ) {

        this.materialOptions = value;

    },

    /**
     * Parses loaded MTL file
     * @param text - Content of MTL file
     * @return {THREE.MTLLoader.MaterialCreator}
     */
    parse: function ( text ) {

        var lines = text.split( "\n" );
        var info = {};
        var delimiter_pattern = /\s+/;
        var materialsInfo = {};

        for ( var i = 0; i < lines.length; i ++ ) {

            var line = lines[ i ];
            line = line.trim();

            if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

                // Blank line or comment ignore
                continue;

            }

            var pos = line.indexOf( ' ' );

            var key = ( pos >= 0 ) ? line.substring( 0, pos ) : line;
            key = key.toLowerCase();

            var value = ( pos >= 0 ) ? line.substring( pos + 1 ) : "";
            value = value.trim();

            if ( key === "newmtl" ) {

                // New material

                info = { name: value };
                materialsInfo[ value ] = info;

            } else if ( info ) {

                if ( key === "ka" || key === "kd" || key === "ks" ) {

                    var ss = value.split( delimiter_pattern, 3 );
                    info[ key ] = [ parseFloat( ss[ 0 ] ), parseFloat( ss[ 1 ] ), parseFloat( ss[ 2 ] ) ];

                } else {

                    info[ key ] = value;

                }

            }

        }

        var materialCreator = new THREE.MTLLoader.MaterialCreator( this.baseUrl, this.materialOptions );
        materialCreator.setCrossOrigin( this.crossOrigin );
        materialCreator.setManager( this.manager );
        materialCreator.setMaterials( materialsInfo );
        return materialCreator;

    }

};
THREE.MTLLoader.MaterialCreator = function( baseUrl, options ) {

    this.baseUrl = baseUrl;
    this.options = options;
    this.materialsInfo = {};
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};

    this.side = ( this.options && this.options.side ) ? this.options.side : THREE.FrontSide;
    this.wrap = ( this.options && this.options.wrap ) ? this.options.wrap : THREE.RepeatWrapping;

};
THREE.MTLLoader.MaterialCreator.prototype = {

    constructor: THREE.MTLLoader.MaterialCreator,

    setCrossOrigin: function ( value ) {

        this.crossOrigin = value;

    },

    setManager: function ( value ) {

        this.manager = value;

    },

    setMaterials: function( materialsInfo ) {

        this.materialsInfo = this.convert( materialsInfo );
        this.materials = {};
        this.materialsArray = [];
        this.nameLookup = {};

    },

    convert: function( materialsInfo ) {

        if ( ! this.options ) return materialsInfo;

        var converted = {};

        for ( var mn in materialsInfo ) {

            // Convert materials info into normalized form based on options

            var mat = materialsInfo[ mn ];

            var covmat = {};

            converted[ mn ] = covmat;

            for ( var prop in mat ) {

                var save = true;
                var value = mat[ prop ];
                var lprop = prop.toLowerCase();

                switch ( lprop ) {

                    case 'kd':
                    case 'ka':
                    case 'ks':

                        // Diffuse color (color under white light) using RGB values

                        if ( this.options && this.options.normalizeRGB ) {

                            value = [ value[ 0 ] / 255, value[ 1 ] / 255, value[ 2 ] / 255 ];

                        }

                        if ( this.options && this.options.ignoreZeroRGBs ) {

                            if ( value[ 0 ] === 0 && value[ 1 ] === 0 && value[ 1 ] === 0 ) {

                                // ignore

                                save = false;

                            }

                        }

                        break;

                    case 'd':

                        // According to MTL format (http://paulbourke.net/dataformats/mtl/):
                        //   d is dissolve for current material
                        //   factor of 1.0 is fully opaque, a factor of 0 is fully dissolved (completely transparent)

                        if ( this.options && this.options.invertTransparency ) {

                            value = 1 - value;

                        }

                        break;

                    default:

                        break;
                }

                if ( save ) {

                    covmat[ lprop ] = value;

                }

            }

        }

        return converted;

    },

    preload: function () {

        for ( var mn in this.materialsInfo ) {

            this.create( mn );

        }

    },

    getIndex: function( materialName ) {

        return this.nameLookup[ materialName ];

    },

    getAsArray: function() {

        var index = 0;

        for ( var mn in this.materialsInfo ) {

            this.materialsArray[ index ] = this.create( mn );
            this.nameLookup[ mn ] = index;
            index ++;

        }

        return this.materialsArray;

    },

    create: function ( materialName ) {

        if ( this.materials[ materialName ] === undefined ) {

            this.createMaterial_( materialName );

        }

        return this.materials[ materialName ];

    },

    createMaterial_: function ( materialName ) {

        // Create material

        var mat = this.materialsInfo[ materialName ];
        var params = {

            name: materialName,
            side: this.side

        };

        for ( var prop in mat ) {

            var value = mat[ prop ];

            switch ( prop.toLowerCase() ) {

                // Ns is material specular exponent

                case 'kd':

                    // Diffuse color (color under white light) using RGB values

                    params[ 'diffuse' ] = new THREE.Color().fromArray( value );

                    break;

                case 'ka':

                    // Ambient color (color under shadow) using RGB values

                    break;

                case 'ks':

                    // Specular color (color when light is reflected from shiny surface) using RGB values
                    params[ 'specular' ] = new THREE.Color().fromArray( value );

                    break;

                case 'map_kd':

                    // Diffuse texture map

                    params[ 'map' ] = this.loadTexture( this.baseUrl + value );
                    params[ 'map' ].wrapS = this.wrap;
                    params[ 'map' ].wrapT = this.wrap;

                    break;

                case 'ns':

                    // The specular exponent (defines the focus of the specular highlight)
                    // A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

                    params[ 'shininess' ] = value;

                    break;

                case 'd':

                    // According to MTL format (http://paulbourke.net/dataformats/mtl/):
                    //   d is dissolve for current material
                    //   factor of 1.0 is fully opaque, a factor of 0 is fully dissolved (completely transparent)

                    if ( value < 1 ) {

                        params[ 'transparent' ] = true;
                        params[ 'opacity' ] = value;

                    }

                    break;

                case 'map_bump':
                case 'bump':

                    // Bump texture map

                    if ( params[ 'bumpMap' ] ) break; // Avoid loading twice.

                    params[ 'bumpMap' ] = this.loadTexture( this.baseUrl + value );
                    params[ 'bumpMap' ].wrapS = this.wrap;
                    params[ 'bumpMap' ].wrapT = this.wrap;

                    break;

                default:
                    break;

            }

        }

        if ( params[ 'diffuse' ] ) {

            params[ 'color' ] = params[ 'diffuse' ];

        }

        this.materials[ materialName ] = new THREE.MeshPhongMaterial( params );
        return this.materials[ materialName ];

    },


    loadTexture: function ( url, mapping, onLoad, onProgress, onError ) {

        var texture;
        var loader = THREE.Loader.Handlers.get( url );
        var manager = ( this.manager !== undefined ) ? this.manager : THREE.DefaultLoadingManager;

        if ( loader !== null ) {

            texture = loader.load( url, onLoad );

        } else {

            texture = new THREE.Texture();

            loader = new THREE.ImageLoader( manager );
            loader.setCrossOrigin( this.crossOrigin );
            loader.load( url, function ( image ) {

                texture.image = THREE.MTLLoader.ensurePowerOfTwo_( image );
                texture.needsUpdate = true;

                if ( onLoad ) onLoad( texture );

            }, onProgress, onError );

        }

        if ( mapping !== undefined ) texture.mapping = mapping;

        return texture;

    }

};
THREE.MTLLoader.ensurePowerOfTwo_ = function ( image ) {

    if ( ! THREE.Math.isPowerOfTwo( image.width ) || ! THREE.Math.isPowerOfTwo( image.height ) ) {

        var canvas = document.createElement( "canvas" );
        canvas.width = THREE.MTLLoader.nextHighestPowerOfTwo_( image.width );
        canvas.height = THREE.MTLLoader.nextHighestPowerOfTwo_( image.height );

        var ctx = canvas.getContext( "2d" );
        ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );
        return canvas;

    }

    return image;

};
THREE.MTLLoader.nextHighestPowerOfTwo_ = function( x ) {

    -- x;

    for ( var i = 1; i < 32; i <<= 1 ) {

        x = x | x >> i;

    }

    return x + 1;

};
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
    let member={};
    mgr._member=member;
    /**
     * 选择日志
     */
    member._viewerSelectionData=false;
    // region 工区 成员
    /**
     * 工区是否可见
     */
    member._isWorkAreaVisible=false;
    /**
     * 工区句柄数组
     */
    member._workAreaGroup = new THREE.Group();
    member._workAreaGroup.name = "ZhiUTech_WorkAreaGroup";
    member._workAreaGroup.visible = false;
    /**
     * 工区信息面板高度
     */
    member._workAreaMsgPanelHeight = undefined;
    /**
     * 工区盒子偏移
     */
    member._workAreaOffset = undefined;
    /**
     * 工区盒子宽度
     */
    member._workAreaBoxWidth = undefined;
    /**
     * 工区盒子顶部
     */
    member._workAreaBoxTop = undefined;
    /**
     * 工区盒子底部
     */
    member._workAreaBoxBottom = undefined;
    /**
     * 工区主向量出发点
     */
    member._workAreaStartPosition = new THREE.Vector3(-132.088,-380.831,111,816);
    /**
     * 工区主向量结束点
     */
    member._workAreaEndPosition = new THREE.Vector3(103.985,385.053,117.432);
    /**
     * 工区主向量
     */
    member._workAreaMainDirection = _SetZAxisToZero(member._workAreaEndPosition.clone().sub(member._workAreaStartPosition.clone()));
    /**
     * 工区主向量(归一化)
     */
    member._workAreaMainDirectionNormalize = member._workAreaMainDirection.clone().normalize();
    // endregion.
    // region viewer合并的成员
    /**
     * 预定义名称 : 静止场景名称
     */
    member._SCENE_NAME_DEAD="ZhiuViewer_DeadScene";
    /**
     * 预定义名称 : 动态场景名称
     */
    member._SCENE_NAME_LIFE="ZhiuViewer_LifeScene";
    /**
     * 是否开启射线
     */
    member._isOpenRayCast = true;
    /**
     * 3d标注的图片地址
     */
    member._3dPointImagePath = ZHIU_MAINRELATIVEPATH + "zhiu_Resources/Image/RedPoint.png";
    /**
     * 3d标注的网格组
     */
    member._3dPointGroup = undefined;
    /**
     * 3d标注的图片
     */
    member._3dPointImage = undefined;
    /**
     * 射线相机
     */
    member._Camera_Ray = undefined;
    /**
     * 动态追踪用的相机
     */
    member._Camera_Dynamic = undefined;
    /**
     * 相机更新列表
     */
    member._CameraUpdateList = [];
    /**
     * 是否监听点击(用于3d标注)
     */
    member._isListenClick = undefined;
    /**
     * 点击的回调,返回整体信息
     */
    member._clickMsgCallback = undefined;

    // endregion
    // region 广告牌成员
    /**
     * 广告牌组句柄
     */
    member._billboardGroup =undefined;
    // endregion
    // region 多边形成员
    /**
     * 多边形的网格组
     */
    member._polgonGroup = undefined;
    // endregion
    // region TransformController成员
    /**
     * TransformController组件是否开启
     */
    member._isTransformControllerOpen=false;
    /**
     * TransformController组件是否在拖拽中
     */
    member._isTransformControllerDragging=false;
    /**
     * TransformController组件 fragid对照表
     */
    member._transformControllerFragProxyMap=undefined;
    /**
     * TransformController组件 代理物体
     */
    member._transformControllerProxy=undefined;
    /**
     * TransformController组件 控制器
     */
    member._transformController=undefined;
    /**
     * TransformController组件 当前目标句柄
     */
    member._transformControllerTargets=undefined;
    /**
     * TransformController组件 控制器中心点
     */
    member._transformControllerCenter=undefined;
    /**
     * TransformController组件 中心点id对照表
     */
    member._transformControllerCenterDic={};
    /**
     * TransformController组件 当前选中构件ID
     */
    member._transformControllerNowSelectionID=undefined;
    /**
     * TransformController组件 当前选中构件的中心
     */
    member._transformControllerNowSelectionCenter=new THREE.Vector3();
    /**
     * TransformController组件 回调列表
     */
    member._transformControllerCallbackList=[];
    /**
     * TransformController组件 是否目标为外部模型
     */
    member._isTransformControllerFocusOutSideModel=false;

    /**
     * TransformController组件 默认的组件位置
     */
    let _DEFAULT_TRANSFORMCONTROLLER_POSITION=new THREE.Vector3(0,0,-20000);
    // endregion
    // region 坐标转换成员
    let _coordinateTool={};
    member._coordinateTool=_coordinateTool;
    _coordinateTool._viewerReferencePointA=undefined;
    _coordinateTool._viewerReferencePointB=undefined;
    _coordinateTool._wgs84ReferencePointA=undefined;
    _coordinateTool._wgs84ReferencePointB=undefined;
    _coordinateTool._wgs84RatioX=undefined;
    _coordinateTool._wgs84RatioY=undefined;

    _coordinateTool._relativeCoordinateCenterPosition=undefined;
    _coordinateTool._relativeCoordinateXAxisDirectionPosition=undefined;
    _coordinateTool._relativeCoordinateYAxisDirectionPosition=undefined;

    _coordinateTool._centerObject=undefined;
    _coordinateTool._centerChildrenObject=undefined;
    // endregion
    // region OBJ加载工具成员
    let _objLoader={};
    member._objLoader=_objLoader;
    _objLoader._objLoaderGroup=undefined;
    // endregion
    // endregion


    // region Viewer合并过来的公共方法

    /**
     * 添加物体到场景内
     * @function ZhiUTech_ThreeJsMaker  L_AddObject
     * @param {string} sceneName 场景名称
     * @param {THREE.Mesh} obj 需要添加的物体
     * @param {boolean} [isLife] 该参数请确认清楚，不填写为正常使用！ true为加入默认动态场景(用于射线) false为加入默认静态场景(用于展示)
     */
    mgr.L_AddObject= function (sceneName, obj, isLife) {
        if (isLife === undefined) {
            if (_CheckSceneExist(sceneName)) {
                _AddObject(sceneName, obj);
            }
        } else if (isLife) {
            _AddObject(member._SCENE_NAME_LIFE, obj);
        } else {
            _AddObject(member._SCENE_NAME_DEAD, obj);
        }
    };

    /**
     * 从场景中删除物体
     * @function ZhiUTech_ThreeJsMaker  L_DeleteObject
     * @param {string} sceneName 场景名称
     * @param {THREE.Mesh} obj 需要删除的物体
     * @param {boolean} [isLife] 该参数请确认清楚，不填写为正常使用！ true为加入默认动态场景(用于射线) false为加入默认静态场景(用于展示)
     */
    mgr.L_DeleteObject= function (sceneName, obj, isLife) {
        if (isLife === undefined) {
            if (_CheckSceneExist(sceneName)) {
                _DeleteObject(sceneName, obj);
            }
        } else if (isLife) {
            _DeleteObject(member._SCENE_NAME_LIFE, obj);
        } else {
            _DeleteObject(member._SCENE_NAME_DEAD, obj);
        }
    };

    /**
     * 删除场景内所有物体
     * @function ZhiUTech_ThreeJsMaker  L_DeleteAllObject
     * @param {string} sceneName 场景名称
     */
    mgr.L_DeleteAllObject= function (sceneName) {
        _DeleteAllObject(sceneName);
    };

    /**
     * 创建场景
     * @function ZhiUTech_ThreeJsMaker  L_CreateScene
     * @param {string} sceneName 场景名称
     */
    mgr.L_CreateScene= function (sceneName) {
        _CreateScene(sceneName);
    };

    /**
     * 删除场景
     * @function ZhiUTech_ThreeJsMaker  L_DeleteScene
     * @param {string} sceneName 场景名称
     */
    mgr.L_DeleteScene= function (sceneName) {
        _DeleteScene(sceneName);
    };

    /**
     * 刷新场景(仅three场景)
     * @function ZhiUTech_ThreeJsMaker  L_RefreshScene
     */
    mgr. L_RefreshScene= function () {
        _RefreshScene();
    };

    /**
     * 根据场景名称获取场景
     * @function ZhiUTech_ThreeJsMaker  L_GetSceneWithName
     * @param {string} sceneName 场景名称
     * @return {THREE.Scene | undefined} 如果返回undefined 代表未找到
     */
    mgr.L_GetSceneWithName= function (sceneName) {
        return _GetSceneWithName(sceneName);
    };

    /**
     * 开关射线检测
     * @function ZhiUTech_ThreeJsMaker  L_ToggleRaycast
     * @param {boolean} isOpen 是否打开射线检测
     */
    mgr.L_ToggleRaycast= function (isOpen) {
        member._isOpenRayCast = isOpen;
    };

    /**
     * 添加射线检测的回调
     * @function ZhiUTech_ThreeJsMaker  L_AddRaycastListener
     * @param {RaycastAction} raycastAction 射线检测的回调
     */
    mgr.L_AddRaycastListener= function (raycastAction) {
        ZhiUTech_MsgCenter.L_AddListener("射线检测", raycastAction);
    };

    /**
     * (v3.0版本将会弃用,如有疑问请联系开发人员) 获取点击的位置(如果回调内返回undefined,回调将会继续被调用,直到出现有效值)
     * @function ZhiUTech_ThreeJsMaker  L_GetTouchPoint
     * @param {TouchAction} pointCallback 获取点击位置信息的事件
     */
    mgr.L_GetTouchPoint= function (pointCallback = undefined) {
        member._isListenClick = true;
        member._clickMsgCallback = pointCallback;
    };

    /**
     * 创建3d标注
     * @function ZhiUTech_ThreeJsMaker  L_Make3DPoint
     * @param {THREE.Vector3} position 3d标注的位置
     * @param {float} scale 缩放系数 0.1-1 自动限制
     * @param {string} [colorString="(255,0,0)"] 颜色字符串 例: "(255,0,0)"
     * @param {boolean} [isThrough=false] threejs的颜色
     * @return {string} 返回唯一ID
     */
    mgr.L_Make3DPoint= function (position, scale, colorString = "(255,0,0)",isThrough=false) {
        return _Make3DPoint(position, scale, colorString,isThrough);
    };

    /**
     * 删除3d标注
     * @function ZhiUTech_ThreeJsMaker  L_Delete3DPoint
     * @param {string} id 创建时填入的id
     * @return {boolean} 返回是否删除成功
     */
    mgr.L_Delete3DPoint= function (id) {
        return _Delete3DPoint(id);
    };

    /**
     * 删除所有3d标注
     * @function ZhiUTech_ThreeJsMaker  L_DeleteAll3DPoint
     */
    mgr.L_DeleteAll3DPoint= function () {
        _DeleteAll3DPoint();
    };

    /**
     * 设置3d标注可见性
     * @function ZhiUTech_ThreeJsMaker  L_Set3DPointVisible
     * @param {boolean} isShow 是否显示
     */
    mgr.L_Set3DPointVisible=function (isShow) {
        _Set3DPointVisible(isShow);
    };


    // endregion

    // region Viewer合并过来的内部方法

    /**
     * 初始化THREE JS场景
     * @private
     */
    function _Initialize_Scene() {
        mgr.viewer.impl.createOverlayScene(member._SCENE_NAME_LIFE);
        mgr.viewer.impl.createOverlayScene(member._SCENE_NAME_DEAD);
        member._Camera_Ray = mgr.viewer.impl.camera;
        member._Camera_Dynamic = mgr.viewer.autocam.camera;
    }

    /**
     * 初始化3d标注的材质几何
     * @private
     */
    function _Initialize3DPointImage() {
        new THREE.TextureLoader().load(member._3dPointImagePath, function (image) {
            member._3dPointImage = image;
            ZhiUTech_MsgCenter.L_SendMsg("3D标注初始化成功");
        });
    }
    /**
     * 初始化3d标注
     * @private
     */
    function _Initialize3DPoint() {
        member._3dPointGroup = new THREE.Group();
        member._3dPointGroup.name = "_3dPointGroup";
        mgr.viewer.impl.addOverlay(member._SCENE_NAME_LIFE, member._3dPointGroup);
    }

    /**
     * 根据场景名称获取场景
     * @param {string} sceneName 场景名称
     * @return {*} 如果返回undefined 代表未找到
     * @private
     */
    function _GetSceneWithName(sceneName) {
        if (mgr.viewer.impl.overlayScenes.hasOwnProperty(sceneName)) {
            return mgr.viewer.impl.overlayScenes[sceneName].scene;
        } else {
            return undefined;
        }
    }

    /**
     * 查看场景是否存在
     * @param {string} sceneName 场景名称
     * @return {boolean} 场景是否存在
     * @private
     */
    function _CheckSceneExist(sceneName) {
        return mgr.viewer.impl.overlayScenes.hasOwnProperty(sceneName);
    }

    /**
     * 添加物体到场景内
     * @param {string} sceneName 场景名称
     * @param {THREE.Object3D} obj 需要添加的物体
     * @private
     */
    function _AddObject(sceneName, obj) {
        mgr.viewer.impl.addOverlay(sceneName, obj);
    }

    /**
     * 从场景中删除物体
     * @param {string} sceneName 场景名称
     * @param {THREE.Object3D} obj 需要删除的物体
     * @private
     */
    function _DeleteObject(sceneName, obj) {
        mgr.viewer.impl.removeOverlay(sceneName, obj);
    }

    /**
     * 删除场景内所有物体
     * @param {string} sceneName 场景名称
     * @private
     */
    function _DeleteAllObject(sceneName) {
        mgr.viewer.impl.createOverlayScene(sceneName);
    }

    /**
     * 创建场景
     * @param {string} sceneName 场景名称
     * @private
     */
    function _CreateScene(sceneName) {
        mgr.viewer.impl.createOverlayScene(sceneName);
    }

    /**
     * 删除场景
     * @param {string} sceneName 场景名称
     * @private
     */
    function _DeleteScene(sceneName) {
        mgr.viewer.impl.removeOverlayScene(sceneName);
    }

    /**
     * 刷新场景(仅three场景)
     * @param {boolean} [isAll=false] 是否强刷
     * @private
     */
    function _RefreshScene(isAll=false) {
        mgr.viewer.impl.invalidate(isAll, isAll, true);
    }
    /**
     * 场景更新用于刷新场景内组件状态
     * @private
     */
    function _SceneUpdate() {
        mgr.viewer.impl.sceneUpdated(true);
    }
    /**
     * 初始化射线
     * @private
     */
    function _InitializeRaycast() {
        zhiu.viewer.canvas.addEventListener('click', _RaycastAction, true);
    }

    /**
     * 射线检测监听
     * @param {object} event 事件参数
     * @private
     */
    function _RaycastAction(event) {
        if (!member._isOpenRayCast) return;

        let obj = mgr.viewer.impl.overlayScenes[member._SCENE_NAME_LIFE].scene.children;
        let pointerVector = new THREE.Vector3();
        let pointerDir = new THREE.Vector3();
        let ray = new THREE.Raycaster();
        let rect = mgr.viewer.container.getBoundingClientRect();
        let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        if (member._Camera_Ray.isPerspective) {
            pointerVector.set(x, y, 0.5);
            pointerVector.unproject(member._Camera_Ray);
            ray.set(member._Camera_Ray.position, pointerVector.sub(member._Camera_Ray.position).normalize());
        } else {
            pointerVector.set(x, y, -1);
            pointerVector.unproject(member._Camera_Ray);
            pointerDir.set(0, 0, -1);
            ray.set(pointerVector, pointerDir.transformDirection(member._Camera_Ray.matrixWorld));
        }

        let result = ray.intersectObjects(obj, true);
        let viewerTarget = _GetViewerTargetByMouseEvent(event);
        let viewerRayTargetObject=undefined;// viewer物体
        if(viewerTarget!==null){
            viewerRayTargetObject= {
                id: zhiu.L_GetExternalIdsWithDbIds(viewerTarget.dbId),
                name:_GetNameByIdAndModel(viewerTarget.dbId,viewerTarget.model),
                intersectPoint: viewerTarget.intersectPoint,
                type:"viewer",
                _model: viewerTarget.model,
            };
        }
        let rayTargetObject=undefined;// three物体
        if(result.length > 0){
            rayTargetObject= {
                id: result[0].object.name,
                name:result[0].object.name,
                intersectPoint: result[0].point,
                object: result[0].object,
                type: result[0].object._type_LJ,
            };
            if(result[0].object.hasOwnProperty("_billBoardContent_LJ")){
                rayTargetObject.billBoardContent=result[0].object._billBoardContent_LJ;
            }
            if(result[0].object.hasOwnProperty("_isOutSideModel_LJ")){
                rayTargetObject.isOutSideModel=result[0].object._isOutSideModel_LJ;
            }
        }

        // region 计算点击优先
        if(result.length > 0){// 点到了three的东西
            if(viewerTarget!==null){
                let viewerTargetDistance=_GetCameraPosition().distanceTo(viewerTarget.intersectPoint);
                let intersectObjectDistance=_GetCameraPosition().distanceTo(result[0].point);
                if(viewerTargetDistance>intersectObjectDistance){
                    zhiu.L_ClearSelection();
                }else{
                    // 选到viewer的组件喽~~~
                    ZhiUTech_MsgCenter.L_SendMsg("射线检测", viewerRayTargetObject);
                    ZhiUTech_MsgCenter.L_SendMsg("Viewer点击监听", member._viewerSelectionData);
                    return;
                }
            }
            ZhiUTech_MsgCenter.L_SendMsg("射线检测", rayTargetObject);
            ZhiUTech_MsgCenter.L_SendMsg("Viewer点击监听", member._viewerSelectionData);
            if( result[0].object._isOutSideModel_LJ){
                ZhiUTech_MsgCenter.L_SendMsg("OBJ点击监听", result);
            }
        }else{// 没有点到three的东西
            ZhiUTech_MsgCenter.L_SendMsg("Viewer点击监听", member._viewerSelectionData);
            ZhiUTech_MsgCenter.L_SendMsg("射线检测", viewerRayTargetObject);
            ZhiUTech_MsgCenter.L_SendMsg("OBJ点击监听", undefined);
        }
        // endregion
    }

    /**
     * 通过id和模型获取到构件的名称
     * @param {string} dbId 构件id 仅一个
     * @param {object} model 模型句柄
     * @private
     */
    function _GetNameByIdAndModel(dbId,model){
        let data = model.getData().instanceTree.nodeAccess;
        return  data.name(dbId);
    }

    /**
     * 根据相机旋转mesh
     * @param {THREE.Mesh} mesh 相机网格
     * @private
     */
    function _UpdateRotation(mesh) {
        mesh.rotation.x = member._Camera_Ray.rotation.x;
        mesh.rotation.y = member._Camera_Ray.rotation.y;
        mesh.rotation.z = member._Camera_Ray.rotation.z;
    }

    /**
     * 相机刷新旋转
     * @private
     */
    function _MsgCenter_CameraUpdateRotate() {
        RotateAllGroup(member._3dPointGroup);
        RotateAllGroup(member._billboardGroup);
        RotateAllGroup(member._workAreaGroup);

        for (let i = 0; i < member._CameraUpdateList.length; i++) {
            _UpdateRotation(member._CameraUpdateList[i]);
        }
        function RotateAllGroup(group) {
            if (group) {
                if (group.visible) {
                    for (let i = 0; i < group.children.length; i++) {
                        _UpdateRotation(group.children[i]);
                    }
                }
            }
        }
    }

    /**
     * 添加需要刷新的物体(跟随摄像机视角的物体)
     * @param {THREE.Mesh} obj 物体
     * @private
     */
    function _AddUpdateObject(obj) {
        member._CameraUpdateList.push(obj);
    }

    /**
     * 初始化点击事件
     * @private
     */
    function _InitializeClick() {
        window.addEventListener('click', _ClickAction, true);
    }

    /**
     * 获取点击位置及点击信息事件
     * @param {object} event 点击回调参数
     * @private
     */
    function _ClickAction(event) {
        if (member._isListenClick) {
            let what = _GetViewerTargetByMouseEvent(event);
            if (what) {
                member._isListenClick = false;
                if (member._clickMsgCallback) {
                    let result={
                        id:zhiu.L_GetExternalIdsWithDbIds(what.dbId),
                        intersectPoint:what.intersectPoint,
                        model:what.model,
                    };
                    member._clickMsgCallback(result);
                }else{
                    ZhiUTech_MsgCenter.L_SendMsg("错误", "点击位置回调丢失");
                }

            } else {
                member._clickMsgCallback(undefined);
            }
        }
    }

    /**
     * 创建3d标注
     * @param {THREE.Vector3} position 3d标注的位置
     * @param {float} scale 缩放系数 0.1-1 自动限制
     * @param {string} colorString 颜色 例如 "(255,0,0)"
     * @param {boolean} isThrough 是否穿透
     * @return {string} 返回唯一ID
     * @private
     */
    function _Make3DPoint(position, scale, colorString,isThrough) {
        // 新逻辑
        let planeGeometry = new THREE.PlaneBufferGeometry(25, 25);
        let mat = new THREE.MeshBasicMaterial({
            map: member._3dPointImage,
            depthTest: !isThrough,
            transparent: false,
        });
        let obj = new THREE.Mesh(
            planeGeometry,
            mat);
        obj.name = _GetGUID();
        obj.position.set(position.x, position.y, position.z);
        scale = THREE.Math.clamp(scale, 0.1, 1);
        obj.scale.set(scale, scale, scale);
        obj.material.color = new THREE.Color("rgb"+colorString);
        obj._type_LJ="3DPoint";
        member._3dPointGroup.add(obj);
        _UpdateRotation(obj);
        _RefreshScene();
        return obj.name;
    }

    /**
     * 删除3d标注
     * @param {string} id 创建时填入的id
     * @return {boolean} 返回是否删除成功
     * @private
     */
    function _Delete3DPoint(id) {
        if (member._3dPointGroup) {
            for (let i = 0; i < member._3dPointGroup.children.length; i++) {
                if (member._3dPointGroup.children[i].name === id) {
                    member._3dPointGroup.remove(member._3dPointGroup.children[i]);
                    _RefreshScene();
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    /**
     * 删除所有3d标注
     * @private
     */
    function _DeleteAll3DPoint() {
        _DeleteObject(member._SCENE_NAME_LIFE,member._3dPointGroup);
        _Initialize3DPoint();
    }

    /**
     * 设置3d标注可见
     * @param isVisible
     * @private
     */
    function _Set3DPointVisible(isVisible) {
        member._3dPointGroup.visible = isVisible;
    }

    /**
     * 获取GUID
     * @return {string} GUID
     * @private
     */
    function _GetGUID() {
        /**
         * @return {string}
         */
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    /**
     * 获取相机当前位置
     * @return {THREE.Vector3} 相机位置哦
     * @private
     */
    function _GetCameraPosition() {
        return mgr.viewer.getCamera().position;
    }

    /**
     * 检查是否含有中文
     * @param {string} string 字符串
     * @return {boolean} 是否包含
     * @private
     */
    function _CheckContainsChinese(string) {
        let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        return reg.test(string);
    }

    /**
     * 通过鼠标点击事件获取viewer的射线目标
     * @param {object} event 鼠标点击事件
     * @return {object} 拾取到的目标
     * @private
     */
    function _GetViewerTargetByMouseEvent(event) {
        let viewport = mgr.viewer.impl.getCanvasBoundingClientRect();
        let viewerX = event.canvasX || event.clientX - viewport.left;
        let viewerY = event.canvasY || event.clientY - viewport.top;
        return mgr.viewer.clientToWorld(viewerX, viewerY, false);
    }

    _Initialize_Scene();
    _Initialize3DPointImage();
    _Initialize3DPoint();
    _InitializeRaycast();
    _InitializeClick();
    ZhiUTech_MsgCenter.L_AddListener("相机更新", _MsgCenter_CameraUpdateRotate);
    // endregion

    // region 广告牌

    function _InitializeBillboarb() {
        member._billboardGroup = new THREE.Group();
        member._billboardGroup.name = "ZhiUTech_BillboarbGroup";
        _AddObject(member._SCENE_NAME_LIFE,member._billboardGroup);
    }
    function _DeleteBillboarb(id) {
        if (member._billboardGroup) {
            for (let i = 0; i < member._billboardGroup.children.length; i++) {
                if (member._billboardGroup.children[i].name === id) {
                    member._billboardGroup.remove(member._billboardGroup.children[i]);
                    _RefreshScene();
                    return true;
                }
            }
        }
        return false;
    }
    function _DeleteAllBillboarb() {
        _DeleteObject(member._SCENE_NAME_LIFE,member._billboardGroup);
        _InitializeBillboarb();
    }
    function _MakeBillboarb(position,content,isThrough) {
        let width=0;
        for (let i = 0; i < content.length; i++) {
            if(_CheckContainsChinese(content[i])){
                width+=40;
            }else{
                width+=20;
            }
        }

        let map = new THREE.CanvasTexture(_GenerateRoundedRectangle(content,width));
        let geometry = new THREE.PlaneBufferGeometry(width/10 , 5);

        let mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                map: map,
                color: 0xffffff,
                depthTest:!isThrough,

            }));
        mesh.position.copy(position);
        mesh.name = _GetGUID();
        mesh._type_LJ="Billboarb";
        mesh._billBoardContent_LJ=content;
        member._billboardGroup.add(mesh);
        _UpdateRotation(mesh);
        _RefreshScene();
        return mesh.name;

        // 该方法不符合圆角需求...留作备用
        function _GenerateBillboarbSpriteOneRow(content) {
            // let geometry = new THREE.PlaneBufferGeometry(20 , 4);
            let canV = document.createElement('canvas');
            canV.width = 200;
            canV.height = 40;
            let context = canV.getContext('2d');
            context.beginPath();
            context.fillStyle = "#4b484a";
            context.fillRect(0, 0, 200, 40);

            context.beginPath();
            context.font = '40px Microsoft YaHei';
            context.fillStyle = "#ffffff";
            context.fillText(content, 0, 35);

            context.fill();
            context.stroke();


            return canV;

        }

        function _GenerateRoundedRectangle(content,width) {
            let canvas = document.createElement("canvas"); //获取canvas对象
            //设置canvas的宽度和高度
            canvas.width = width;
            canvas.height = 50;
            let context = canvas.getContext("2d"); //获取画布context的上下文环境
            //绘制并填充一个圆角矩形
            fillRoundRect(context, 0, 0, width, 50, 10);
            context.beginPath();
            context.font = '40px monospace';
            context.fillStyle = "#ffffff";
            context.fillText(content, 0, 40);
            return canvas;

            /**
             * 该方法用来绘制一个有填充色的圆角矩形
             *@param cxt:canvas的上下文环境
             *@param x:左上角x轴坐标
             *@param y:左上角y轴坐标
             *@param width:矩形的宽度
             *@param height:矩形的高度
             *@param radius:圆的半径
             */
            function fillRoundRect(cxt, x, y, width, height, radius) {
                //圆的直径必然要小于矩形的宽高
                if (2 * radius > width || 2 * radius > height) { return false; }

                cxt.save();
                cxt.translate(x, y);
                //绘制圆角矩形的各个边
                drawRoundRectPath(cxt, width, height, radius);
                cxt.fillStyle = "#4b484a";
                cxt.fill();
                cxt.restore();
            }
            function drawRoundRectPath(cxt, width, height, radius) {
                cxt.beginPath(0);
                //从右下角顺时针绘制，弧度从0到1/2PI
                cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

                //矩形下边线
                cxt.lineTo(radius, height);

                //左下角圆弧，弧度从1/2PI到PI
                cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

                //矩形左边线
                cxt.lineTo(0, radius);

                //左上角圆弧，弧度从PI到3/2PI
                cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

                //上边线
                cxt.lineTo(width - radius, 0);

                //右上角圆弧
                cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

                //右边线
                cxt.lineTo(width, height - radius);
                cxt.closePath();
            }



        }
    }

    _InitializeBillboarb();
    /**
     * 创建广告牌
     * @function ZhiUTech_ThreeJsMaker  L_MakeBillboarb
     * @param {THREE.Vector3} position 位置
     * @param {string} content 里程碑内容
     * @param {boolean} [isThrough=true] 里程碑内容
     * @return {string} 唯一id
     */
    mgr.L_MakeBillboarb = function (position,content,isThrough=true) {
        return _MakeBillboarb(position,content,isThrough);
    };
    /**
     * 设置广告牌显示隐藏
     * @function ZhiUTech_ThreeJsMaker  L_SetBillboarbVisibility
     * @param {boolean} isShow 是否显示
     */
    mgr.L_SetBillboarbVisibility = function (isShow) {
        if(member._billboardGroup.visible===isShow) return;
        member._billboardGroup.visible=isShow;
        _RefreshScene();
    };
    /**
     * 删除广告牌
     * @function ZhiUTech_ThreeJsMaker  L_DeleteBillboarb
     * @param {string} id 创建时的id
     * @return {boolean} 是否删除成功
     */
    mgr.L_DeleteBillboarb=function (id) {
        return _DeleteBillboarb(id);
    };
    /**
     * 删除所有广告牌
     * @function ZhiUTech_ThreeJsMaker  L_DeleteAllBillboarb
     */
    mgr.L_DeleteAllBillboarb=function () {
        _DeleteAllBillboarb();
    };


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
        let ASubStart = fir.clone().sub(member._workAreaStartPosition.clone());
        let ADot = ASubStart.clone().dot(member._workAreaMainDirectionNormalize.clone());
        let AMultiply = member._workAreaMainDirectionNormalize.clone().multiplyScalar(ADot);
        let v3A = AMultiply.clone().add(member._workAreaStartPosition.clone());

        let BSubStart = sec.clone().sub(member._workAreaStartPosition.clone());
        let BDot = BSubStart.clone().dot(member._workAreaMainDirectionNormalize.clone());
        let BMultiply = member._workAreaMainDirectionNormalize.clone().multiplyScalar(BDot);
        let v3B = BMultiply.clone().add(member._workAreaStartPosition.clone());

        let temp = new Line2DInit(v3A, v3B);
        let lineList = ComputeParallelIn2D(temp, member._workAreaBoxWidth);
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
        let list = _CalculatePoint(data.FirstPos, data.SecondPos,member._workAreaOffset);

        let vertices = [
            new THREE.Vector3(list[0].x, list[0].y, member._workAreaBoxTop),
            new THREE.Vector3(list[1].x, list[1].y, member._workAreaBoxTop),
            new THREE.Vector3(list[2].x, list[2].y, member._workAreaBoxTop),
            new THREE.Vector3(list[3].x, list[3].y, member._workAreaBoxTop),
            new THREE.Vector3(list[0].x, list[0].y, member._workAreaBoxBottom),
            new THREE.Vector3(list[1].x, list[1].y, member._workAreaBoxBottom),
            new THREE.Vector3(list[2].x, list[2].y, member._workAreaBoxBottom),
            new THREE.Vector3(list[3].x, list[3].y, member._workAreaBoxBottom),
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
        centerPos.z = member._workAreaMsgPanelHeight;
        // endregion
        msgPlane.position.set(centerPos.x, centerPos.y, centerPos.z);
        msgPlane.name = data.AreaName;
        group.add(msgPlane);
        // endregion

        _UpdateRotation(msgPlane);
        member._workAreaGroup.add(group);

        return group.uuid;

    }

    // endregion

    // region 外部

    /**
     * 创建工区包围盒及信息面板
     * @function ZhiUTech_ThreeJsMaker  L_MakeWorkArea
     * @param {WorkAreaData} data 工区信息
     * @return {string} 工区的id
     */
    mgr.L_MakeWorkArea = function (data) {

        member._workAreaBoxWidth = data.workAreaBoxWidth?data.workAreaBoxWidth:150;
        member._workAreaBoxTop = data.workAreaBoxTop?data.workAreaBoxTop:150;
        member._workAreaBoxBottom = data.workAreaBoxBottom?data.workAreaBoxBottom:-100;
        member._workAreaMsgPanelHeight = member._workAreaBoxTop+50;
        member._workAreaOffset = data.workAreaOffset?data.workAreaOffset:0;
        _RefreshScene();
        return _BuildArea(data);
    };

    /**
     * 根据id删除工区
     * @function ZhiUTech_ThreeJsMaker  L_DeleteWorkArea
     * @param {string} id 工区的id
     * @return {boolean} 是否删除成功
     */
    mgr.L_DeleteWorkArea=function(id){
        for (let i = 0; i < member._workAreaGroup.children.length; i++) {
            if(member._workAreaGroup.children[i].uuid===id){
                member._workAreaGroup.remove(member._workAreaGroup.children[i]);
                _RefreshScene();
                return true;
            }
        }
        return false;
    };

    /**
     * 设置工区包围盒及信息面板可见
     * @function ZhiUTech_ThreeJsMaker  L_SetWorkAreaVisibility
     * @param {boolean} isShow 是否显示
     */
    mgr.L_SetWorkAreaVisibility = function (isShow) {
        member._workAreaGroup.visible = isShow;
        member._isWorkAreaVisible = isShow;
        _RefreshScene();
    };

    /**
     * 清除所有工区包围盒及信息面板
     * @function ZhiUTech_ThreeJsMaker  L_ClearAllWorkArea
     */
    mgr.L_ClearAllWorkArea = function () {
        _DeleteObject(member._SCENE_NAME_DEAD,member._workAreaGroup);
        member._workAreaGroup = new THREE.Group();
        member._workAreaGroup.name = "ZhiUTech_WorkAreaGroup";
        member._workAreaGroup.visible = member._isWorkAreaVisible;
        _AddObject(member._SCENE_NAME_DEAD,member._workAreaGroup);
    };

    /**
     * 设置主向量
     * @function ZhiUTech_ThreeJsMaker  L_SetMainVector
     * @param {THREE.Vector3} firstVector3 第一个向量
     * @param {THREE.Vector3} secondVector3 第二个向量
     */
    mgr.L_SetMainVector = function (firstVector3, secondVector3) {
        member._workAreaStartPosition = firstVector3;
        member._workAreaEndPosition = secondVector3;
        member._workAreaMainDirection = _SetZAxisToZero(member._workAreaEndPosition.clone().sub(member._workAreaStartPosition.clone()));
        member._workAreaMainDirectionNormalize = member._workAreaMainDirection.clone().normalize();
        let data={};
        data.StartPos=firstVector3.clone();
        data.EndPos=secondVector3.clone();
        ZhiUTech_MsgCenter.L_SendMsg("保存工区主向量",JSON.stringify(data));
    };
    /**
     * 根据日志还原主向量
     * @function ZhiUTech_ThreeJsMaker  L_ReductionMainDirectionByDataString
     * @param {string} data 向量合集 字符串化的V3
     */
    mgr.L_ReductionMainDirectionByDataString = function (data) {
        data=JSON.parse(data);
        let start=new THREE.Vector3(data.StartPos.x,data.StartPos.y,data.StartPos.z);
        let end=new THREE.Vector3(data.EndPos.x,data.EndPos.y,data.EndPos.z);
        member._workAreaStartPosition = start;
        member._workAreaEndPosition = end;
        member._workAreaMainDirection=_SetZAxisToZero(end.clone().sub(start.clone()));
        member._workAreaMainDirectionNormalize = member._workAreaMainDirection.clone().normalize();
    };
    _AddObject(member._SCENE_NAME_DEAD,member._workAreaGroup);
    // endregion

    // endregion

    // region 多边形组件
    function _InitializePolygon() {
        member._polgonGroup = new THREE.Group();
        member._polgonGroup.name = "ZhiUTech_PolygonGrop";
        _AddObject(member._SCENE_NAME_DEAD,member._polgonGroup);
    }
    function _DeletePolygon(id) {
        if (member._polgonGroup) {
            for (let i = 0; i < member._polgonGroup.children.length; i++) {
                if (member._polgonGroup.children[i].name === id) {
                    member._polgonGroup.remove(member._polgonGroup.children[i]);
                    _RefreshScene();
                    return true;
                }
            }
        }
        return false;
    }
    function _DeleteAllPolygon() {
        _DeleteObject(member._SCENE_NAME_DEAD,member._polgonGroup);
        _InitializePolygon();
    }
    function _MakePolygon(points,height,colorString,alpha,isThrough) {
        if(points.length<=2){
            ZhiUTech_MsgCenter.L_SendMsg("错误", "绘制多边形数据错误,点位长度低于2个无法形成面");
            return;
        }
        // region 1.找到最小y值点作为A点
        let newPoints=[...points];
        let aPoint=new THREE.Vector3(0,Number.MAX_VALUE,0);
        let aPointIndex=0;
        for (let i = 0; i < points.length; i++) {
            if(height!==undefined){
                points[i].z=height;
            }

            if(aPoint.y>points[i].y){
                aPoint=points[i].clone();
                aPointIndex=i;
            }
        }
        newPoints.splice(aPointIndex,1);
        // endregion
        // region 2.找到最左侧的另外一个点
        let yAxis=new THREE.Vector3(0,1,0);
        let angle=180;
        let dicArray=[];
        let indexArray=[];
        for (let i = 0; i < newPoints.length; i++) {
            let edge=newPoints[i].clone().sub(aPoint);
            let temp=THREE.Math.radToDeg(edge.angleTo(yAxis));
            // 修正点位正负
            if(newPoints[i].x<aPoint.x){
                temp=-temp;
            }
            dicArray[temp]=newPoints[i];
            indexArray.push( temp);
            if(angle>temp){
                angle=temp;
            }
        }
        // endregion
        // region 3.进行点位排序
        let result=[aPoint];
        indexArray=indexArray.sort((a,b)=>{return a-b});
        for (let i = 0; i < indexArray.length; i++) {
            result.push(dicArray[indexArray[i]]);
        }
        // endregion
        // region 4.创建多边形的geometry
        let faces=[];
        // region 单点相连
        for (let i = 1; i < result.length-1; i++) {
            faces.push(new THREE.Face3(0 ,i,i+1));
        }
        // region 补齐凸包
        for (let i = 1; i < result.length-2; i++) {
            let disA=result[0].distanceTo(result[i]);
            let disB=result[0].distanceTo(result[i+1]);
            let disC=result[0].distanceTo(result[i+2]);
            if(disB<disA&&disB<disC){
                faces.push(new THREE.Face3(i,i+1,i+2));
            }
        }
        // endregion
        // endregion

        //endregion
        let mesh= _BuildMesh(result,faces);
        mesh.name=_GetGUID();
        mesh._type_LJ="Polygon";
        member._polgonGroup.add(mesh);
        _RefreshScene();
        return mesh.name;

        function _BuildMesh(vertices,faces) {
            let geom = new THREE.Geometry();
            geom.vertices = vertices;
            geom.faces = faces;
            geom.computeFaceNormals();
            let material= new THREE.MeshBasicMaterial({
                color: "rgb"+colorString,
                side:THREE.DoubleSide,
                depthTest:!isThrough,
            });
            if(alpha!==undefined){
                material.transparent=true;
                material.opacity=alpha;
            }
            return new THREE.Mesh(geom, material);
        }
    }
    _InitializePolygon();
    /**
     * 创建多边形
     * @function ZhiUTech_ThreeJsMaker  L_MakePolygon
     * @param {THREE.Vector3[]} points 点位数组,切记一定要大于2,否则将不能形成平面
     * @param {number} [height=undefined] 如果填写undefined平面高度完全依照点位高度,填写具体高度后该多边形将会成为平面
     * @param {string} [colorString="(128,128,0)"] 颜色字符串 例: "(128,128,0)"
     * @param {float} [alpha=undefined] 0-1透明值
     * @param {boolean} [isThrough=false] 是否穿透
     * @return {string} 用于删除时的ID
     */
    mgr.L_MakePolygon=function (points, height = undefined, colorString = "(128,128,0)",alpha=undefined,isThrough=false) {
        return _MakePolygon(points,height,colorString,alpha===undefined&&alpha===1.0?undefined:alpha,isThrough);
    };
    /**
     * 设置多边形是否可见
     * @function ZhiUTech_ThreeJsMaker  L_SetPolygonVisible
     * @param {boolean} isShow 可见性
     */
    mgr.L_SetPolygonVisible=function(isShow){
        if(member._polgonGroup.visible===isShow) return;
        member._polgonGroup.visible=isShow;
        _RefreshScene();
    };
    /**
     * 删除多边形
     * @function ZhiUTech_ThreeJsMaker  L_DeletePolygon
     * @param {string} id 创建时的id
     * @return {boolean} 是否删除成功
     */
    mgr.L_DeletePolygon=function (id) {
        return _DeletePolygon(id);
    };
    /**
     * 删除所有多边形
     * @function ZhiUTech_ThreeJsMaker  L_DeleteAllPolygon
     */
    mgr.L_DeleteAllPolygon=function () {
        _DeleteAllPolygon();
    };


    function _TestPolygonCollision(position,polygon){
        if(polygon.geometry.boundingBox===undefined||polygon.geometry.boundingBox===null){
            polygon.geometry.boundingBox=new THREE.Box3().setFromObject(polygon);
        }

        let threshold=0.0000000000001;

        // region 排查包围盒以便减少运算量
        if(!_TestBox(position,polygon.geometry.boundingBox)){
            return false;
        }
        // endregion

        let points=polygon.geometry.vertices;// 所有顶点
        let faces=polygon.geometry.faces;// 所有顶点

        // region 看看是不是距离点特别近...
        for (let i = 0; i < points.length; i++) {
            // 如果出现点距离小于阈值直接判定为已碰撞
            if(position.distanceTo(points[i])<threshold) return true;
        }
        // endregion
        // region 排查三角形
        for (let i = 0; i < faces.length; i++) {
            let triangle=[
                points[faces[i].a],
                points[faces[i].b],
                points[faces[i].c],
            ];
            if(_TestTriangle(position,triangle)){
                return true;
            }
        }
        return false;
        // endregion

        // 检测包围盒
        function _TestBox(point,box) {
            return point.x >= box.min.x && point.x <= box.max.x &&
                point.y >= box.min.y && point.y <= box.max.y &&
                point.z >= box.min.z && point.z <= box.max.z;
        }
        // 检测三角形
        function _TestTriangle(point,triangle) {
            triangle=[
                triangle[0].clone(),
                triangle[1].clone(),
                triangle[2].clone(),
            ];
            for (let i = 0; i < triangle.length; i++) {
                triangle[i].z=0;
            }
            point=point.clone();
            point.z=0;
            return _CheckSide(triangle[0],triangle[1],triangle[2],point)&&
                _CheckSide(triangle[1],triangle[2],triangle[0],point)&&
                _CheckSide(triangle[2],triangle[0],triangle[1],point);

            function _GetVertical(a,b,point) {
                let ab=b.clone().sub(a);
                let ad=point.clone().sub(a);
                let ae=ad.clone().projectOnVector(ab);
                let ed=ad.clone().sub(ae);
                return ed;
            }
            function _CheckDirection(vectorA, vectorB) {
                let norA=vectorA.clone().normalize();
                let norB=vectorB.clone().normalize();
                return norA.distanceTo(norB)<threshold;
            }
            function _CheckSide(a, b,c,point) {
                let ed=_GetVertical(a,b,point);
                let fc=_GetVertical(a,b,c);
                return _CheckDirection(ed,fc)&&ed.length()<fc.length();
            }
        }
    }
    /**
     * 检测多变形碰撞 (如果传入的id未找到多边形将返回false)
     * @function ZhiUTech_ThreeJsMaker  L_TestPolygonCollision
     * @param {THREE.Vector3} point 需要检测的点
     * @param {string} polygonId 多边形的唯一id
     * @return {boolean} 是否碰撞
     */
    mgr.L_TestPolygonCollision=function (point,polygonId) {
        for (let i = 0; i < member._polgonGroup.children.length; i++) {
            if(member._polgonGroup.children[i].name===polygonId)
                return _TestPolygonCollision(point,member._polgonGroup.children[i]);
        }
        return false;
    };

    // endregion

    // region TransformController组件
    function _InitializeTransformController(){
        // 创建代理物体
        let geometry=new THREE.CubeGeometry(0.1,0.1,0.1);
        let material=new THREE.MeshBasicMaterial({color:"#6699ff"});
        member._transformControllerProxy=new THREE.Mesh(geometry,material);
        member._transformControllerProxy.position.copy(_DEFAULT_TRANSFORMCONTROLLER_POSITION);
        member._transformControllerProxy.visible=false;

        // 将物体添加至场景
        _AddObject(member._SCENE_NAME_DEAD, member._transformControllerProxy);
        // 协程获取物体
        let index=setInterval(()=>{
            if(THREE.TransformControls){
                // 创建ctrl
                member._transformController=new THREE.TransformControls(mgr.viewer.impl.camera,mgr.viewer.impl.canvas,"translate");
                // 将ctrl放入场景
                mgr.viewer.impl.addOverlay(member._SCENE_NAME_DEAD, member._transformController);
                // 将ctrl绑定物体
                member._transformController.attach(member._transformControllerProxy);
                member._transformController.position.copy(_DEFAULT_TRANSFORMCONTROLLER_POSITION);
                // mgr.viewer.addEventListener(ZhiUTech.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, _onSelectionChanged);
                mgr.viewer.addEventListener(ZhiUTech.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, arg=>{
                    member._viewerSelectionData=arg;
                });
                ZhiUTech_MsgCenter.L_AddListener("OBJ点击监听", _OnOutSideModelSelectionChanged);
                ZhiUTech_MsgCenter.L_AddListener("Viewer点击监听", _onSelectionChanged);
                zhiu.TransformController=mgr;
                mgr.viewer.canvas.onmousemove=_handleMouseMove;
                mgr.viewer.canvas.onmousedown=_handleButtonDown;
                mgr.viewer.canvas.onmouseup=_handleButtonUp;
                clearInterval(index);
            }
        },100);

        function _OnOutSideModelSelectionChanged(event) {
            if(!member._isTransformControllerOpen||event===undefined) {
                member._isTransformControllerFocusOutSideModel=false;
                return;
            }

            if(event.length>0){
                if(event[0].object.name===member._transformControllerNowSelectionID) return;
                _SaveCenter();
                let id=event[0].object.name;
                let isMultiple=false;
                for (let i = 1; i < event.length; i++) {
                    if(event[i].object.name!==id){
                        isMultiple=true;
                        break;
                    }
                }
                if(isMultiple){
                    ZhiUTech_MsgCenter.L_SendMsg("警告", "当前版本不支持多选移动");
                }else{
                    // 开启拖拽组件

                    member._isTransformControllerFocusOutSideModel=true;

                    member._transformControllerNowSelectionID=event[0].object.name;
                    // 寻找是否存在旧的中心点
                    if(member._transformControllerCenterDic.hasOwnProperty(member._transformControllerNowSelectionID)){
                        member._transformControllerProxy.position.copy(member._transformControllerCenterDic[member._transformControllerNowSelectionID]);
                        member._transformControllerCenter.copy(member._transformControllerCenterDic[member._transformControllerNowSelectionID]);
                        member._transformControllerNowSelectionCenter.copy(member._transformControllerCenterDic[member._transformControllerNowSelectionID]);
                    }else{
                        member._transformControllerCenter= new THREE.Vector3();
                        member._transformControllerCenter.copy(event[0].object._root_LJ.position);
                        member._transformControllerProxy.position.copy(member._transformControllerCenter);
                        member._transformControllerNowSelectionCenter.copy(member._transformControllerCenter);
                    }
                    member._transformController.update();
                    member._transformControllerFragProxyMap=event[0].object._root_LJ;

                    return;
                }
            }else{
                // 清空选中
            }
            member._isTransformControllerFocusOutSideModel=false;
            _RefreshSelection();
        }
        // 构件更换选中回调
        function _onSelectionChanged(arg) {
            if(!member._isTransformControllerOpen) {
                member._isTransformControllerFocusOutSideModel=false;// 关闭外部模型选中状态
                return;
            }
            _SaveCenter();

            member._transformControllerTargets=arg.selections;

            if(member._transformControllerTargets===undefined) return;

            if(member._transformControllerTargets.length===0){
                _RefreshSelection();
            }else if(member._transformControllerTargets.length>1||member._transformControllerTargets[0].dbIdArray.length>1){
                ZhiUTech_MsgCenter.L_SendMsg("警告", "当前版本不支持多选移动");
                _RefreshSelection();

                // member._transformControllerFragProxyMap={};
                // let centers=[];
                // for (let i = 0; i < member._transformControllerTargets.length; i++) {
                //     for (let j = 0; j < member._transformControllerTargets[i].dbIdArray.length; j++) {
                //         centers.push(
                //             _getBoundingBox(member._transformControllerTargets[i].dbIdArray[j],member._transformControllerTargets[i].model));
                //     }
                // }
                // member._transformControllerCenter=_GetCenterPositionByBoundingBox(_mergeBoundingBox(centers));
                // member._transformControllerProxy.position.copy(member._transformControllerCenter);
                // member._transformController.update();
                //
                // for (let i = 0; i < member._transformControllerTargets.length; i++) {
                //     for (let j = 0; j < member._transformControllerTargets[i].fragIdsArray.length; j++) {
                //
                //         let fragProxy = mgr.viewer.impl.getFragmentProxy(
                //             member._transformControllerTargets[i].model,member._transformControllerTargets[i].fragIdsArray[j]);
                //         fragProxy.getAnimTransform()
                //
                //         fragProxy.offset = {
                //             x: member._transformControllerCenter.x - fragProxy.position.x,
                //             y: member._transformControllerCenter.y - fragProxy.position.y,
                //             z: member._transformControllerCenter.z - fragProxy.position.z
                //         };
                //
                //
                //         member._transformControllerFragProxyMap[member._transformControllerTargets[i].fragIdsArray[j]] = fragProxy
                //     }
                // }
            }else{


                if(zhiu.L_DbIdToExternalIdDic[0][member._transformControllerTargets[0].dbIdArray[0]]===member._transformControllerNowSelectionID) return;

                // 刷新当前ID
                member._transformControllerNowSelectionID=zhiu.L_DbIdToExternalIdDic[0][member._transformControllerTargets[0].dbIdArray[0]];
                // 清空map
                member._transformControllerFragProxyMap={};

                // 寻找是否存在旧的中心点
                if(member._transformControllerCenterDic.hasOwnProperty(member._transformControllerNowSelectionID)&&
                    !member._transformControllerCenterDic[member._transformControllerNowSelectionID].equals(new THREE.Vector3())){
                    member._transformControllerProxy.position.copy(member._transformControllerCenterDic[member._transformControllerNowSelectionID]);
                    member._transformControllerCenter.copy(member._transformControllerCenterDic[member._transformControllerNowSelectionID]);
                    member._transformControllerNowSelectionCenter.copy(member._transformControllerCenterDic[member._transformControllerNowSelectionID]);
                }else{
                    member._transformControllerCenter=_GetCenterPositionByBoundingBox(
                        _getBoundingBox(member._transformControllerTargets[0].dbIdArray[0],member._transformControllerTargets[0].model)
                    );
                    member._transformControllerProxy.position.copy(member._transformControllerCenter);
                    member._transformControllerNowSelectionCenter.copy(member._transformControllerCenter);
                }
                member._transformController.update();

                for (let i = 0; i < member._transformControllerTargets.length; i++) {
                    for (let j = 0; j < member._transformControllerTargets[i].fragIdsArray.length; j++) {
                        let fragProxy=_GetFragProxy(member._transformControllerTargets[i].fragIdsArray[j],member._transformControllerTargets[i].model);

                        fragProxy.offset = {
                            x: member._transformControllerCenter.x - fragProxy.position.x,
                            y: member._transformControllerCenter.y - fragProxy.position.y,
                            z: member._transformControllerCenter.z - fragProxy.position.z
                        };


                        member._transformControllerFragProxyMap[member._transformControllerTargets[i].fragIdsArray[j]] = fragProxy
                    }
                }

            }

        }
        function _handleButtonDown(event) {
            if(!member._isTransformControllerOpen) {
                return;
            }

            if (member._transformController.onPointerDown(event)){
                member._isTransformControllerDragging = true;
                mgr.viewer.setNavigationLock(true);
                return true;
            }

            mgr.viewer.setNavigationLock(false);
            // var hitPoint = this.getHitPoint(event)
            //
            // if (hitPoint) {
            //
            //     this._translation = new THREE.Vector3()
            //     this._hitPoint.copy(hitPoint)
            // }

            return false;
        }
        function _handleButtonUp(event) {
            if(!member._isTransformControllerOpen) {
                return;
            }
            if(!member._isTransformControllerOpen&&!member._isTransformControllerDragging) return;

            if(member._transformControllerNowSelectionID!==undefined){
                let msg={
                    id:member._transformControllerNowSelectionID,
                    position:member._transformControllerNowSelectionCenter,
                    state:"move",
                };
                _DoCallback(msg);
            }


            // region 记录数据
            let target=zhiu.L_GetNowSelectionId();
            if(target.length===1||member._isTransformControllerFocusOutSideModel){
                _SaveCenter();
            }else{
                _RefreshSelection();
            }
            // endregion



            mgr.viewer.setNavigationLock(false);
            mgr.viewer.impl.invalidate(true,true,true);
            member._isTransformControllerDragging = false;
            if (member._transformController.onPointerUp(event)){
                console.warn(" >LJason< 警告：这里是松手???");
                // fragProxy._transformControllerCenter=member._transformControllerCenter;
                return true;
            }

            return false;
        }
        function _handleMouseMove(event) {

            if (member._isTransformControllerDragging) {

                if (member._transformController.onPointerMove(event)) {
                    if(member._isTransformControllerFocusOutSideModel){
                        member._transformControllerFragProxyMap.position.copy(member._transformControllerProxy.position);
                    }else{
                        for (let fragId in member._transformControllerFragProxyMap) {

                            let fragProxy = member._transformControllerFragProxyMap[fragId];
                            fragProxy.position = new THREE.Vector3(
                                member._transformControllerProxy.position.x - fragProxy.offset.x,
                                member._transformControllerProxy.position.y - fragProxy.offset.y,
                                member._transformControllerProxy.position.z - fragProxy.offset.z);
                            fragProxy.updateAnimTransform();
                        }
                    }
                    _SceneUpdate();
                    member._transformControllerNowSelectionCenter.copy(member._transformControllerProxy.position);
                    return true;
                }

                return false;
            }

            if (member._transformController.onPointerHover(event)){
                // console.log(" >LJason< 日志：这是滑过????....");
                return true;
            }

            return false;
        }
        function _mergeBoundingBox(bboxArray) {
            let min=bboxArray[0].min;
            let max=bboxArray[0].max;
            for (let i = 1; i < bboxArray.length; i++) {
                min.min(bboxArray[i].min);
                max.max(bboxArray[i].max);
            }
            return {min,max};
        }
        function _RefreshSelection() {
            member._transformControllerNowSelectionID=undefined;
            member._transformControllerTargets=undefined;
            member._transformControllerFragProxyMap={};
            member._transformControllerNowSelectionCenter.set(0,0,0);
            member._transformControllerProxy.position.copy(_DEFAULT_TRANSFORMCONTROLLER_POSITION);
            member._transformController.position.copy(_DEFAULT_TRANSFORMCONTROLLER_POSITION);
        }
        function _SaveCenter() {
            if(member._transformControllerNowSelectionID===undefined) return;
            if(!member._transformControllerCenterDic.hasOwnProperty(member._transformControllerNowSelectionID)){
                member._transformControllerCenterDic[member._transformControllerNowSelectionID]=new THREE.Vector3();
            }
            member._transformControllerCenterDic[member._transformControllerNowSelectionID].copy(member._transformControllerNowSelectionCenter);
        }
        function _DoCallback(msg) {
            for (let i = 0; i < member._transformControllerCallbackList.length; i++) {
                member._transformControllerCallbackList[i](msg);
            }
        }
    }
    function _RecoveryTranformControllerById (id,center){
        if(id==="undefined") return;
        let model,tempId;
        for(let key in zhiu.L_ExternalIdToDbIdDic){
            if(zhiu.L_ExternalIdToDbIdDic[key].hasOwnProperty(id)){
                model=zhiu.zhiu_GetModelWithModelIndex(parseInt(key));
                tempId=zhiu.L_ExternalIdToDbIdDic[key][id];
                break;
            }
        }
        if(tempId===undefined){
            return;
        }
        _GetFragId(tempId,model,id=>{
            let fragProxy=_GetFragProxy(id,model);


            let centerPosition=_GetCenterPositionByBoundingBox(
                _getBoundingBox(tempId,model)
            );
            // 获取偏移
            fragProxy.offset = {
                x: centerPosition.x - fragProxy.position.x,
                y: centerPosition.y - fragProxy.position.y,
                z: centerPosition.z - fragProxy.position.z
            };
            // 使用偏移得到位置
            fragProxy.position = new THREE.Vector3(
                center.x - fragProxy.offset.x,
                center.y - fragProxy.offset.y,
                center.z - fragProxy.offset.z);

            fragProxy.updateAnimTransform();
            _SceneUpdate();
        });
    }
    function _GetFragId(id,model,callback){
        let tree = model.getData().instanceTree;
        tree.enumNodeFragments(id, function (arg) {
            callback(arg);
        }, false);
    }
    function _GetFragProxy(id,model){
        let fragProxy=mgr.viewer.impl.getFragmentProxy(model, id);
        fragProxy.getAnimTransform();
        return fragProxy;
    }
    function _GetCenterPositionByBoundingBox(bbox){
        return new THREE.Vector3(
            (bbox.max.x - bbox.min.x) / 2 + bbox.min.x,
            (bbox.max.y - bbox.min.y) / 2 + bbox.min.y,
            (bbox.max.z - bbox.min.z) / 2 + bbox.min.z
        );
    }
    function _getBoundingBox(id,model) {
        let bbox={};
        let tree = model.getData().instanceTree;
        let tmpBox = new Float32Array(6);
        tree.getNodeBox(id, tmpBox);
        bbox.min = new THREE.Vector3(tmpBox[0], tmpBox[1], tmpBox[2]);
        bbox.max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);
        return bbox;
    }
    _InitializeTransformController();
    /**
     * 开关TransformController组件
     * @function ZhiUTech_ThreeJsMaker  L_ToggleTransformController
     * @param {boolean} isOpen 是否开启
     */
    mgr.L_ToggleTransformController=function (isOpen) {
        if(member._isTransformControllerOpen===isOpen) return;
        member._transformControllerFragProxyMap={};
        member._isTransformControllerOpen=isOpen;
        if(isOpen){

        }else{
            member._transformControllerProxy.position.copy(_DEFAULT_TRANSFORMCONTROLLER_POSITION);
            member._transformController.position.copy(_DEFAULT_TRANSFORMCONTROLLER_POSITION);
        }
        _RefreshScene();
    };
    /**
     * 获取TransformController的位移资料
     * @function ZhiUTech_ThreeJsMaker  L_GetTransformControllerData
     * @return {string} 资料
     */
    mgr.L_GetTransformControllerData=function () {
        return JSON.stringify(member._transformControllerCenterDic);
    };
    /**
     * 还原TransformController的位移资料
     * @function ZhiUTech_ThreeJsMaker  L_RecoveryTransformControllerData
     * @param {string} data 资料信息
     */
    mgr.L_RecoveryTransformControllerData=function (data) {
        data=JSON.parse(data);
        for(let key in data){
            member._transformControllerCenterDic[key]=new THREE.Vector3(data[key].x,data[key].y,data[key].z);
        }
        for(let key in member._transformControllerCenterDic){
            _RecoveryTranformControllerById(key,member._transformControllerCenterDic[key]);
        }
        member._transformControllerCenter=new THREE.Vector3();
    };
    /**
     * TransformController 添加变更后的监听
     * @function ZhiUTech_ThreeJsMaker  L_OnTransformControllerChanged
     * @param {function} callback 状态改变后的回调
     */
    mgr.L_OnTransformControllerChanged=function (callback) {
        member._transformControllerCallbackList.push(callback);
    };
    // endregion

    // region 坐标转换工具
    function _SetWGS84ReferencePoint(viewerReferencePointA,viewerReferencePointB,wgs84ReferencePointA,wgs84ReferencePointB) {
        _coordinateTool._viewerReferencePointA=viewerReferencePointA;
        _coordinateTool._viewerReferencePointB=viewerReferencePointB;
        _coordinateTool._wgs84ReferencePointA=wgs84ReferencePointA;
        _coordinateTool._wgs84ReferencePointB=wgs84ReferencePointB;

        _coordinateTool._wgs84RatioX= (_coordinateTool._wgs84ReferencePointA.J - _coordinateTool._wgs84ReferencePointB.J) /
            (_coordinateTool._viewerReferencePointA.x - _coordinateTool._viewerReferencePointB.x);
        _coordinateTool._wgs84RatioY=(_coordinateTool._wgs84ReferencePointA.W - _coordinateTool._wgs84ReferencePointB.W) /
            (_coordinateTool._viewerReferencePointA.y - _coordinateTool._viewerReferencePointB.y);
    }
    function _WGS84ToViewerCoordinate(targetWgs84, altitude){
        let x = _coordinateTool._viewerReferencePointA.x -
            (_coordinateTool._wgs84ReferencePointA.J - targetWgs84.J) / _coordinateTool._wgs84RatioX;
        let y = _coordinateTool._viewerReferencePointA.y -
            (_coordinateTool._wgs84ReferencePointA.W - targetWgs84.W) / _coordinateTool._wgs84RatioY;

        return new THREE.Vector3(x, y, altitude);
    }
    /**
     * 将wgs84坐标转换为viewer坐标
     * @function ZhiUTech_ThreeJsMaker  L_WGS84ToViewerCoordinate
     * @param {object} targetWgs84  wgs84坐标 请注意最少提供6位的经纬度(分米级)  示例: {J:105.61569101,W:38.75534341}
     * @param {float} [altitude=0] 高度 可直接填入高度
     * @return {THREE.Vector3} viewer内的坐标
     */
    mgr.L_WGS84ToViewerCoordinate =function(targetWgs84, altitude = 0) {
        if(_coordinateTool._wgs84RatioX===undefined||_coordinateTool._wgs84RatioY===undefined){
            ZhiUTech_MsgCenter.L_SendMsg("警告", "坐标转换失败,未找到wgs84比例数据");
            return undefined;
        }
        return _WGS84ToViewerCoordinate(targetWgs84, altitude);
    };
    /**
     * 设置WGS84的参考点
     * @function ZhiUTech_ThreeJsMaker  L_SetWGS84ReferencePoint
     * @param {THREE.Vector3} viewerReferencePointA  viewer参考点A
     * @param {THREE.Vector3} viewerReferencePointB  viewer参考点B
     * @param {object} wgs84ReferencePointA  wgs84坐标 请注意最少提供6位的经纬度 示例: {J:105.61569101,W:38.75534341}
     * @param {object} wgs84ReferencePointB  wgs84坐标 请注意最少提供6位的经纬度 示例: {J:105.61569101,W:38.75534341}
     */
    mgr.L_SetWGS84ReferencePoint =function(viewerReferencePointA,viewerReferencePointB,wgs84ReferencePointA,wgs84ReferencePointB) {
        _SetWGS84ReferencePoint(viewerReferencePointA,viewerReferencePointB,wgs84ReferencePointA,wgs84ReferencePointB);
    };

    // 不能包含全部情况,暂时遗弃
    function _RelativeCoordinateToViewerCoordinate_Obsolete(relativePosition){
        let result;
        let o1=new THREE.Vector3();
        let o2=_coordinateTool._relativeCoordinateCenterPosition.clone();
        let o2Center=new THREE.Vector3();
        let x2=_coordinateTool._relativeCoordinateXAxisDirectionPosition.clone();
        let p=relativePosition.clone();


        let x2AxisNormalizeVector=x2.clone().sub(o2).clone().normalize();// x2的方向标量
        let x2AxisDistancex1AxisAngle=x2AxisNormalizeVector.angleTo(new THREE.Vector3(1,0,0));// 两个x轴的相差角度
        let needToRotate=Math.PI*2-x2AxisDistancex1AxisAngle;// 需要补上的旋转值

        // 1.O2O1 长度
        let o2o1Length=o1.distanceTo(o2);
        console.error(" >LJason< 错误：o2o1Length ",o2o1Length);

        // 2.O2P 长度
        let o2pLength=o2Center.distanceTo(p);
        console.error(" >LJason< 错误：o2pLength ",o2pLength);

        // 3.∠PO2O1 角度
        let o2pNormallizeVector=p.clone().sub(o2Center).normalize();
        // console.log(" >LJason< 日志：o2pNormallizeVector",o2pNormallizeVector);
        _RotateVector3ByZAxis(o2pNormallizeVector,needToRotate);
        // console.log(" >LJason< 日志：o2pNormallizeVector11111",o2pNormallizeVector);
        let o2o1NormallizeVector=o1.clone().sub(o2).normalize();
        // console.log(" >LJason< 日志：o2o1NormallizeVector",o2o1NormallizeVector);
        let po2o1Angle=o2pNormallizeVector.angleTo(o2o1NormallizeVector);

        console.error(" >LJason< 错误：po2o1Angle ",THREE.Math.radToDeg(po2o1Angle));

        // 4.O1P长度
        let o1pLength=Math.sqrt(
            Math.pow(o2pLength,2)+Math.pow(o2o1Length,2)-
            (2*o2pLength*o2o1Length*Math.cos(po2o1Angle))
        );
        console.error(" >LJason< 错误：o1pLength ",o1pLength);

        // 5.∠Y1O1P 角度
        let po1o2Angle=Math.acos(
            (Math.pow(o1pLength,2)+Math.pow(o2o1Length,2)-Math.pow(o2pLength,2))
            /(2*o1pLength*o2o1Length)
        );
        console.warn(" >LJason< 警告：po1o2Angle",THREE.Math.radToDeg(po1o2Angle));

        let c=new THREE.Vector3(o2.x,0,0);
        let o2cLength=o2.distanceTo(c);
        let o1cLength=o1.distanceTo(c);
        let co1o2Angle=Math.acos(
            (Math.pow(o1cLength,2)+Math.pow(o2o1Length,2)-Math.pow(o2cLength,2))
            /(2*o1cLength*o2o1Length)
        );
        console.warn(" >LJason< 警告：co1o2Angle",THREE.Math.radToDeg(co1o2Angle));


        let y1o1pAngle=Math.PI/2-co1o2Angle-po1o2Angle;
        console.error(" >LJason< 错误：y1o1pAngle ",THREE.Math.radToDeg(y1o1pAngle));

        // 6.坐标值
        result=new THREE.Vector3();
        result.x=o1pLength * Math.sin(y1o1pAngle);
        result.y=o1pLength * Math.cos(y1o1pAngle);


        // 7.寻找正负坐标
        let v1=new THREE.Vector3(result.x,result.y,0);
        let v2=new THREE.Vector3(-result.x,-result.y,0);
        let v3=new THREE.Vector3(-result.x,result.y,0);
        let v4=new THREE.Vector3(result.x,-result.y,0);

        console.log(" >LJason< 日志：v1",v1.distanceTo(o2));
        console.log(" >LJason< 日志：v2",v2.distanceTo(o2));
        console.log(" >LJason< 日志：v3",v3.distanceTo(o2));
        console.log(" >LJason< 日志：v4",v4.distanceTo(o2));

        return result;

        // 围绕z轴旋转
        function _RotateVector3ByZAxis(vector3,angle) {
            vector3.set(vector3.x*Math.cos(angle)-vector3.y*Math.sin(angle),
                vector3.x*Math.sin(angle)+vector3.y*Math.cos(angle),
                0);
        }

    }

    /**
     * 设置相对坐标系
     * @param {THREE.Vector3} centerPosition 原点坐标
     * @param {THREE.Vector3} xAxisDirectionPosition x轴方向坐标
     * @param {THREE.Vector3} yAxisDirectionPosition y轴方向坐标
     * @private
     */
    function _SetRelativeCoordinate(centerPosition, xAxisDirectionPosition, yAxisDirectionPosition) {
        _coordinateTool._relativeCoordinateCenterPosition=centerPosition.clone();
        _coordinateTool._relativeCoordinateXAxisDirectionPosition=xAxisDirectionPosition.clone();
        _coordinateTool._relativeCoordinateYAxisDirectionPosition=yAxisDirectionPosition.clone();


        // 生成对应物体
        if(_coordinateTool._centerObject===undefined){
            _coordinateTool._centerObject=_MakeObject("_centerObject");
            _AddObject(member._SCENE_NAME_DEAD,_coordinateTool._centerObject);
            _coordinateTool._centerChildrenObject=_MakeObject("_childrenObject");
            _coordinateTool._centerObject.add(_coordinateTool._centerChildrenObject);
        }
        _coordinateTool._centerObject.position.set(0,0,0);
        _coordinateTool._centerObject.rotation.set(0,0,0);
        _coordinateTool._centerObject.position.copy(centerPosition);
        // _coordinateTool._centerObject.position.z=0;
        window.center=_coordinateTool._centerObject;
        window.child=_coordinateTool._centerChildrenObject;
        // x2的方向标量
        let x2AxisVector=_coordinateTool._relativeCoordinateXAxisDirectionPosition.clone().sub(_coordinateTool._relativeCoordinateCenterPosition);
        let x2AxisDistancex1AxisAngle=x2AxisVector.angleTo(new THREE.Vector3(1,0,0));// 两个x轴的相差角度

        // 判断角度大小
        if(centerPosition.y>_coordinateTool._relativeCoordinateXAxisDirectionPosition.y){
            x2AxisDistancex1AxisAngle=Math.PI*2-x2AxisDistancex1AxisAngle;
        }
        // console.warn(" >LJason< 警告：x2AxisDistancex1AxisAngle",THREE.Math.radToDeg(x2AxisDistancex1AxisAngle));

        // 旋转中心物体到同样坐标系
        _coordinateTool._centerObject.rotateZ(x2AxisDistancex1AxisAngle);

        function _MakeObject(name) {
            // let cubeGeometry=new THREE.BoxGeometry(5,5,5);
            // let cubeMaterial=new THREE.MeshBasicMaterial({color:color});
            // let cube=new THREE.Mesh(cubeGeometry,cubeMaterial);
            // cube.name=name;
            let cube=new THREE.Object3D();
            cube.name=name;
            return cube;
        }
    }

    /**
     * 将相对坐标转换为viewer坐标
     * @param {float} x 相对坐标
     * @param {float} y 相对坐标
     * @param {function} successCallback 成功后的回调
     * @private
     */
    function _RelativeCoordinateToViewerCoordinate(x,y,successCallback){
        _coordinateTool._centerChildrenObject.position.set(x,y,0);
        setTimeout(()=>{
            successCallback(_coordinateTool._centerChildrenObject.getWorldPosition());
        },100);
    }

    /**
     * 设置相对坐标系
     * @function L_SetRelativeCoordinate
     * @param {THREE.Vector3} centerPosition 原点坐标
     * @param {THREE.Vector3} xAxisDirectionPosition x轴方向坐标
     * @param {THREE.Vector3} yAxisDirectionPosition y轴方向坐标
     */
    mgr.L_SetRelativeCoordinate=function (centerPosition, xAxisDirectionPosition, yAxisDirectionPosition) {
        _SetRelativeCoordinate(centerPosition, xAxisDirectionPosition, yAxisDirectionPosition);
    };

    /**
     * 将相对坐标转换为viewer坐标
     * @function L_RelativeCoordinateToViewerCoordinater
     * @param {float} x 相对坐标
     * @param {float} y 相对坐标
     * @param {function} successCallback 成功后的回调
     */
    mgr.L_RelativeCoordinateToViewerCoordinater=function (x,y,successCallback) {
        return _RelativeCoordinateToViewerCoordinate(x,y,successCallback);
    };

    // endregion

    // region OBJ加载工具
    function _InitializeObjLoader() {
        _objLoader._objLoaderGroup = new THREE.Group();
        _objLoader._objLoaderGroup.name = "ZhiUTech_ObjLoaderGroup";
        _AddObject(member._SCENE_NAME_LIFE,_objLoader._objLoaderGroup);
    }
    function _GetOBJModel(id) {
        if (_objLoader._objLoaderGroup) {
            for (let i = 0; i < _objLoader._objLoaderGroup.children.length; i++) {
                if (_objLoader._objLoaderGroup.children[i].name === id) {
                    return _objLoader._objLoaderGroup.children[i];
                }
            }
        }
        return undefined;
    }
    function _DeleteOBJModel(id) {
        let obj =_GetOBJModel(id);
        if (obj!==undefined) {
            _objLoader._objLoaderGroup.remove(obj);
            _RefreshScene();
            return true;
        }
        return false;
    }
    function _DeleteAllOBJModel() {
        _DeleteObject(member._SCENE_NAME_LIFE,_objLoader._objLoaderGroup);
        _InitializeObjLoader();
    }
    function _LoadOBJModel(objPath,successCallback,position) {
        let loader=new THREE.ObjectLoader();
        loader.load(objPath,function (object) {
            let id=_GetGUID();
            object._isOutSideModel_LJ=true;// 添加标识
            object._root_LJ=object;// 添加标识顶级父物体
            object._type_LJ="OBJModel";
            for (let i = 0; i < object.children.length; i++) {
                object.children[i].rotation.set(THREE.Math.degToRad(90),0,0);// 修正旋转
                object.children[i].name=id;// 整理所有id
                object.children[i]._isOutSideModel_LJ=true;// 添加标识
                object.children[i]._root_LJ=object;// 添加标识顶级父物体
                object.children[i]._type_LJ="OBJModel";
            }
            object.position.copy(position);
            object.name=id;
            object._boundingBox_LJ=new THREE.Box3().setFromObject(object);// 生成包围盒
            object._center_LJ=_GetCenterPositionByBoundingBox(object._boundingBox_LJ);// 生成模型中心点
            _objLoader._objLoaderGroup.add(object);
            _RefreshScene(true);
            successCallback(object.name,object);
        });

    }
    function _LoadOBJMTLModel(objPath,mtlPath,successCallback,position=new THREE.Vector3()){
        var loader = new THREE.OBJMTLLoader();
        loader.load( objPath, mtlPath, function ( object ) {
            let id=_GetGUID();
            object._isOutSideModel_LJ=true;// 添加标识
            object._root_LJ=object;// 添加标识顶级父物体
            object._type_LJ="OBJModel";
            for (let i = 0; i < object.children.length; i++) {
                object.children[i].rotation.set(THREE.Math.degToRad(90),0,0);// 修正旋转
                object.children[i].name=id;// 整理所有id
                object.children[i]._isOutSideModel_LJ=true;// 添加标识
                object.children[i]._root_LJ=object;// 添加标识顶级父物体
                object.children[i]._type_LJ="OBJModel";
            }
            object.position.copy(position);
            object.name=_GetGUID();
            _objLoader._objLoaderGroup.add(object);
            _RefreshScene(true);
            successCallback(object.name,object);
        });
    }
    function _SetOBJModelRotation(id, pitch, yaw, roll) {
        let obj =_GetOBJModel(id);
        if (obj!==undefined) {
            if(pitch!==undefined){
                obj.rotation.x=THREE.Math.degToRad(pitch);
            }
            if(yaw!==undefined){
                obj.rotation.z=THREE.Math.degToRad(yaw);
            }
            if(roll!==undefined){
                obj.rotation.y=THREE.Math.degToRad(roll);
            }
            _RefreshScene(true);
            return true;
        }
        return false;
    }
    function _SetOBJModelPosition(id,position) {
        let obj =_GetOBJModel(id);
        if (obj!==undefined) {
            obj.position.copy(position);
            _RefreshScene(true);
            return true;
        }
        return false;
    }
    function _SetOBJModelScale(id,scale) {
        let obj =_GetOBJModel(id);
        if (obj!==undefined) {
            obj.scale.set(scale,scale,scale);
            _RefreshScene(true);
            return true;
        }
        return false;
    }
    function _SetOBJModelColor(id,red,green,blue) {
        let obj =_GetOBJModel(id);
        if (obj!==undefined) {
            for (let i = 0; i < obj.children.length; i++) {
                obj.children[i].material.emissive=new THREE.Color(red/255,green/255,blue/255);
            }
            _RefreshScene(true);
            return true;
        }
        return false;
    }
    _InitializeObjLoader();
    /**
     * 加载OBJ模型
     * @function ZhiUTech_ThreeJsMaker  L_LoadOBJModel
     * @param {string} objPath obj路径
     * @param {callback} successCallback 成功后的回调,回调参数第一个为该模型唯一ID,第二参数为obj模型实例
     * @param {THREE.Vector3} [position=new THREE.Vector3()] 模型位置
     */
    mgr.L_LoadOBJModel=function (objPath,successCallback,position=new THREE.Vector3()) {
        _LoadOBJModel(objPath,successCallback,position);
    };
    /**
     * 加载OBJ模型 包含mtl材质描述文件 (请将材质路径设为相对,并放在模型根目录)
     * @function ZhiUTech_ThreeJsMaker  L_LoadOBJModelWithMtlFile
     * @param {string} objPath obj路径
     * @param {string} mtlPath mtl路径
     * @param {callback} successCallback 成功后的回调,回调参数第一个为该模型唯一ID,第二参数为obj模型实例
     * @param {THREE.Vector3} [position=new THREE.Vector3()] 模型位置
     */
    mgr.L_LoadOBJModelWithMtlFile=function (objPath,mtlPath,successCallback,position=new THREE.Vector3()) {
        _LoadOBJMTLModel(objPath,mtlPath,successCallback,position);
    };
    /**
     * 设置OBJ模型是否可见
     * @function ZhiUTech_ThreeJsMaker  L_SetOBJModelVisible
     * @param {boolean} isShow 可见性
     */
    mgr.L_SetOBJModelVisible=function(isShow){
        if(_objLoader._objLoaderGroup.visible===isShow) return;
        _objLoader._objLoaderGroup.visible=isShow;
        _RefreshScene();
    };
    /**
     * 设置OBJ模型旋转
     * @function ZhiUTech_ThreeJsMaker  L_SetOBJModelRotation
     * @param {string} id 模型id
     * @param {float} pitch 俯仰角
     * @param {float} yaw 偏航角
     * @param {float} roll 翻滚角
     * @return {boolean} 是否成功
     */
    mgr.L_SetOBJModelRotation=function(id,pitch,yaw,roll){
        return _SetOBJModelRotation(id, pitch, yaw, roll);
    };
    /**
     * 设置OBJ模型位置
     * @function ZhiUTech_ThreeJsMaker  L_SetOBJModelPosition
     * @param {string} id 模型id
     * @param {THREE.Vector3} position 目标点
     * @return {boolean} 是否成功
     */
    mgr.L_SetOBJModelPosition=function(id,position){
        return _SetOBJModelPosition(id,position);
    };
    /**
     * 设置OBJ模型缩放
     * @function ZhiUTech_ThreeJsMaker  L_SetOBJModelScale
     * @param {string} id 模型id
     * @param {float} scale 缩放系数
     * @return {boolean} 是否成功
     */
    mgr.L_SetOBJModelScale=function(id,scale){
        return _SetOBJModelScale(id,scale);
    };
    /**
     * 设置OBJ模型颜色 (颜色默认为 0,0,0)
     * @function ZhiUTech_ThreeJsMaker  L_SetOBJModelColor
     * @param {string} id 模型id
     * @param {number} red 红色 0-255
     * @param {number} green 绿色 0-255
     * @param {number} blue 蓝色 0-255
     * @return {boolean} 是否成功
     */
    mgr.L_SetOBJModelColor=function(id,red,green,blue){
        return _SetOBJModelColor(id,red,green,blue);
    };
    /**
     * 删除多边形
     * @function ZhiUTech_ThreeJsMaker  L_DeleteOBJModel
     * @param {string} id 创建时的id
     * @return {boolean} 是否删除成功
     */
    mgr.L_DeleteOBJModel=function (id) {
        return _DeleteOBJModel(id);
    };
    /**
     * 删除所有多边形
     * @function ZhiUTech_ThreeJsMaker  L_DeleteAllOBJModel
     */
    mgr.L_DeleteAllOBJModel=function () {
        _DeleteAllOBJModel();
    };
    // endregion

    // region 通知中心

    // region Listener 外部
    ZhiUTech_MsgCenter.L_AddListener("开关里程碑", _MsgCenter_ToggleMilePost);
    ZhiUTech_MsgCenter.L_AddListener("开关工区", _MsgCenter_ToggleWorkArea);

    // endregion

    // region Listener 外部 方法实现

    /**
     * 通知中心: 广告牌开关
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _MsgCenter_ToggleMilePost(isShow) {
        if(!member._billboardGroup) return;
        member._billboardGroup.visible =isShow;
        _RefreshScene();
    }
    /**
     * 通知中心: 工区开关
     * @param {boolean} isShow 是否显示
     * @private
     */
    function _MsgCenter_ToggleWorkArea(isShow) {
        member._workAreaGroup.visible = isShow;
        member._isWorkAreaVisible = isShow;
        _RefreshScene();
    }

    // endregion

    // endregion

    zhiu_Viewer.ZhiUTech_ThreeJsMaker = mgr;
    ZhiUTech_MsgCenter.L_SendMsg("THREEJS模块插件初始化成功");
}


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

/**
 * 获取到射线检测信息的回调
 * @callback RaycastAction
 * @param {RayHitInfo} hitInfo 射线检测数据
 */

/**
 * 射线检测返回的信息格式 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class RayHitInfo
 * @param {string} id 各类可点击物体的ID 例:viewer内物体,obj模型,广告牌等
 * @param {string} name 如果点击的是(revit模型)viewer内物体则该参数为物体的名称(其他物体则和id完全一致)
 * @param {THREE.Vector3} intersectPoint 顶点索引信息
 * @param {string} type 点击到物体的类型 目前四种 1."viewer" : viewer内部模型物体; 2."Billboarb": 广告牌物体; 3."3DPoint": 3D点; 4."OBJModel": OBJ模型;
 * @param {THREE.Mesh} [object] 如果点击的是非viewer的模型会返回该参数
 * @param {string} [billBoardContent] 如果点击的是广告牌会返回该参数
 * @param {string} [_model] 非公开节点,当前请勿使用
 */

/**
 * (v3.0版本将会弃用,如有疑问请联系开发人员) 射线检测返回的信息格式 (该类仅用于形容数据格式,不可使用new关键词调用)
 * @class TouchMsg
 * @param {string} id 击中的构件ID
 * @param {THREE.Vector3} intersectPoint 击中位置
 * @param {model} model 击中的模型
 */

/**
 * (v3.0版本将会弃用,如有疑问请联系开发人员) 获取到点击信息的回调
 * @callback TouchAction
 * @param {TouchMsg} msg 如果返回为undefined,回调将会继续进行至有效值返回,才会终止
 */












































