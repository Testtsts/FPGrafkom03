import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {GLTFLoader} from './js/GLTFLoader.js';
import {Reflector} from './js/objects/Reflector.js';
import * as dat from './js/libs/dat.gui.module.js'

//canvas
const canvas = document.querySelector('canvas.webgl')

//scene
const scene = new THREE.Scene();

//dat gui
const gui = new dat.GUI()

//size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    //update size
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})


// Camera

const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 70;
scene.add(camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.autoRotate = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
    //alpha: true,
    //antialias: true,
})

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.render(scene, camera, controls);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;

//panorama
// const panorama = new THREE.CubeTextureLoader();
// const textureBG= panorama.load([
//   './texture/px.jpg', './texture/nx.jpg',
//   './texture/py.jpg', './texture/ny.jpg',
//   './texture/pz.jpg', './texture/nz.jpg'
// ]);
scene.background = new THREE.Color(0x252525); ;

//object plane
const loader4 = new THREE.TextureLoader();
const sand = loader4.load('./texture/ny.jpg');

let sandPlane = new THREE.BoxGeometry(100, 100);
let sandMaterial = new THREE.MeshLambertMaterial({
    map:sand
});


let plane = new THREE.Mesh(sandPlane,sandMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -5.5;
plane.receiveShadow = true;
scene.add(plane);

//scenegraph
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

//object gltf
//Gambar Bebek 1
const loader = new GLTFLoader()
loader.load('./assets/Duck.gltf', function(gltf){
       gltf.scene.scale.set(10, 10, 10);
        const root = gltf.scene;
        root.position.x = 0;
        root.position.y = -3.4;
        root.position.z = 10;
        scene.add(root);
    
        root.traverse(n => { if ( n.isMesh ) {
          n.castShadow = true; 
          n.receiveShadow = true;
        }});

})

const loader2 = new GLTFLoader()
loader2.load('./assets/Duck.gltf', function(gltf){
       gltf.scene.scale.set(10, 10, 10);
        const root = gltf.scene;
        root.position.x = 0;
        root.position.y = -3.4;
        root.position.z = -10;
        scene.add(root);
    
        root.traverse(n => { if ( n.isMesh ) {
          n.castShadow = true; 
          n.receiveShadow = true;
        }});

})

//Light

const solarLight = new THREE.DirectionalLight();
solarLight.position.set(500, 500, -500);
solarLight.castShadow = true;
solarLight.intensity = 2;
solarLight.shadow.mapSize.width = 1024;
solarLight.shadow.mapSize.height = 1024;
solarLight.shadow.camera.near = 250;
solarLight.shadow.camera.far = 1000;

let intensity = 20;

solarLight.shadow.camera.left = -intensity;
solarLight.shadow.camera.right = intensity;
solarLight.shadow.camera.top = intensity;
solarLight.shadow.camera.bottom  = -intensity;
scene.add(solarLight);

//fog
const near = 10;
const far = 100;
const color = 'lightwhite';
scene.fog = new THREE.Fog(color, near, far);


//reflective sphere
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
let sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
sphereCamera.position.set(0, 20, 0);
scene.add(sphereCamera);
const sphereMirror = new THREE.MeshBasicMaterial({
  envMap: sphereCamera.renderTarget.texture,
});
const sphereGeo = new THREE.SphereGeometry(5, 40 , 40);
const mirrorBall = new THREE.Mesh( sphereGeo, sphereMirror);
mirrorBall.position.y = 30;
mirrorBall.position.x = 0;
scene.add(mirrorBall);

const animate = () =>
{
    controls.update();

    //render
    sphereCamera.update(renderer, scene);
    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
}
animate();