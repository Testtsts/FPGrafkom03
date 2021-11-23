let path;

function box2048(n){
  switch (n) {
    case 2:
      path = './texture/2.png';
      break;
    case 4:
      path = './texture/4.png';
      break;
    case 8:
      path = './texture/8.png';
      break;
    case 16:
      path = './texture/16.png';
      break;
    case 32:
      path = './texture/32.png';
      break;
    case 64:
      path = './texture/64.png';
      break;
    case 128:
      path = './texture/128.png';
      break;
    case 256:
      path = './texture/256.png';
      break;
    case 512:
      path = './texture/512.png';
      break;
    case 1024:
      path = './texture/1024.png';
      break;
    case 2048:
      path = './texture/2048.png';
      break;
  }
  return path;
}

export { path, box2048 };


