<template>
  <div class="music-player" v-if="currentTrack">
    <div class="player-container">
      <div class="track-info">
        <img :src="trackImage" :alt="currentTrack.attributes.title" class="track-image" />
        <div class="track-details">
          <h3 class="track-title">{{ currentTrack.attributes.title }}</h3>
          <p class="track-performer" v-if="performer">
            {{ performer.attributes.name }}
          </p>
        </div>
      </div>

      <div class="player-controls">
        <button @click="previous" class="control-btn">
          <span class="icon">⏮</span>
        </button>
        <button @click="togglePlay" class="control-btn play-btn">
          <span class="icon">{{ isPlaying ? '⏸' : '▶' }}</span>
        </button>
        <button @click="next" class="control-btn">
          <span class="icon">⏭</span>
        </button>
      </div>

      <div class="player-progress">
        <div class="time">{{ formatTime(currentTime) }}</div>
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="progress-bar" />
        <div class="time">{{ formatTime(duration) }}</div>
      </div>

      <div class="player-volume">
        <span class="icon">🔊</span>
        <input type="range" min="0" max="100" v-model="volume" @input="changeVolume" class="volume-slider" />
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio ref="audioElement" :src="audioUrl" @timeupdate="updateProgress" @loadedmetadata="setDuration"
      @ended="handleEnded"></audio>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { usePlayerStore } from '@/stores/player';
  import { storeToRefs } from 'pinia';

  const playerStore = usePlayerStore();
  const { currentTrack, isPlaying, queue, currentIndex, volume } = storeToRefs(playerStore);

  const audioElement = ref<HTMLAudioElement | null>(null);
  const currentTime = ref(0);
  const duration = ref(0);

  const audioUrl = computed(() => {
    if (!currentTrack.value) return '';
    return `${import.meta.env.VITE_API_URL}${currentTrack.value.attributes.audioFile.data.attributes.url}`;
  });

  const trackImage = computed(() => {
    if (!currentTrack.value || !currentTrack.value.attributes.coverArt?.data) {
      return '/placeholder-cover.jpg';
    }
    return `${import.meta.env.VITE_API_URL}${currentTrack.value.attributes.coverArt.data.attributes.url}`;
  });

  const performer = computed(() => {
    if (!currentTrack.value) return null;
    return currentTrack.value.attributes.performer.data;
  });

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function togglePlay() {
    if (!audioElement.value) return;

    if (isPlaying.value) {
      audioElement.value.pause();
      playerStore.pause();
    } else {
      audioElement.value.play();
      playerStore.play();
    }
  }

  function seek() {
    if (!audioElement.value) return;
    audioElement.value.currentTime = currentTime.value;
  }

  function changeVolume() {
    if (!audioElement.value) return;
    audioElement.value.volume = volume.value / 100;
    playerStore.setVolume(volume.value);
  }

  function updateProgress() {
    if (!audioElement.value) return;
    currentTime.value = audioElement.value.currentTime;
  }

  function setDuration() {
    if (!audioElement.value) return;
    duration.value = audioElement.value.duration;
  }

  function handleEnded() {
    next();
  }

  function next() {
    playerStore.next();
  }

  function previous() {
    playerStore.previous();
  }

  watch(currentTrack, () => {
    if (isPlaying.value && audioElement.value) {
      audioElement.value.play();
    }
  }, { deep: true });

  watch(isPlaying, (newValue) => {
    if (!audioElement.value) return;

    if (newValue) {
      audioElement.value.play();
    } else {
      audioElement.value.pause();
    }
  });

  onMounted(() => {
    if (audioElement.value) {
      audioElement.value.volume = volume.value / 100;
    }
  });
</script>

<style scoped>
  .music-player {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--primary-dark);
    color: white;
    padding: var(--spacing-md);
    z-index: 1000;
  }

  .player-container {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr;
    align-items: center;
    gap: var(--spacing-md);
    max-width: 1200px;
    margin: 0 auto;
  }

  .track-info {
    display: flex;
    align-items: center;
  }

  .track-image {
    width: 50px;
    height: 50px;
    border-radius: var(--border-radius-sm);
    margin-right: var(--spacing-md);
    object-fit: cover;
  }

  .track-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-md);
  }

  .track-performer {
    margin: 0;
    font-size: var(--font-size-sm);
    opacity: 0.8;
  }

  .player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
  }

  .control-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: var(--font-size-lg);
  }

  .play-btn {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .progress-bar,
  .volume-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    outline: none;
    flex: 1;
  }

  .progress-bar::-webkit-slider-thumb,
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  .time {
    font-size: var(--font-size-xs);
    min-width: 40px;
  }

  .player-volume {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    justify-content: flex-end;
  }

  @media (max-width: 992px) {
    .player-container {
      grid-template-columns: 1fr 1fr 2fr;
    }

    .player-volume {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .player-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      gap: var(--spacing-md);
    }

    .player-progress {
      order: 2;
    }

    .player-controls {
      order: 3;
    }
  }
</style>