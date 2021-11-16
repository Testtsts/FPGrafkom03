import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {GLTFLoader} from './js/GLTFLoader.js';
import {Reflector} from './js/objects/Reflector.js';
import * as dat from './js/libs/dat.gui.module.js'

//canvas
const canvas = document.querySelector('canvas.webgl')

//scene
const scene = new THREE.Scene();


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

const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 90;
scene.add(camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(4.5, 0, 4.5);
 
controls.enablePan = true;
controls.maxPolarAngle = Math.PI / 2;

controls.enableDamping = true;

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

// panorama
const panorama = new THREE.CubeTextureLoader();
const textureBG= panorama.load([
  './texture/px.jpg', './texture/nx.jpg',
  './texture/py.jpg', './texture/ny.jpg',
  './texture/pz.jpg', './texture/nz.jpg'
]);
scene.background = textureBG ;

//object plane
const loader4 = new THREE.TextureLoader();
const basee = loader4.load('./texture/ny.jpg');
// basee.wrapS = THREE.RepeatWrapping;
// basee.wrapT = THREE.RepeatWrapping;
// const repeats = 100;
// basee.repeat.set(repeats, repeats);

let sandPlane = new THREE.BoxGeometry(500, 500);
let sandMaterial = new THREE.MeshLambertMaterial({
    map: basee,
    // color: 2434341
});


let plane = new THREE.Mesh(sandPlane,sandMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -5;
plane.receiveShadow = true;
scene.add(plane);

//object gltf
//Gambar Bebek 1
// const loader = new GLTFLoader()
// loader.load('./assets/Duck.gltf', function(gltf){
//        gltf.scene.scale.set(10, 10, 10);
//         const root = gltf.scene;
//         root.position.x = 0;
//         root.position.y = -3.4;
//         root.position.z = 10;
//         scene.add(root);
    
//         root.traverse(n => { if ( n.isMesh ) {
//           n.castShadow = true; 
//           n.receiveShadow = true;
//         }});

// })
const cube1 = loader4.load('./assets/base.png');

const geometry = new THREE.BoxGeometry( 20, 20, 20 );
const material = new THREE.MeshLambertMaterial( {
  color: 'black'} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.set(-10, 8, -2);

const geometry2 = new THREE.BoxGeometry( 20, 20, 20 );
const material2 = new THREE.MeshLambertMaterial( {
  color: 'red'} );
const cube2 = new THREE.Mesh( geometry2, material2 );
scene.add( cube2 );
cube2.position.set(10, 8, -2);



//Light

const solarLight = new THREE.DirectionalLight();
solarLight.position.set(10, 100, -100);
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


const animate = () =>
{
    controls.update();

    //render
    // sphereCamera.update(renderer, scene);
    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
}
animate();