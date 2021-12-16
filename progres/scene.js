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


class cubetiles {
  // cube;
  // value;
  // tomove;
  // deleted;
  // gridindex;
  constructor(value){
    this.cube = new THREE.Mesh(geometry,materialcontainer[value]);
    this.value = value+1;
    this.tomove = 0;
  }
  calcindex(){
    this.gridindex = 4 + Math.floor(this.cube.position.x/50) + Math.floor(this.cube.position.z/50)*3 + Math.floor(((this.cube.position.y-10)/50))*9;
  }
  deleting(){
    this.deleted = 1;
  }
  moveOne(){
    this.tomove = 50;
  }
  moveTwo(){
    this.tomove = 100;
  }
  move(){
    this.tomove -= 10;
  }
  canMove(){
    if (this.tomove > 0){
      return true;
    }
    return false;
  } 
  getValue(){
    return Number(this.value);
  }
  getGridIndex(){
    return Number(this.gridindex);
  }
}

//cube container
const gamegrid = new Array(27).fill(0);
const emptygrid = [];
const movetwo = [];
const moveone = [];
const todelete = [];
const tomake = [];
const cubes = [];

function checkEmpty(){
  for(var i = 0; i<gamegrid.length; i++){
    if (gamegrid[i] == 0){
      emptygrid.push(i);
    }
  }
}



//insert box to grid randomly
// const convertedPos = new THREE.Vector3();
// function spawnbox(){
//   var num = Math.floor(Math.random()*emptygrid.length);
//   gamegrid[emptygrid[num]] = 1;
//   emptygrid.length = 0;
//   var x,y,z;
//   x = (num % 3) -1;
//   y = Math.floor(num/9);
//   z = Math.floor((num %9)/3) -1;
//   convertedPos.set(x,y,z);
// }

//move vector


async function xtoZ(xIndex,x,yIndex,y,zIndex,z){
  if(z!=0){
    if(z == y){
        moveone.push(yIndex);
        todelete.push(zIndex);
        todelete.push(yIndex);
        tomake.push(zIndex);
        tomake.push(z+1);
        //gamegrid[zIndex]= z+y;
        //gamegrid[yIndex]= 0 ;
        if(x != 0){
          moveone.push(xIndex);
          //gamegrid[yIndex]= x;
          //gamegrid[xIndex]=0;
        }
        
    }
    else if(y == 0){
      
      if ( x== z){
        movetwo.push(xIndex);
        todelete.push(xIndex);
        todelete.push(zIndex);
        tomake.push(zIndex);
        tomake.push(z+1);
      }
      else if(x != 0){
        moveone.push(xIndex);
        //gamegrid[yIndex]= x;
        //gamegrid[xIndex]= 0;
      }
    }
    else{
      if(x ==y){
        moveone.push(xIndex);
        todelete.push(yIndex);
        todelete.push(xIndex);
        tomake.push(yIndex);
        tomake.push(x+1);
        //gamegrid[yIndex]= x+y;
        //gamegrid[xIndex]= 0;
      }
    }
  }
  else{
    if(y !=0){
      if(x == y){
        movetwo.push(xIndex);
        moveone.push(yIndex);
        todelete.push(yIndex);
        todelete.push(xIndex);
        tomake.push(zIndex);
        tomake.push(x+1);
        //gamegrid[zIndex] = x+y;
        //gamegrid[yIndex]= 0;
        //gamegrid[xIndex]= 0;
      }
      else{
        moveone.push(yIndex);
        //gamegrid[zIndex]=y;
        //gamegrid[yIndex]=0;
        if(x !=0){
          moveone.push(xIndex);
          //gamegrid[yIndex]=x;
          //gamegrid[xIndex]=0;
        }
      }
    }
    else{ 
      if(x!=0){
        movetwo.push(xIndex);
        //gamegrid[xIndex]=0;
        //gamegrid[zIndex]=x;
      }
    }
  }
}

 function moveX(pos){
  if(pos == 1){
    for(var i= 0;i<9;i++){
      xtoZ(i*3,gamegrid[i*3],i*3+1,gamegrid[i*3+1],i*3+2,gamegrid[i*3+2]);
    }
  }
  if(pos == -1){
    for(var i = 9;i>0;i--){
      xtoZ(i*3-1,gamegrid[i*3-1],i*3-2,gamegrid[i*3-2],i*3-3,gamegrid[i*3-3]);
    }
  }
}
//move vector

function moveY(pos){
  if(pos == 1){
    for(var i = 0;i<9;i++){
      xtoZ(i,gamegrid[i],i+9,gamegrid[i+9],i+18,gamegrid[i+18]);
    }
  }
  if(pos == -1){
    for(var i = 27;i>18;i--){
      xtoZ(i-1,gamegrid[i-1],i-10,gamegrid[i-10],i-19,gamegrid[i-19]);
    }
  }
}

function moveZ(pos){
  if(pos == 1){
    for (var i = 0;i<3;i++){
      for(var j = 0;j<3;j++){
        xtoZ(i*9+j,gamegrid[i*9+j],i*9+j+3,gamegrid[i*9+j+3],i*9+j+6,gamegrid[i*9+j+6]);
      }
    }
  }
  if(pos == -1){
    for(var i = 3; i>0;i--){
      for(var j = 3; j>0;j--){
        xtoZ(i*9-j,gamegrid[i*9-j],i*9-j-3,gamegrid[i*9-j-3],i*9-j-6,gamegrid[i*9-j-6]);
      }
    }
  }

}

const mov = new THREE.Vector3();

// function removeselectcube(box){
//   if (box.deleted == 1){
//     scene.remove(box.cube);
//   }
// }
function removecube(box){
  // box.remove();
  scene.remove(box.cube);
}
function gridmanager(box){
  // box.calcindex();
  // for(var i=0;i<moveone.length;i++){

  // }
  var i;
  for(i = moveone.length;i>0;i--){
    if(box.gridindex == moveone[i-1]){
      box.moveOne();
      moveone.splice(i-1,1);
      break;
    }
  }
  for(i = movetwo.length;i>0;i--){
    if(box.gridindex == movetwo[i-1]){
      box.moveTwo();
      movetwo.splice(i-1,1);
      break;
    }
  }
  for(i = todelete.length;i>0;i--){
    if(box.gridindex == todelete[i-1]){
      box.deleting();
      // todelete.splice(i-1,1);
      break;
    }
  }
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
      cubes.length = 0;
      return;
    }
    if(framecounter <= 10){
      return;
    }
    if (keyCode == 87){
      mov.set(0,0,-10);
      moveZ(-1);
    }
    if (keyCode == 83){
      mov.set(0,0,10);
      moveZ(1);
    }
    if (keyCode == 65){
      mov.set(-10,0,0);
      moveX(-1);
    }
    if (keyCode == 68){
      mov.set(10,0,0);
      moveX(1);
    }
    if (keyCode == 69){
      mov.set(0,10,0);
      moveY(1);
    }
    if (keyCode == 81){
      mov.set(0,-10,0);
      moveY(-1);
    }
    
    framecounter = 0;
    if(keyCode == 32){
      // framecounter = 10;
    }
    // cubes.forEach(gridmanager);
    for(var i=0;i<cubes.length;i++){
      gridmanager(cubes[i]);
    }


  
    // var ccube = new THREE.Mesh(geometry,material);
    // var ccube = new cubetiles(geometry,material,0);
    // ccube.cube.castShadow = true;
    // ccube.cube.receiveShadow = true;

    // ccube.cube.position.set(getrand(),getrand()+50,getrand());
    
    
    // cubes.add(ccube);
    // scene.add(ccube.cube);
    // cubes.push(ccube);
    // console.log(cubes.length);
    // moveone.length = 0;
    // movetwo.length = 0;
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
let mesh = new THREE.Mesh(geo, mat);
scene.add(mesh)

let tex = new THREE.TextureLoader().load("./assets/grass.jpg")
tex.anisotropy = 100
tex.repeat.set(50, 50)
tex.wrapT = THREE.RepeatWrapping
tex.wrapS = THREE.RepeatWrapping
geo = new THREE.PlaneBufferGeometry(1500, 1500);
mat = new THREE.MeshLambertMaterial({
  map: tex
})
mesh = new THREE.Mesh(geo, mat);
mesh.position.set(0, -5, 0);
mesh.rotation.set(Math.PI / -2, 0, 0);
scene.add(mesh);

let axis = new THREE.Vector3(0, 1, 0)
// function updateCamera() {
//   camera.position.applyAxisAngle(axis, 0.01)
// }


const geometry = new THREE.BoxGeometry(20,20,20);
let n = 1024;
box2048(n);
const loader = new THREE.TextureLoader();
const materialcontainer = [];

for(var i = 1;i<=11;i++){
  box2048(Math.pow(2,i));
  var materials = new THREE.MeshPhongMaterial({
    map: loader.load(path),
    shininess: 30
  });
  materialcontainer.push(materials);
}

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
if(!box.canMove()){
  return;
}

//checking box boundaries
  // if(mov.getComponent(0)!=0){
  //   if(mov.x > 0){
  //     if(box.cube.position.x == 50){
  //       return;
  //     }
  //   }
  //   else{
  //     if(box.cube.position.x == -50){
  //       return;
  //     }
  //   }
  // }
  // if(mov.getComponent(1)!=0){
  //   if(mov.y > 0){
  //     if(box.cube.position.y == 110){
  //       return;
  //     }
  //   }
  //   else{
  //     if(box.cube.position.y == 10){
  //       return;
  //     }
  //   }
  // }
  // if(mov.getComponent(2)!=0){
  //   if(mov.z > 0){
  //     if(box.cube.position.z == 50){
  //       return;
  //     }
  //   }
  //   else { 
  //     if(box.cube.position.z == -50){
  //       return;
  //     }
  //   }
  // }
//endof checking box boundaries
  box.move();
  box.cube.position.add(mov);
}

// function updatepos(){
  // cubes.forEach(move);
// }

 function gridExec(){


  for(var i = cubes.length;i>0;i--){
    if (cubes[i-1].deleted == 1){
      scene.remove(cubes[i-1].cube);
      cubes.splice(i-1,1);
    }
  }
  while(tomake.length>1){
    var num = tomake.shift();
    x = (num % 3) -1;
    y = Math.floor(num/9);
    z = Math.floor((num %9)/3) -1;
    var ccube = new cubetiles(tomake.shift()-1);
    ccube.cube.castShadow = false;
    ccube.cube.receiveShadow = true;
    ccube.cube.position.set(x,y,z);
    ccube.cube.position.multiplyScalar(50);
    ccube.cube.position.y +=10;
    scene.add(ccube.cube);
    cubes.push(ccube);
    console.log(num);
  }
  
  checkEmpty();
  
  if(emptygrid.length>0){

    //spawning newbox randomly start
    var num = Math.floor(Math.random()*(emptygrid.length));
    console.log(num);
    console.log(emptygrid);
    gamegrid[emptygrid[num]] = 1;
    var x,y,z;
    x = ((emptygrid[num] % 3) -1)*50;
    y = (Math.floor(emptygrid[num]/9)*50)+10;
    z = (Math.floor((emptygrid[num] %9)/3) -1)*50;
    var ccube = new cubetiles(0);
    ccube.cube.castShadow = false;
    ccube.cube.receiveShadow = true;
    ccube.cube.position.set(x,y,z);
    scene.add(ccube.cube);
    cubes.push(ccube);
    emptygrid.length = 0;
  }

  console.log(movetwo);
  console.log(moveone);
  
  console.log(tomake);
  gamegrid.fill(0);
  for(var i = 0 ; i< cubes.length;i++){
    cubes[i].calcindex();
    // console.log(cubes[i].gridindex);
    // console.log(cubes[i].getValue());
    gamegrid[cubes[i].getGridIndex()]=cubes[i].getValue();
  }
  console.log(gamegrid);
  console.log(cubes.length);
  todelete.length = 0;
}

var framecounter = 11;
const animate = () =>
{
    controls.update();
    //render
    // sphereCamera.update(renderer, scene);
    if(framecounter<10){
      // updatepos();
      for(var i =0;i<cubes.length;i++){
        move(cubes[i]);
      }
      if(framecounter == 9){
        gridExec();
      }
    }
    renderer.render(scene, camera);
    framecounter +=1;
    if(framecounter >120000){
      framecounter = 11;
    }
    window.requestAnimationFrame(animate);
}
animate();