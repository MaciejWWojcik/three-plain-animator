'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var three_1 = require('three');
var plain_animator_1 = require('../../../plain-animator');
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
  scene.background = new three_1.Color('#e2cd39');
  camera.position.z = 1000;
  return scene;
}
function animate(timestamp) {
  renderer.render(scene, camera);
  animator.animate();
  mesh.rotateY(-0.005);
  requestAnimationFrame(animate);
}
function createAnimatedMesh() {
  var texturePath = 'textures/homer.png';
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  animator = new plain_animator_1.PlainAnimator(new three_1.TextureLoader().load(texturePath), 4, 4, 10, 10);
  var geometry = new three_1.BoxGeometry(500, 500, 500);
  var texture = animator.init();
  /* @ts-ignore due to type errors from using PlanAnimator from local files, not from node_modules */
  var material = new three_1.MeshBasicMaterial({ map: texture, transparent: false });
  var mesh = new three_1.Mesh(geometry, material);
  mesh.rotateX(0.4);
  mesh.rotateY(0.3);
  mesh.position.set(0, 0, 100);
  return mesh;
}
var scene = initScene();
var mesh = createAnimatedMesh();
scene.add(mesh);
animate();
