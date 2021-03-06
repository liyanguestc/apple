var windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;
var camera, renderer, scene;

// add your global variables here:
var helloWorldMesh;
var world, worldClouds, t, c, l;
var mesh1, mesh2, mesh3;
var sizeM = 45;
var sizeMesh1=sizeM, sizeMesh2=sizeM, sizeMesh3=sizeM;
var depthCompress = 0.3;
var z0 = -5;
var worldRadius = 15;
var textRadius = 1.75*worldRadius;
var relcoeff = -0.3;
var spotLight;
var newMeshReady = false;

window.onload = function() {
    console.log("onload");
    Init();
    animate();
};

function Init() {
    scene = new THREE.Scene();

    //setup camera
    camera = new LeiaCamera({
        cameraPosition: new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z),
        targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
    });
    camera.visible=false;
    scene.add(camera);

    //setup rendering parameter
    renderer = new LeiaWebGLRenderer({
        antialias: true,
        renderMode: _renderMode,
        shaderMode: _nShaderMode,
        colorMode: _colorMode,
        devicePixelRatio: 1
    });
    renderer.Leia_setSize(windowWidth, 0.75 * windowWidth);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement);

    //add object to Scene
    addObjectsToScene();

    //add Light
    addLights();
}

function animate() {
    requestAnimationFrame(animate);
    var time = Date.now() * 0.001;
    
    mesh1.rotation.set(-Math.PI/2+0.2*Math.sin(3.2*time), 0*Math.PI/2, -Math.PI/2+0.25*Math.sin(4*time));
    mesh1.position.z = -2;

    renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));
    renderer.Leia_render({
        scene: scene,
        camera: camera,
        holoScreenSize: _holoScreenSize,
        holoCamFov: _camFov,
        upclip: _up,
        downclip:  _down,
        messageFlag: _messageFlag
    });
}


function addObjectsToScene() {
    var worldTexture = new THREE.ImageUtils.loadTexture('resource/world_texture.jpg');
    worldTexture.wrapS = worldTexture.wrapT = THREE.RepeatWrapping;
    worldTexture.repeat.set(1, 1);
    var worldMaterial = new THREE.MeshPhongMaterial({
        map: worldTexture,
        bumpMap   : THREE.ImageUtils.loadTexture('resource/world_elevation.jpg'),
        bumpScale : 1.00,
        specularMap: THREE.ImageUtils.loadTexture('resource/world_water.png'),
        specular: new THREE.Color('grey'),
        color: 0xffdd99
    });
    var worldGeometry = new THREE.SphereGeometry(worldRadius, 30, 30);
    world = new THREE.Mesh(worldGeometry, worldMaterial);
    world.position.z = z0;
    world.castShadow = true;
    world.receiveShadow = true;
    //scene.add(world);

    var planeTexture = new THREE.ImageUtils.loadTexture('resource/world_galaxy_starfield.png');
    planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({
        map: planeTexture,
        color: 0xffdd99
    });
    var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
   // console.log(planeGeometry);
    for (var i=0; i<(planeGeometry.vertices.length); i++) {
        var qq = planeGeometry.vertices[i].x;
        planeGeometry.vertices[i].z = 0.005*qq*qq;
    }
    plane = new THREE.Mesh(planeGeometry, worldMaterial);
    plane.position.z = -8;
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);

    var helloWorldGeometry = new THREE.TextGeometry(
        "Pear", {
            size: 9,
            height: 2,
            curveSegments: 4,
            font: "helvetiker",
            weight: "normal",
            style: "normal",
            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        }
    );
    helloWorldGeometry.computeBoundingBox();
    var hwbb = helloWorldGeometry.boundingBox;
    var hwbbx = -0.5 * (hwbb.max.x - hwbb.min.x);
    var hwbby = -0.5 * (hwbb.max.y - hwbb.min.y);
    var helloWorldMaterial = new THREE.MeshFaceMaterial(
        [
            new THREE.MeshPhongMaterial({
                color: 0x220000,
                //shading: THREE.FlatShading
            }), // front
            new THREE.MeshPhongMaterial({
                color: 0x220000,
                shading: THREE.SmoothShading
            }) // side
        ]
    );
    var helloWorldMesh = new THREE.Mesh(helloWorldGeometry, helloWorldMaterial);
    helloWorldMesh.castShadow = true;
    helloWorldMesh.position.set(hwbbx, hwbby, 4);
    scene.add(helloWorldMesh);

   readSTLs('resource/AppleLogo_5k.stl', '', '');
}

function addLights() {
    //Add Lights Here
    //var light = new THREE.SpotLight(0x888888);
    var light = new THREE.SpotLight(0xffffff);
    //light.color.setHSL( Math.random(), 1, 0.5 );
    light.position.set(70, 70, 70);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 512;
    light.shadowDarkness = 0.7;
    scene.add(light);

    //var ambientLight = new THREE.AmbientLight(0x222222);
    //var ambientLight = new THREE.AmbientLight(0x666666);
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);
}

function readSTLs(filename1, filename2, filename3)
{
        var xhr1 = new XMLHttpRequest();
        xhr1.onreadystatechange = function () {
        if ( xhr1.readyState == 4 ) {
                if ( xhr1.status == 200 || xhr1.status === 0 ) {
                        var rep = xhr1.response; // || xhr1.mozResponseArrayBuffer;
                        //mesh1 = parseStlBinary(rep, 0xffffff);
                        mesh1 = parseStlBinary(rep, 0xff1111);
                        mesh1.material.side = THREE.DoubleSide;
    mesh1.castShadow = true;
    mesh1.receiveShadow = true;
mesh1.material.metal = true;

                        mesh1.scale.set(sizeMesh1, sizeMesh1, sizeMesh1);
                        scene.add(mesh1);
                        newMeshReady = true;
                        }
                }
        };
        xhr1.onerror = function(e) {
                console.log(e);
        };
        xhr1.open( "GET", filename1, true );
        xhr1.responseType = "arraybuffer";
        xhr1.send( null );
}
