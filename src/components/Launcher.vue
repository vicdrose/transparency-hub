<template>
  <div
    class="launcher"
    :style="{ '--bg-product': currentProduct?.color || '#000' }"
  >
    <div class="launcher__bg" />

    <div class="launcher__content">
      <PreviewArea :product="currentProduct" />

      <div class="launcher__blurb" :key="currentProduct?.id">
        <transition name="blurb-fade" mode="out-in">
          <p v-if="currentProduct" :key="currentProduct.id" class="launcher__blurb-text">
            {{ currentProduct.blurb }}
          </p>
        </transition>
      </div>

      <div class="launcher__carousel" ref="carouselRef">
        <ProductCard
          v-for="(product, i) in products"
          :key="product.id"
          :product="product"
          :active="i === selectedIndex"
          @select="selectProduct(i)"
        />
      </div>

      <div class="launcher__hint">
        <span class="launcher__hint-arrows">&larr; &rarr;</span>
        <span>to browse</span>
        <span class="launcher__hint-sep">&middot;</span>
        <span>Enter</span>
        <span>to launch</span>
      </div>
    </div>

    <TransitionOverlay :active="transitioning" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import PreviewArea from './PreviewArea.vue';
import ProductCard from './ProductCard.vue';
import TransitionOverlay from './TransitionOverlay.vue';

const products = [
  {
    id: 'hangout',
    name: 'Hangout',
    url: 'https://vicdrose.github.io/hangout/',
    color: '#7c3aed',
    blurb: 'Step into a shared social space. Chat, vibe, and connect in real time.',
    preview: null,
    icon: null,
    audio: null
  },
  {
    id: 'freestyleking',
    name: 'Freestyle King',
    url: 'https://vicdrose.github.io/freestyleking/',
    color: '#3b82f6',
    blurb: 'The ultimate freestyle wordplay arena. Drop bars, build flows, compete.',
    preview: null,
    icon: null,
    audio: null
  },
  {
    id: 'astrobeats',
    name: 'Astro Beats',
    url: 'https://vicdrose.github.io/astrobeats/',
    color: '#6366f1',
    blurb: 'Where astrology meets music. Your birth chart, your soundtrack.',
    preview: null,
    icon: null,
    audio: null
  },
  {
    id: 'snackrun',
    name: 'Snack Run',
    url: 'https://vicdrose.github.io/delivery-sim/',
    color: '#ef4444',
    blurb: 'Low-poly delivery driving mayhem. Pick up, drop off, don\'t crash.',
    preview: null,
    icon: null,
    audio: null
  }
];

const selectedIndex = ref(0);
const transitioning = ref(false);
const carouselRef = ref(null);
let touchStartX = 0;

const currentProduct = computed(() => products[selectedIndex.value]);

function selectProduct(index) {
  if (transitioning.value) return;
  selectedIndex.value = index;
  transitioning.value = true;
  setTimeout(() => {
    window.location.href = currentProduct.value.url;
  }, 1200);
}

function handleKeydown(e) {
  if (transitioning.value) return;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % products.length;
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + products.length) % products.length;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    selectProduct(selectedIndex.value);
  }
}

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
  if (transitioning.value) return;
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) {
      selectedIndex.value = (selectedIndex.value + 1) % products.length;
    } else {
      selectedIndex.value = (selectedIndex.value - 1 + products.length) % products.length;
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped>
.launcher {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.launcher__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    var(--bg-product) 0%,
    #000 70%
  );
  transition: background 0.6s ease;
  z-index: 0;
}

.launcher__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px;
}

.launcher__blurb {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.launcher__blurb-text {
  font-size: clamp(13px, 2vw, 15px);
  color: var(--text-muted);
  text-align: center;
  max-width: 420px;
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

.launcher__carousel {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.launcher__hint {
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.05em;
}

.launcher__hint-arrows {
  font-size: 14px;
}

.launcher__hint-sep {
  opacity: 0.4;
}
</style>
