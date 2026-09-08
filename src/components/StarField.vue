<template>
  <canvas ref="canvasRef" class="star-field" />
</template>

<script setup>
import * as THREE from 'three';
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let renderer, scene, camera, points, rafId;
let clock = new THREE.Clock();

const STAR_COUNT = 900;

const VERT = `
  attribute float aScale;
  attribute float aOpacity;
  varying float vOpacity;
  void main() {
    vOpacity = aOpacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * (220.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAG = `
  precision mediump float;
  varying float vOpacity;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= vOpacity;
    if (alpha < 0.01) discard;
    vec3 starCol = mix(vec3(0.82, 0.88, 1.0), vec3(1.0, 1.0, 1.0), vOpacity);
    gl_FragColor = vec4(starCol, alpha);
  }
`;

function buildGeometry() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const scales = new Float32Array(STAR_COUNT);
  const opacities = new Float32Array(STAR_COUNT);
  // Deeper stars are smaller & dimmer, nearer stars are brighter.
  for (let i = 0; i < STAR_COUNT; i++) {
    const z = 4 - Math.random() * 8; // 4 .. -4
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 7;
    positions[i * 3] = Math.cos(t) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = z;
    const depth = THREE.MathUtils.clamp(1 + (4 - z) / 8, 0.35, 1.25);
    scales[i] = (0.4 + Math.random() * 1.6) * depth;
    opacities[i] = (0.35 + Math.random() * 0.65) * THREE.MathUtils.clamp(depth * 1.4, 0.4, 1.2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
  return geometry;
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate() {
  rafId = requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  points.rotation.z = t * 0.012;
  points.rotation.y = t * 0.008;
  // subtle zoom drift
  points.position.z = Math.sin(t * 0.05) * 0.3;
  renderer.render(scene, camera);
}

onMounted(() => {
  const canvas = canvasRef.value;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 20);
  camera.position.z = 1.6;

  const geometry = buildGeometry();
  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  resize();
  animate();
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', resize);
  if (renderer) renderer.dispose();
});
</script>

<style scoped>
.star-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
  pointer-events: none;
}
</style>