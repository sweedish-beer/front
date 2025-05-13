<template>
  <div class="track-card">
    <div class="track-image" @click="playTrack">
      <img :src="trackImage" :alt="track.attributes.title" />
      <div class="play-overlay">
        <div class="play-icon">▶</div>
      </div>
    </div>
    <div class="track-info">
      <h3 class="track-title">{{ track.attributes.title }}</h3>
      <p v-if="performer" class="track-performer">
        {{ performer.attributes.name }}
      </p>
      <p v-if="track.attributes.genre" class="track-genre">
        {{ track.attributes.genre }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    track: {
      type: Object,
      required: true
    }
  });

  const trackImage = computed(() => {
    if (!props.track?.attributes?.coverArt?.data) {
      return '/images/placeholder-cover.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${props.track.attributes.coverArt.data.attributes.url}`;
  });

  const performer = computed(() => {
    return props.track?.attributes?.performer?.data || null;
  });

  function playTrack() {
    // TODO: Implement track playback logic here
    // For now, just log to the console
    console.log('Play track:', props.track);
  }
</script>

<style scoped>
  .track-card {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: var(--background);
  }

  .track-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .track-image {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    cursor: pointer;
  }

  .track-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .play-icon {
    width: 50px;
    height: 50px;
    background-color: var(--primary);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: var(--font-size-lg);
  }

  .track-image:hover .play-overlay {
    opacity: 1;
  }

  .track-image:hover img {
    transform: scale(1.05);
  }

  .track-info {
    padding: var(--spacing-md);
  }

  .track-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }

  .track-performer {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .track-genre {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    background-color: var(--background-alt);
    display: inline-block;
    padding: 2px 8px;
    border-radius: var(--border-radius-sm);
  }
</style>