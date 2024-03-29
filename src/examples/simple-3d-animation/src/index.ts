import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { PlainAnimator } from '../../../plain-animator';

let camera: OrthographicCamera;
let renderer: WebGLRenderer;
let animator: PlainAnimator;

function initScene() {
  const frustumSize = 1000;
  const scene = new Scene();
  const aspect = window.innerWidth / window.innerHeight;
  camera = new OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    2000,
  );
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene.background = new Color('#e2cd39');
  camera.position.z = 1000;
  return scene;
}

function animate(timestamp?) {
  renderer.render(scene, camera);
  animator.animate();
  mesh.rotateY(-0.005);
  requestAnimationFrame(animate);
}

function createAnimatedMesh() {
  const texturePath = 'textures/homer.png';
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  animator = new PlainAnimator(new TextureLoader().load(texturePath), 4, 4, 10, 10);

  const geometry = new BoxGeometry(500, 500, 500);
  const texture = animator.init();
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */

  const material = new MeshBasicMaterial({ map: texture, transparent: false });
  const mesh = new Mesh(geometry, material);
  mesh.rotateX(0.4);
  mesh.rotateY(0.3);
  mesh.position.set(0, 0, 100);
  return mesh;
}

const scene = initScene();
const mesh = createAnimatedMesh();
scene.add(mesh);

animate();
