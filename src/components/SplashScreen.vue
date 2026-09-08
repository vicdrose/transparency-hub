<template>
  <div class="splash" :class="{ 'splash--visible': visible }">
    <img src="/logo-ti.jpg" alt="Transparency Interactive" class="splash__logo" />
    <div class="splash__text">Transparency Interactive</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['done']);
const visible = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true;
  });
  setTimeout(() => {
    emit('done');
  }, 2000);
});
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.splash--visible {
  opacity: 1;
}

.splash__logo {
  width: min(300px, 60vw);
  height: auto;
  border-radius: 12px;
  opacity: 0;
  transform: scale(0.9);
  animation: splash-logo-in 1s 0.3s ease forwards;
}

.splash__text {
  margin-top: 20px;
  font-size: clamp(16px, 3vw, 24px);
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #fff;
  opacity: 0;
  animation: splash-text-in 0.8s 0.8s ease forwards;
}

@keyframes splash-logo-in {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes splash-text-in {
  to {
    opacity: 1;
  }
}
</style>
