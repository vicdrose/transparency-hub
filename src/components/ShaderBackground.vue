<template>
  <canvas ref="canvasRef" class="shader-bg" />
</template>

<script setup>
import * as THREE from 'three';
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  palette: {
    type: Array,
    default: () => ['#7c3aed', '#3b82f6', '#0f172a']
  }
});

const canvasRef = ref(null);
let renderer, scene, camera, material, rafId;
let clock = new THREE.Clock();

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv;
    p.x += uTime * 0.03;
    p.y -= uTime * 0.015;

    float f = fbm(p * 2.2);
    float f2 = fbm(p * 3.5 + vec2(f * 0.4, f * 0.3) + uTime * 0.05);

    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.7, f));
    col = mix(col, uColorC, smoothstep(0.15, 0.75, f2));
    col = mix(col, uColorD, smoothstep(0.35, 0.95, f * 0.6 + f2 * 0.4));

    float vig = smoothstep(1.5, 0.35, length(uv - 0.5) * 1.25);
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return new THREE.Color((n >> 16) & 255, (n >> 8) & 255, n & 255).multiplyScalar(1 / 255);
}

function applyPalette(palette, immediate = false) {
  if (!material) return;
  const c = palette.map(hexToRgb);
  if (immediate) {
    material.uniforms.uColorA.value.copy(c[0]);
    material.uniforms.uColorB.value.copy(c[1] || c[0]);
    material.uniforms.uColorC.value.copy(c[2] || c[1] || c[0]);
    material.uniforms.uColorD.value.copy(c[3] || c[2] || c[0]);
  }
}

watch(
  () => props.palette,
  (palette) => {
    const swatch = [uA, uB, uC, uD].map((v) => v.clone());
    const target = palette.map(hexToRgb);
    const started = Date.now();
    const dur = 700;

    function step() {
      const t = Math.min(1, (Date.now() - started) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      [uA, uB, uC, uD].forEach((u, i) => {
        u.lerpColors(swatch[i], target[i], e);
      });
      if (t < 1) requestAnimationFrame(step);
    }
    step();
  }
);

let uA, uB, uC, uD;

function animate() {
  rafId = requestAnimationFrame(animate);
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
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

onMounted(() => {
  const canvas = canvasRef.value;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  uA = new THREE.Uniform(new THREE.Color());
  uB = new THREE.Uniform(new THREE.Color());
  uC = new THREE.Uniform(new THREE.Color());
  uD = new THREE.Uniform(new THREE.Color());

  material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uColorA: uA,
      uColorB: uB,
      uColorC: uC,
      uColorD: uD
    },
    depthTest: false
  });

  applyPalette(props.palette, true);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
.shader-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
