import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {GLTFLoader} from './js/GLTFLoader.js';
import {OBJLoader} from './js/OBJLoader.js';
import {MTLLoader} from './js/MTLLoader.js';
import {Reflector} from './js/objects/Reflector.js';
import * as dat from './js/libs/dat.gui.module.js';
import {path, box2048} from './kotak.js';

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

// KeyboardEvents
document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event){
    let keyCode = event.which;
    if (keyCode == 87){
        scene.add(cube);
        cube.position.z -= 50;
    }
    if (keyCode == 83){
      scene.add(cube);
      cube.position.z += 50;
    }
    if (keyCode == 65){
      scene.add(cube);
      cube.position.x -= 50;
    }
    if (keyCode == 68){
      scene.add(cube);
      cube.position.x += 50;
    }

    // if (keyCode == 8){
    //   scene.remove(cube);
    // }
    requestAnimationFrame();
};




// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
// camera.position.y = 50;
// camera.position.z = 200;
scene.add(camera);

//controls
const controls = new OrbitControls(camera, canvas);
camera.position.set( 0, 50, 200 );
// controls.target.set(10, 10, 10);
controls.smoothZoom = true;
// controls.minDistance = 50;
controls.maxDistance = 200;
controls.enablePan = true;
controls.maxPolarAngle = Math.PI / 2;
controls.update();
// controls.enableDamping = true;



//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
    //alpha: true,
    //antialias: true,
})

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.render(scene, camera, controls);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;

const color_black = new THREE.Color("rgb(42,42,42)");
scene.background = color_black ;

let geo = new THREE.BoxBufferGeometry(0, 0, 0)
let mat = new THREE.MeshLambertMaterial({
    // color: "white"
})
let mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)

let tex = new THREE.TextureLoader().load("./assets/grass.jpg")
tex.anisotropy = 100
tex.repeat.set(100, 100)
tex.wrapT = THREE.RepeatWrapping
tex.wrapS = THREE.RepeatWrapping
geo = new THREE.PlaneBufferGeometry(10000, 10000)
mat = new THREE.MeshLambertMaterial({
  map: tex
})
mesh = new THREE.Mesh(geo, mat)
mesh.position.set(0, -5, 0)
mesh.rotation.set(Math.PI / -2, 0, 0)
scene.add(mesh)

let axis = new THREE.Vector3(0, 1, 0)
function updateCamera() {
  camera.position.applyAxisAngle(axis, 0.01)
}

var cubes = [];
const geometry = new THREE.BoxGeometry(10,10,10);
// for (let i = 0; i < 3; i++) {
//   cubes[i] = new THREE.Mesh(geometry, material);
//   cubes[i].position.x = Math.random() * 1000 - 500;
//   cubes[i].position.y = Math.random() * 1000 - 500;
//   cubes[i].position.z = Math.random() * 500 - 500;
//   scene.add(cubes[i]);
// }
let n = 2048;
box2048(n);
const loader = new THREE.TextureLoader();
const material = new THREE.MeshPhongMaterial( {
  map: loader.load(path),
  shininess: 30
});
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( cube );
cube.position.set(-10, 0, -2);

//sapi
const mtlLoader = new MTLLoader();
    mtlLoader.load('./assets/animal//OBJ/Cow.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      mtlLoader.setMaterialOptions( { side: THREE.DoubleSide } );
      objLoader.setMaterials(mtl);
      objLoader.load('./assets/animal//OBJ/Cow.obj', (root) => {
        root.scale.set(5,5,5);
        // root.position.x = 100
        // root.position.y = -5
        root.position.z = -100
        scene.add(root);
      });
    });


//kyda
const mtlLoader2 = new MTLLoader();
    mtlLoader2.load('./assets/animal//OBJ/Horse.mtl', (mtl) => {
      mtl.preload();
      const objLoader2 = new OBJLoader();
      mtlLoader2.setMaterialOptions( { side: THREE.DoubleSide } );
      objLoader2.setMaterials(mtl);
      objLoader2.load('./assets/animal//OBJ/Horse.obj', (root) => {
        root.scale.set(5,5,5);
        root.position.x = 100
        root.position.y = -5
        root.position.z = -50
        scene.add(root);
      });
    });


//Light

const solarLight = new THREE.DirectionalLight(0xffffff,1);
solarLight.position.set(-10, 100, 100);
// solarLight.target.position.set(0, 0,0);
solarLight.castShadow = true;
// solarLight.intensity = 1;
solarLight.shadow.camera.visible = true;
// solarLight.shadow.mapSize.width = 1024;
// solarLight.shadow.mapSize.height = 1024;
// solarLight.shadow.camera.near = 250;
// solarLight.shadow.camera.far = 1000;

// let intensity = 1;

// solarLight.shadow.camera.left = -intensity;
// solarLight.shadow.camera.right = intensity;
// solarLight.shadow.camera.top = intensity;
// solarLight.shadow.camera.bottom  = -intensity;
scene.add(solarLight);
// scene.add(solarLight.target);
// const helper = new THREE.DirectionalLightHelper( solarLight, 5 );
// scene.add(helper);

// const solarLight2 = new THREE.DirectionalLight(0xffffff,1);
// solarLight2.position.set(0, 50, -50);
// // solarLight2.castShadow = true;
// // solarLight2.shadow.mapSize.width = 1024;
// // solarLight2.shadow.mapSize.height = 1024;
// // solarLight2.shadow.camera.near = 250;
// // solarLight2.shadow.camera.far = 1000;
// scene.add(solarLight2);
// const helper2 = new THREE.DirectionalLightHelper( solarLight2, 5 );
// scene.add(helper2);

const animate = () =>
{
    controls.update();
    // cubes[0].rotation.x += 0.01;
    // cubes[0].rotation.y += 0.01;

    //render
    // sphereCamera.update(renderer, scene);
    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
}
animate();