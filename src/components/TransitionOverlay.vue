<template>
  <transition name="overlay">
    <div v-if="active" class="transition-overlay">
      <img src="/logo-ti.jpg" alt="" class="transition-overlay__logo" />
    </div>
  </transition>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.transition-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transition-overlay__logo {
  width: min(200px, 40vw);
  height: auto;
  border-radius: 8px;
  animation: overlay-pulse 0.6s ease;
}

@keyframes overlay-pulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.overlay-enter-active {
  transition: opacity 0.3s ease;
}

.overlay-leave-active {
  transition: opacity 0.4s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
