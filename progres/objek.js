import {GLTFLoader} from './js/GLTFLoader.js';
import {OBJLoader} from './js/OBJLoader.js';
import { setupModel } from './setupModel.js';

async function loadObjek() {
    const loader = new GLTFLoader();
    // const loader2 = new OBJLoader();
  
    const [
      tree1Data, 
      tree2Data, 
      tree3Data, 
      castleData, 
      slideData,
      rockData,
      bush1Data,
      bush2Data,
      bush3Data,
      bush4Data,
      bush5Data,
      tree4Data,
      tree5Data
      // benchData,
      ] = await Promise.all([
      loader.loadAsync('./assets/playground/GLTF/tree1.glb'),
      loader.loadAsync('./assets/playground/GLTF/tree2.glb'),
      loader.loadAsync('./assets/playground/GLTF/tree3.glb'),
      loader.loadAsync('./assets/castle/scene.gltf'),
      loader.loadAsync('./assets/playground/GLTF/slide.glb'),
      loader.loadAsync('./assets/Rock/scene.gltf'),
      loader.loadAsync('./assets/playground/GLTF/bush1.glb'),
      loader.loadAsync('./assets/playground/GLTF/bush2.glb'),
      loader.loadAsync('./assets/playground/GLTF/bush3.glb'),
      loader.loadAsync('./assets/playground/GLTF/bush4.glb'),
      loader.loadAsync('./assets/playground/GLTF/bush5.glb'),
      loader.loadAsync('./assets/playground/GLTF/tree2.glb'),
      loader.loadAsync('./assets/playground/GLTF/tree3.glb'),
    ]);
  
    // console.log('pohon1', tree1Data);
  
    const tree1 = setupModel(tree1Data);
    tree1.scale.set(10,10,10);
    tree1.position.set(0, -5, -100);
    tree1.castShadow = true;
    tree1.receiveShadow = true;
  
    // console.log('pohon2', tree2Data);
    const tree2 = setupModel(tree2Data);
    tree2.scale.set(10,10,10);
    tree2.position.set(100, -5, 100);
  
    // console.log('pohon3', tree3Data);
    const tree3 = setupModel(tree3Data);
    tree3.scale.set(10,10,10);
    tree3.position.set(-100, -5, 150);

    // console.log('kastil', castleData);
    const castle = setupModel(castleData);
    castle.scale.set(50,50,50);
    castle.position.set(-50, -50, -500);

    // console.log('luncuran', slideData);
    const slide = setupModel(slideData);
    slide.scale.set(10,10,10);
    slide.position.set(-200, -5, 150);

    // console.log('batu', slideData);
    const rock = setupModel(rockData);
    rock.scale.set(10,10,10);
    rock.position.set(-150, -2, 150);

    const bush1 = setupModel(bush1Data);
    bush1.scale.set(5,5,5);
    bush1.position.set(-250, -5, 150);

    const bush2 = setupModel(bush2Data);
    bush2.scale.set(5,5,5);
    bush2.position.set(-250, -5, 100);

    const bush3 = setupModel(bush3Data);
    bush3.scale.set(5,5,5);
    bush3.position.set(-250, -5, 0);

    const bush4 = setupModel(bush4Data);
    bush4.scale.set(5,5,5);
    bush4.position.set(250, -5, -350);

    const bush5 = setupModel(bush5Data);
    bush5.scale.set(5,5,5);
    bush5.position.set(300, -5, 100);

    const tree4 = setupModel(tree4Data);
    tree4.scale.set(10,10,10);
    tree4.position.set(-300, -5, -350);

    const tree5 = setupModel(tree5Data);
    tree5.scale.set(10,10,10);
    tree5.position.set(300, -5, -350);

    // const bench = setupModel(benchData);
    // bench.scale.set(20,20,20);
    // bench.position.set(0,-50,-100);

    return {
      tree1,
      tree2,
      tree3,
      castle,
      slide,
      rock,
      bush1,
      bush2,
      bush3,
      bush4,
      bush5,
      tree4,
      tree5
      // ground,
      // bench,
    };
  }
  
  export { loadObjek };