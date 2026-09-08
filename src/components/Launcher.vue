<template>
  <div class="launcher">
    <SmokeCloud />
    <StarField :palette="currentProduct.palette" />

    <div class="launcher__content">
      <div class="launcher__title">
        <span class="launcher__title-line">Transparency</span>
        <span class="launcher__title-line">Interactive</span>
      </div>

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
import SmokeCloud from './SmokeCloud.vue';
import StarField from './StarField.vue';
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
    palette: ['#64c8fa', '#3cb4fa', '#2878aa', '#283c50'],
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

let navTimer = null;

function selectProduct() {
  if (transitioning.value) return;
  selectTone();
  transitioning.value = true;
  navTimer = setTimeout(() => {
    window.location.href = currentProduct.value.url;
  }, 1200);
}

function resetTransition() {
  if (navTimer) {
    clearTimeout(navTimer);
    navTimer = null;
  }
  if (transitioning.value) {
    transitioning.value = false;
  }
}

function handlePageshow(e) {
  resetTransition();
}

function handleVisibility() {
  if (!document.hidden) resetTransition();
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
  window.addEventListener('pageshow', handlePageshow);
  document.addEventListener('visibilitychange', handleVisibility);
});

onUnmounted(() => {
  clearTimeout(navTimer);
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('pageshow', handlePageshow);
  document.removeEventListener('visibilitychange', handleVisibility);
});
</script>

<style scoped>
.launcher {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #000;
}

.launcher__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 20px 20px;
}

.launcher__title {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding-top: 6px;
  user-select: none;
  pointer-events: none;
}

.launcher__title-line {
  font-size: clamp(16px, 3.2vw, 24px);
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.25);
  line-height: 1.15;
  white-space: nowrap;
}

.launcher__stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.launcher__blurb {
  max-height: 84px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  flex: none;
}

.launcher__blurb::-webkit-scrollbar {
  width: 4px;
}

.launcher__blurb::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
}

.launcher__blurb-text {
  font-size: clamp(12px, 2vw, 15px);
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  max-width: 480px;
  line-height: 1.5;
  margin: auto;
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
