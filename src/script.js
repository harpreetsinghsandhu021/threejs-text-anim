import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvasEl = document.querySelector(".webgl");

// textures
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/checkboard.jpeg");
const matcap = textureLoader.load("/matcap.jpeg");

texture.generateMipmaps = false;

texture.minFilter = THREE.NearestFilter;
const scene = new THREE.Scene();

// fonts
const fontLoader = new THREE.FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new THREE.TextBufferGeometry("Creative  Developer", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();

  const textMaterial = new THREE.MeshNormalMaterial();

  const text = new THREE.Mesh(textGeometry, textMaterial);

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  for (let i = 0; i < 130; i++) {
    const donut = new THREE.Mesh(donutGeometry, textMaterial);
    donut.position.x = (Math.random() - 0.5) * 15;
    donut.position.y = (Math.random() - 0.5) * 15;
    donut.position.z = (Math.random() - 0.5) * 15;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }

  scene.add(text);
});

// debug UI

const gui = new dat.GUI();

const parameters = {
  color: 0xff0000,
  spin: () => {
    console.log("spin");
    gsap.to(mesh.rotation, { y: mesh.rotation.y + 10, duration: 1 });
  },
};
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});

gui.add(parameters, "spin");
// geomatry
const geomatry = new THREE.SphereBufferGeometry(0.8, 16, 16);

const material = new THREE.MeshStandardMaterial();

const mesh = new THREE.Mesh(geomatry, material);

// debug GUI

gui.add(mesh.position, "y", -3, 3, 0.01).name("cube elevation");
gui.add(mesh.position, "x", -3, 3, 0.01);
gui.add(mesh.position, "z", -3, 3, 0.01);

// lights

const pointLight = new THREE.PointLight("#fff", 3, 100);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

window.addEventListener("resize", (e) => {
  sizes.width = e.target.innerWidth;
  sizes.height = e.target.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

window.addEventListener("dblclick", (e) => {
  if (!document.fullscreenElement) {
    canvasEl.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvasEl);

// renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvasEl,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
