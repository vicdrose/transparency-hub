<template>
  <div class="navbar">
    <div class="navbar__words" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <transition name="word-fade" mode="out-in">
        <span :key="product.name" class="navbar__word">{{ product.name }}</span>
      </transition>
    </div>

    <div class="navbar__buttons">
      <button class="navbar__btn" type="button" @click="$emit('left')" aria-label="Previous">
        <span class="navbar__btn-ic">&#9664;</span>
      </button>
      <button class="navbar__btn navbar__btn--select" type="button" @click="$emit('select')" aria-label="Launch">
        <span class="navbar__btn-ic">&#9654;</span>
      </button>
      <button class="navbar__btn" type="button" @click="$emit('right')" aria-label="Next">
        <span class="navbar__btn-ic">&#9654;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['left', 'right', 'select']);

let touchStartX = 0;

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function onTouchEnd(e) {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) emit('right');
    else emit('left');
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding-bottom: 8px;
  width: 100%;
}

.navbar__words {
  min-height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  touch-action: pan-x;
}

.navbar__word {
  font-size: clamp(26px, 7vw, 40px);
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.5);
}

.word-fade-enter-active,
.word-fade-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.word-fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.word-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.navbar__buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.navbar__btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.2s ease, border-color 0.2s ease;
  touch-action: manipulation;
}

.navbar__btn:active {
  transform: scale(0.9);
  background: rgba(255, 255, 255, 0.18);
}

.navbar__btn--select {
  width: 72px;
  height: 72px;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.12);
}

.navbar__btn-ic {
  font-size: 20px;
  line-height: 1;
}

.navbar__btn--select .navbar__btn-ic {
  font-size: 26px;
}
</style>
