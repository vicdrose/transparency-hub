<template>
  <SplashScreen v-if="phase === 'splash'" @done="phase = 'launcher'" />
  <Launcher v-if="phase === 'launcher'" />
</template>

<script setup>
import { ref } from 'vue';
import SplashScreen from './components/SplashScreen.vue';
import Launcher from './components/Launcher.vue';

const phase = ref('splash');
</script>

<style>
/* global styles loaded via main.js */
</style>
