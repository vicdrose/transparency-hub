<template>
  <canvas ref="canvasRef" class="smoke-cloud" />
</template>

<script setup>
import * as THREE from 'three';
import { ref, defineProps, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  horizon: {
    type: Number,
    default: 0.55
  },
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
  uniform float uAspect;
  uniform float uHorizon;
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

    // below horizon -> positive (taller band), 0 at the horizon line
    float off = (1.0 - vUv.y) - uHorizon;
    if (off <= 0.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    float h = max(off, 1e-4);
    float dist = min(1.0 / h, 40.0);

    // tilted ground plane: flat-looking surface at ~12 degrees
    float slope = 0.21;
    float z = dist * 1.1;
    float x = (uv.x - 0.5) * dist * 2.4 * uAspect + z * slope;

    vec2 wind = vec2(uTime * 0.4, uTime * 0.06);

    vec2 p = vec2(x, z) + wind;
    float q = fbm(p * 2.0);
    float q2 = fbm(p * 2.0 + vec2(7.37, 2.71));
    vec2 warp = vec2(q, q2) - 0.5;

    vec2 wp = p + warp * 1.5;
    float n = fbm(wp * 1.15);

    // elongated, streaky noise -> smell of smoke, not puffy cloud
    float streak = fbm(vec2(wp.x * 1.7, wp.y * 0.55));
    n = mix(n, streak, 0.5);

    // slowly rising tendrils
    float wisp = fbm(p * 1.2 - vec2(0.0, uTime * 0.12));
    n = clamp(n + wisp * 0.4, 0.0, 1.0);

    float dens = pow(n, 1.6);

    float fogFade = smoothstep(0.004, 0.06, h);

    float alpha = clamp(dens * uStrength * fogFade, 0.0, 1.0);
    if (alpha < 0.02) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec3 col = mix(uColor * 0.22, uColor, n);
    col += vec3(0.30) * smoothstep(0.5, 1.0, n * n);

    gl_FragColor = vec4(col, alpha);
  }
`;

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  material.uniforms.uAspect.value = w / h;
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
      uAspect: { value: 1 },
      uHorizon: { value: props.horizon },
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