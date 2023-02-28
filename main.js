import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm";

let scene, camera, renderer, pointLight, controls, sphere, plane, octahedron;

window.addEventListener("load", init);

function init() {
  let gui = new GUI();

  //シーン
  scene = new THREE.Scene();

  // カメラ
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 500);

  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // テクスチャを追加
  let texture = new THREE.TextureLoader().load("./textures/earth.jpg");

  // ジオメトリの作成 (半径、ワイドセグメント＝ポリゴンの量、ハイトセグメント)
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32);

  // マテリアル（材質）作成
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: texture });

  // メッシュ (ジオメトリとマテリアルを合成して、物体を作る)
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  //デバッグ
  gui.add(ballMesh.position, "x").min(-3).max(3).step(0.01).name("transformX");
  gui.add(ballMesh.position, "y").min(-3).max(3).step(0.01);
  gui.add(ballMesh.position, "z").min(-3).max(3).step(0.01);

  gui.add(ballMesh.rotation, "x").min(-3).max(3).step(0.01);
  gui.add(ballMaterial, "wireframe");
  gui.addColor(ballMaterial, "color");

  // 平行光源を追加
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // ポイント光源を追加
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // ポイント光源の位置を特定する
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  /*
  マテリアルセクション
  */
  // ジオメトリ
  const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const octahedronGeometry = new THREE.OctahedronGeometry(0.5);

  // マテリアル
  const material = new THREE.MeshBasicMaterial();

  //　メッシュ化
  sphere = new THREE.Mesh(sphereGeometry, material);
  plane = new THREE.Mesh(planeGeometry, material);
  octahedron = new THREE.Mesh(octahedronGeometry, material);

  sphere.position.x = -1.5;
  octahedron.position.x = 1.5;

  scene.add(sphere, plane, octahedron);

  // マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  renderer.render(scene, camera);
  animate();
}

// ブラウザのリサイズに対応するための関数
function onWindowResize() {
  // レンダラーのサイズを随時更新
  renderer.setSize(window.innerWidth, window.innerHeight);

  //cameraのアスペクト比を更新する
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  // ポイント光源を球の周りを巡回させる
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );
  // レンダラーの変数を利用して、レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
