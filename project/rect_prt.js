import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//初始化场景，相机
var scene = new THREE.Scene();

export function createScene(){
    //透视投影相机
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    //渲染器
    var renderer = new THREE.WebGLRenderer({ antialias : true } );
    renderer.setSize(window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    // //点光源：两个参数分别表示光源颜色和光照强度
    // // 参数1：0xffffff是纯白光,表示光源颜色
    // // 参数2：1.0,表示光照强度，可以根据需要调整
    const pointLight1 = new THREE.PointLight(0xffffff, 1.0);
    //点光源位置
    pointLight1.position.set(300, 100, 100);
    scene.add(pointLight1); 

    const pointLight2 = new THREE.PointLight(0xffffff, 1.0);
    //点光源位置
    pointLight2.position.set(50, 300, 50);
    // scene.add(pointLight2); 

    const pointLight3 = new THREE.PointLight(0xffffff, 1.0);
    //点光源位置
    pointLight3.position.set(50, 50, 300);
    scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xffffff, 1.0);
    //点光源位置
    pointLight4.position.set(-100, -100, -100);
    scene.add(pointLight4);


    //相机位置，视角
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    camera.position.set(250, 250, 250);
    camera.lookAt(0,0,0);

    //辅助观察的坐标系
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    //实现镜头旋转
    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
        renderer.render(scene, camera); //执行渲染操作
    });//监听鼠标、键盘事件



    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    };

    animate();
}


export function createRect(positions){
    var material = new THREE.MeshStandardMaterial({
        color: 0xffffff, // 物体的基本颜色
        metalness: 0.5,    // 金属度，介于 0（非金属）和 1（完全金属）之间
        roughness: 0.5   // 粗糙度，介于 0（光滑）和 1（粗糙）之间
    });


    // 创建几何体
    const geometry = new THREE.BufferGeometry();

    const indices = [
        2, 1, 0,   // 底面三角形1
        0, 3, 2,   // 底面三角形2
        4, 5, 6,   // 顶面三角形1
        4, 6, 7,   // 顶面三角形2
        1, 4, 0,   // 侧面三角形1
        1, 5, 4,   // 侧面三角形2
        6, 5, 1,   // 侧面三角形3
        2, 6, 1,   // 侧面三角形4
        7, 6, 2,   // 侧面三角形5
        3, 7, 2,   // 侧面三角形6
        4, 7, 3,   // 侧面三角形7
        0, 4, 3,   // 侧面三角形8
    ];
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));


    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);


    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}


