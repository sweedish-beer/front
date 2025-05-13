<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
    <MusicPlayer v-if="currentTrack" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { usePlayerStore } from '@/stores/player';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
  import MusicPlayer from '@/components/player/MusicPlayer.vue';

  const playerStore = usePlayerStore();
  const { currentTrack } = storeToRefs(playerStore);
</script>

<style>
  @import '@/assets/css/base.css';

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding-bottom: 100px;
    /* Space for the music player */
  }
</style>