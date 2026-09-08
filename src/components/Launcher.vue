<template>
  <div class="launcher">
    <ShaderBackground :palette="currentProduct.palette" />

    <div class="launcher__content">
      <div class="launcher__stage" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <FloatingLogo :product="currentProduct" />
      </div>

      <div class="launcher__blurb" :key="currentProduct.id">
        <transition name="blurb-fade" mode="out-in">
          <p :key="currentProduct.id" class="launcher__blurb-text">
            {{ currentProduct.blurb }}
          </p>
        </transition>
      </div>

      <NavBar
        :product="currentProduct"
        @left="cycle(-1)"
        @right="cycle(1)"
        @select="selectProduct"
      />
    </div>

    <TransitionOverlay :active="transitioning" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ShaderBackground from './ShaderBackground.vue';
import FloatingLogo from './FloatingLogo.vue';
import NavBar from './NavBar.vue';
import TransitionOverlay from './TransitionOverlay.vue';
import { beep, selectTone, warmup } from '../lib/sound.js';

const base = import.meta.env.BASE_URL;

const products = [
  {
    id: 'hangout',
    name: 'Hangout',
    url: 'https://vicdrose.github.io/hangout/',
    logo: `${base}logos/hangout.png`,
    palette: ['#4fc3f7', '#29b6f6', '#2878a0', '#0b1b2a'],
    blurb: 'Step into a shared social space. Chat, vibe, and connect in real time.',
    preview: null,
    audio: null
  },
  {
    id: 'freestyleking',
    name: 'Freestyle King',
    url: 'https://vicdrose.github.io/freestyleking/',
    logo: `${base}logos/freestyleking.png`,
    palette: ['#ffd54f', '#f0c800', '#c8a000', '#3a2c00'],
    blurb: 'The ultimate freestyle wordplay arena. Drop bars, build flows, compete.',
    preview: null,
    audio: null
  },
  {
    id: 'astrobeats',
    name: 'Astro Beats',
    url: 'https://vicdrose.github.io/astrobeats/',
    logo: `${base}logos/astrobeats.png`,
    palette: ['#b492ff', '#8a5cf0', '#5a2ea8', '#160824'],
    blurb: 'Where astrology meets music. Your birth chart, your soundtrack.',
    preview: null,
    audio: null
  },
  {
    id: 'snackrun',
    name: 'Snack Run',
    url: 'https://vicdrose.github.io/delivery-sim/',
    logo: `${base}logos/snackrun.png`,
    palette: ['#ffb347', '#f08818', '#c96a00', '#1f1200'],
    blurb: 'Low-poly delivery driving mayhem. Pick up, drop off, don\'t crash.',
    preview: null,
    audio: null
  }
];

const selectedIndex = ref(0);
const transitioning = ref(false);
let touchStartX = 0;

const currentProduct = computed(() => products[selectedIndex.value]);

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function onTouchEnd(e) {
  if (transitioning.value) return;
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) cycle(1);
    else cycle(-1);
  }
}

function cycle(dir) {
  if (transitioning.value) return;
  beep();
  selectedIndex.value =
    (selectedIndex.value + dir + products.length) % products.length;
}

function selectProduct() {
  if (transitioning.value) return;
  selectTone();
  transitioning.value = true;
  setTimeout(() => {
    window.location.href = currentProduct.value.url;
  }, 1200);
}

function handleKeydown(e) {
  if (transitioning.value) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    cycle(1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    cycle(-1);
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectProduct();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('pointerdown', warmup, { once: true });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.launcher {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.launcher__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 20px 20px;
}

.launcher__stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.launcher__blurb {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  flex: none;
}

.launcher__blurb-text {
  font-size: clamp(12px, 2vw, 15px);
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  max-width: 480px;
  line-height: 1.5;
}

.blurb-fade-enter-active,
.blurb-fade-leave-active {
  transition: opacity 0.2s ease;
}

.blurb-fade-enter-from,
.blurb-fade-leave-to {
  opacity: 0;
}
</style>
