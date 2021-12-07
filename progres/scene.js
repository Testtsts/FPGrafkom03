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

//random generate 
function getrand(){

  return (Math.floor(Math.random()*3)-1)*50;
}

class cubetiles {
  cube;
  value;
  tomove;
  constructor(geometry, material, value){
    this.cube = new THREE.Mesh(geometry,material);
    this.value = value;
  }
}

//cube container
const gamegrid = [];
const cubes = [];

//move cubes

// function movecuberight(box){
//   if(box.position.x < 50)
//   box.position.x += 50;
// }

// function movecubeleft(box){
//   if(box.position.x > -50)
//   box.position.x -= 50;
// }

// function movecubeback(box){
//   if(box.position.z > -50)
//   box.position.z -= 50;
// }

// function movecubefront(box){
//   if(box.position.z < 50)
//   box.position.z += 50;
// }

// function movecubeup(box){
//   if(box.position.y < 100)
//   box.position.y += 50;
// }

// function movecubedown(box){
//   if(box.position.y > 0)
//   box.position.y -= 50;
// }

//move vector
const mov = new THREE.Vector3();

//state check
var ismoving = 0;
var haspawned = 0;

//remove all cube

function removecube(box){
  box.remove();
  scene.remove(box);
}

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
    if (keyCode == 8){
      cubes.forEach(removecube);
      return;
    }
    if(framecounter <= 10){
      return;
    }
    if (keyCode == 87){
      // cubes.forEach(movecubeback);
      mov.set(0,0,-10);
    }
    if (keyCode == 83){
      // cubes.forEach(movecubefront);
      mov.set(0,0,10);
    }
    if (keyCode == 65){
      // cubes.forEach(movecubeleft);
      mov.set(-10,0,0);
    }
    if (keyCode == 68){
      // cubes.forEach(movecuberight);
      mov.set(10,0,0);
    }
    if (keyCode == 69){
      // cubes.forEach(movecubeup);
      mov.set(0,10,0);
    }
    if (keyCode == 81){
      mov.set(0,-10,0);
    }
    framecounter = 0;
    
    // var ccube = new THREE.Mesh(geometry,material);
    var ccube = new cubetiles(geometry,material,0);
    ccube.cube.castShadow = true;
    ccube.cube.receiveShadow = true;

    ccube.cube.position.set(getrand(),getrand()+50,getrand());
    
    
    // cubes.add(ccube);
    scene.add(ccube.cube);
    cubes.push(ccube);
    console.log(cubes.length);
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


const geometry = new THREE.BoxGeometry(10,10,10);
let n = 2048;
box2048(n);
const loader = new THREE.TextureLoader();
const material = new THREE.MeshPhongMaterial( {
  map: loader.load(path),
  shininess: 30
});
// var cube = new THREE.Mesh( geometry, material );
// cube.castShadow = true;
// cube.receiveShadow = true;
// scene.add(cube);
// cube.position.set(0, 0, 0);
// cubes.push(cube);

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
// scene.add(solarLight2)
// const helper2 = new THREE.DirectionalLightHelper( solarLight2, 5 );
// scene.add(helper2);

function move(box){


//checking box boundaries
  if(mov.getComponent(0)!=0){
    if(mov.x > 0){
      if(box.cube.position.x == 50){
        return;
      }
    }
    else{
      if(box.cube.position.x == -50){
        return;
      }
    }
  }
  if(mov.getComponent(1)!=0){
    if(mov.y > 0){
      if(box.cube.position.y == 100){
        return;
      }
    }
    else{
      if(box.cube.position.y == 0){
        return;
      }
    }
  }
  if(mov.getComponent(2)!=0){
    if(mov.z > 0){
      if(box.cube.position.z == 50){
        return;
      }
    }
    else { 
      if(box.cube.position.z == -50){
        return;
      }
    }
  }
//endof checking box boundaries

  box.cube.position.add(mov);
}

function gameupdate(){
  cubes.forEach(move);
}

//framecounter restrict keyboard input
var framecounter = 10;
const animate = () =>
{
    controls.update();
    //render
    // sphereCamera.update(renderer, scene);
    if(framecounter<5){
      gameupdate();
    }
    // gameupdate();
    renderer.render(scene, camera);
    framecounter +=1;
    if(framecounter >120000){
      framecounter = 11;
    }
    window.requestAnimationFrame(animate);
}
animate();