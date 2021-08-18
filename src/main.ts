import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  BufferAttribute,
  Line,
  AmbientLight,
  DirectionalLight,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup Câmera, Scene e Renderer

const scene = new Scene();

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criando um cubo

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.add(cube);

cube.scale.set(0.2, 0.2, 0.2);

camera.position.z = 5;

// Desenhando linha

const lineMaterial = new LineBasicMaterial({ color: 0x00ff00 });
const linePoints = [];
linePoints.push(new Vector3(-5, 0, 0));
linePoints.push(new Vector3(5, 0, 0));

const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
const line = new Line(lineGeometry, lineMaterial);
// scene.add(line);
renderer.render(scene, camera);

// Load the Orbitcontroller
const controls = new OrbitControls(camera, renderer.domElement);

// Load Light
const ambientLight = new AmbientLight(0xcccccc);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Carregando modelo 3D

const loader = new GLTFLoader();

loader.load(
  './assets/object.glb',
  async function (gltf) {
    const monster = gltf.scene.children[0];
    // scene.add(gltf.scene);
    console.log((monster as any).geometry);

    // Criando Geometria

    const newGeometry = new BufferGeometry();

    newGeometry.setAttribute(
      'position',
      (monster as any).geometry.attributes.position
    );
    newGeometry.setAttribute(
      'normal',
      (monster as any).geometry.attributes.normal
    );
    newGeometry.setAttribute('uv', (monster as any).geometry.attributes.uv);

    console.log(newGeometry);

    const newMaterial = new MeshBasicMaterial({ color: 0xff0000 });
    const newMesh = new Mesh(newGeometry, newMaterial);

    scene.add(newMesh);

    for (let i = 0; i < (monster as any).geometry.index.array.length; i++) {
      newGeometry.setIndex(
        new BufferAttribute(
          ((monster as any).geometry.index.array as Array<number>).filter(
            (value, index) => index <= i
          ),
          1
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Andar com a câmera
const cameraState = {
  up: false,
  down: false,
};

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 'w') {
    cameraState.up = true;
  }
  if (key === 's') {
    cameraState.down = true;
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key;

  if (key === 'w') {
    cameraState.up = false;
  }
  if (key === 's') {
    cameraState.down = false;
  }
});

// Loop de animação

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  if (cameraState.up) {
    camera.position.z -= 0.5;
  }
  if (cameraState.down) {
    camera.position.z += 0.5;
  }

  renderer.render(scene, camera);
}
animate();
