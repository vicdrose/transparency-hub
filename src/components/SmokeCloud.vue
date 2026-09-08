<template>
  <canvas ref="canvasRef" class="smoke-cloud" />
</template>

<script setup>
import * as THREE from 'three';
import { ref, defineProps, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  strength: {
    type: Number,
    default: 1.0
  }
});

const canvasRef = ref(null);
let renderer, scene, camera, material, rafId;
let clock = new THREE.Clock();

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uStrength;
  uniform vec3 uColor;

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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec2(11.37, 5.11);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float x0 = uv.x - 0.5;      // -0.5 left .. 0.5 right
    float y0 = 1.0 - uv.y;      // 0 bottom .. 1 top

    // ---- layer 1: soft, local cloud-bank mask directly under the logo ----
    float cy = 0.62 + x0 * 0.12;      // gentle ~12-degree rise with x
    float rx = 0.27;
    float ry = 0.10;
    float r = length(vec2(x0 / rx, (y0 - cy) / ry));

    // wispy edge so the drop-off is not a hard ellipse
    float wobble = fbm(vec2(x0 * 8.0, y0 * 8.0) + uTime * 0.1);
    r += (wobble - 0.5) * 0.35;

    float mask = smoothstep(1.05, 0.30, r);
    mask *= 1.0 - smoothstep(cy + 0.02, cy + 0.10, y0);   // soft fade behind/above logo

    if (mask <= 0.001) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    // ---- layer 2: smoky detail, clipped by the mask ----
    vec2 wind = vec2(uTime * 0.35, uTime * 0.06);
    vec2 p = vec2(x0 * 5.5, y0 * 11.0) + wind;
    float q = fbm(p);
    float q2 = fbm(p + vec2(7.37, 2.71));
    vec2 warp = vec2(q, q2) - 0.5;

    vec2 wp = p + warp * 1.2;
    float n = fbm(wp * 1.2);

    // elongated, streaky noise -> smell of smoke, not puffy cloud
    float streak = fbm(vec2(wp.x * 1.6, wp.y * 0.5));
    n = mix(n, streak, 0.5);
    n = clamp(n, 0.0, 1.0);

    float dens = pow(n, 1.7);

    // keep it soft: cap total opacity around 0.22
    float alpha = clamp(dens * mask * uStrength, 0.0, 0.22);

    vec3 col = mix(uColor * 0.25, uColor, dens);
    col += vec3(0.30) * smoothstep(0.5, 1.0, dens * dens);

    gl_FragColor = vec4(col, alpha);
  }
`;

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
}

function animate() {
  rafId = requestAnimationFrame(animate);
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

onMounted(() => {
  const canvas = canvasRef.value;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uStrength: { value: props.strength },
      uColor: { value: new THREE.Color(0.78, 0.82, 0.88) }
    }
  });

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
.smoke-cloud {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
  pointer-events: none;
}
</style>