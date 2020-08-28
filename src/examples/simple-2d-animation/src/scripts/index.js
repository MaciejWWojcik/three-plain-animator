'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var THREE = require('three');
var three_1 = require('three');
var plain_animator_1 = require('three-plain-animator/lib/plain-animator');
/* @ts-ignore */
var camera;
var renderer;
var animator;
function initScene() {
  var frustumSize = 1000;
  var scene = new three_1.Scene();
  var aspect = window.innerWidth / window.innerHeight;
  camera = new three_1.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    2000,
  );
  renderer = new three_1.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  var raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1));
  var mouse = new THREE.Vector2();
  scene.background = new THREE.Color('#1976D2');
  camera.position.z = 10;
  return scene;
}
function animate(timestamp) {
  renderer.render(scene, camera);
  animator.animate();
  requestAnimationFrame(animate);
}
function createAnimatedMesh() {
  var texturePath = 'textures/texture.png';
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  animator = new plain_animator_1.PlainAnimator(new three_1.TextureLoader().load(texturePath), 4, 4, 10, 10);
  var geometry = new three_1.PlaneGeometry(512, 512);
  var texture = animator.init();
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  var material = new three_1.MeshBasicMaterial({ map: texture, transparent: true });
  var mesh = new three_1.Mesh(geometry, material);
  mesh.position.set(0, 0, 1);
  return mesh;
}
var scene = initScene();
var mesh = createAnimatedMesh();
scene.add(mesh);
animate();
