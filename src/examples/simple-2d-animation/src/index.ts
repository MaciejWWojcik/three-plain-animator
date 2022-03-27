import {
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  TextureLoader,
  WebGLRenderer,
  Color
} from "three";
import { PlainAnimator } from "three-plain-animator";

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
    2000
  );
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene.background = new Color("#1976D2");
  camera.position.z = 10;
  return scene;
}

function animate(timestamp?: number) {
  renderer.render(scene, camera);
  animator.animate();
  requestAnimationFrame(animate);
}

function createAnimatedMesh() {
  const texturePath = "textures/texture.png";
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  animator = new PlainAnimator(new TextureLoader().load(texturePath), 4, 4, 10, 10);

  const geometry = new PlaneGeometry(512, 512);
  const texture = animator.init();
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  const material = new MeshBasicMaterial({ map: texture, transparent: true });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(0, 0, 1);
  return mesh;
}

const scene = initScene();
const mesh = createAnimatedMesh();

scene.add(mesh);

animate();
