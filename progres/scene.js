import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import { loadObjek } from './objek.js';
import * as dat from './js/libs/dat.gui.module.js';
import {path, box2048} from './kotak.js';

//canvas
const canvas = document.querySelector('canvas.webgl')
const gameStat = "loading"
const startBtn = document.querySelector('.start-btn')
const bgMusic = new Audio('./music/bg.mp3')
bgMusic.loop = true
startBtn.innerText = "start"
startBtn.addEventListener('click', () => {
  if(startBtn.innerText == "START"){
      init()
      document.querySelector('.modal').style.display = "none"
  }
})

async function init(){
  // await delay(500)
  // text.innerText = "Starting in 3"
  // await delay(500)
  // text.innerText = "Starting in 2"
  // await delay(500)
  // text.innerText = "Starting in 1"
  // lookBackward()
  // await delay(500)
  // text.innerText = "Gooo!!!"
  const {tree1, tree2, tree3, castle, slide, rock, 
    bush1, bush2, bush3, bush4, bush5, tree4,tree5,
          } = await loadObjek();
  scene.add(tree1, tree2, tree3, castle, slide, rock,
    bush1, bush2, bush3, bush4, bush5, tree4,tree5,
    );
  bgMusic.play()
  start();
}

function start(){
  gameStat = "started";
}


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
const movetwo = [];
const moveone = [];
const movenull = [];
const cubes = [];

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
    // var ccube = new cubetiles(geometry,material,0);
    // ccube.cube.castShadow = true;
    // ccube.cube.receiveShadow = true;

    // ccube.cube.position.set(getrand(),getrand()+50,getrand());
    
    
    // cubes.add(ccube);
    // scene.add(ccube.cube);
    // cubes.push(ccube);
    // console.log(cubes.length);
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
controls.minDistance = 50;
controls.maxDistance = 500;
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

//panorama
const panorama = new THREE.CubeTextureLoader();
const sky = panorama.load([
  './assets/panorama/px.jpg', './assets/panorama/nx.jpg',
  './assets/panorama/py.jpg', './assets/panorama/ny.jpg',
  './assets/panorama/pz.jpg', './assets/panorama/nz.jpg'
]);
scene.background = sky;

// const color_black = new THREE.Color("rgb(42,42,42)");
// scene.background = color_black ;

let geo = new THREE.BoxBufferGeometry(0, 0, 0)
let mat = new THREE.MeshLambertMaterial({
    // color: "white"
})
let mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)

let tex = new THREE.TextureLoader().load("./assets/grass.jpg")
tex.anisotropy = 100
tex.repeat.set(50, 50)
tex.wrapT = THREE.RepeatWrapping
tex.wrapS = THREE.RepeatWrapping
geo = new THREE.PlaneBufferGeometry(1500, 1500)
mat = new THREE.MeshLambertMaterial({
  map: tex
})
mesh = new THREE.Mesh(geo, mat)
mesh.position.set(0, -5, 0)
mesh.rotation.set(Math.PI / -2, 0, 0)
scene.add(mesh)

let axis = new THREE.Vector3(0, 1, 0)
// function updateCamera() {
//   camera.position.applyAxisAngle(axis, 0.01)
// }


const geometry = new THREE.BoxGeometry(10,10,10);
box2048(2);
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
solarLight.castShadow = true;
solarLight.shadow.camera.visible = true;
scene.add(solarLight);

solarLight.shadow.mapSize.width = 512; // default
solarLight.shadow.mapSize.height = 512; // default
solarLight.shadow.camera.near = 10; // default
solarLight.shadow.camera.far = 500; // default

// const helper = new THREE.CameraHelper( solarLight.shadow.camera );
// scene.add(new THREE.CameraHelper(camera)) 
// scene.add( helper );

// let pLight = new THREE.PointLight(0xffffff, 0.2);
// pLight.position.set(1000, 1000, 1000);
// scene.add(pLight);

// let pLight2 = new THREE.PointLight(0xffffff, 1);
// pLight2.position.set(-500, 0, 500);
// scene.add(pLight2);

let pLight3 = new THREE.PointLight(0xffffff, 1);
pLight3.position.set(-500, 1000, -500);
scene.add(pLight3);

// const helper2 = new THREE.CameraHelper( pLight3.shadow.camera );
// scene.add( helper2 );

scene.fog = new THREE.Fog( 0xffffff, 100, 10000 ); 

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
      if(framecounter == 4){
        var ccube = new cubetiles(geometry,material,0);
        ccube.cube.castShadow = true;
        ccube.cube.receiveShadow = true;
    
        ccube.cube.position.set(getrand(),getrand()+50,getrand());
        
        
        // cubes.add(ccube);
        scene.add(ccube.cube);
        cubes.push(ccube);
        console.log(cubes.length);
      }
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