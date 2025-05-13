<template>
  <div class="track-list">
    <div class="page-header">
      <div class="container">
        <h1>Tracks</h1>
        <p>Discover the latest music from talented performers.</p>
      </div>
    </div>

    <div class="container">
      <div class="filters">
        <div class="search-box">
          <input type="text" v-model="search" placeholder="Search tracks..." @input="filterTracks" />
        </div>

        <div class="genre-filter">
          <select v-model="selectedGenre" @change="filterTracks">
            <option value="">All Genres</option>
            <option v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Loading tracks...
      </div>

      <div v-else-if="filteredTracks.length === 0" class="empty-state">
        No tracks found matching your criteria.
      </div>

      <div v-else class="tracks-list">
        <div v-for="(track, index) in filteredTracks" :key="track.id" class="track-item"
          :class="{ 'is-playing': isCurrentTrack(track) }" @click="playTrack(track, index)">
          <div class="track-play-icon">
            <span v-if="isCurrentTrack(track) && isPlaying">⏸</span>
            <span v-else>▶</span>
          </div>
          <div class="track-image">
            <img :src="getTrackImage(track)" :alt="track.attributes.title" />
          </div>
          <div class="track-details">
            <div class="track-title">{{ track.attributes.title }}</div>
            <div v-if="getPerformerName(track)" class="track-performer">
              {{ getPerformerName(track) }}
            </div>
          </div>
          <div v-if="track.attributes.genre" class="track-genre">
            {{ track.attributes.genre }}
          </div>
          <div class="track-duration">
            {{ formatDuration(track.attributes.duration) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useTrackStore } from '@/stores/tracks';
  import { usePlayerStore } from '@/stores/player';
  import { storeToRefs } from 'pinia';

  const trackStore = useTrackStore();
  const playerStore = usePlayerStore();
  const { tracks, loading } = storeToRefs(trackStore);
  const { currentTrack, isPlaying } = storeToRefs(playerStore);

  const search = ref('');
  const selectedGenre = ref('');

  const genres = computed(() => {
    const genreSet = new Set();

    tracks.value.forEach(track => {
      if (track.attributes.genre) {
        genreSet.add(track.attributes.genre);
      }
    });

    return Array.from(genreSet).sort();
  });

  const filteredTracks = computed(() => {
    return tracks.value.filter(track => {
      const matchesSearch = search.value === '' ||
        track.attributes.title.toLowerCase().includes(search.value.toLowerCase());

      const matchesGenre = selectedGenre.value === '' ||
        track.attributes.genre === selectedGenre.value;

      return matchesSearch && matchesGenre;
    });
  });

  function filterTracks() {
    // This function exists just to trigger the computed property
  }

  function getTrackImage(track) {
    if (!track.attributes.coverArt?.data) {
      return '/placeholder-cover.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${track.attributes.coverArt.data.attributes.url}`;
  }

  function getPerformerName(track) {
    if (!track.attributes.performer?.data) return '';
    return track.attributes.performer.data.attributes.name;
  }

  function formatDuration(duration) {
    if (!duration) return '--:--';

    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function isCurrentTrack(track) {
    return currentTrack.value?.id === track.id;
  }

  function playTrack(track, index) {
    if (isCurrentTrack(track)) {
      if (isPlaying.value) {
        playerStore.pause();
      } else {
        playerStore.play();
      }
    } else {
      playerStore.setQueue(filteredTracks.value, index);
    }
  }

  onMounted(() => {
    trackStore.fetchTracks();
  });
</script>

<style scoped>
  .page-header {
    background-color: var(--primary);
    color: white;
    padding: var(--spacing-xl) 0;
    margin-bottom: var(--spacing-xl);
  }

  .page-header h1 {
    color: white;
    margin-bottom: var(--spacing-sm);
  }

  .filters {
    display: flex;
    margin-bottom: var(--spacing-lg);
    gap: var(--spacing-md);
  }

  .search-box {
    flex: 1;
  }

  .search-box input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid #ccc;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-md);
  }

  .genre-filter select {
    padding: var(--spacing-md);
    border: 1px solid #ccc;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-md);
    background-color: white;
  }

  .tracks-list {
    background-color: white;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .track-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .track-item:last-child {
    border-bottom: none;
  }

  .track-item:hover {
    background-color: var(--background-alt);
  }

  .track-item.is-playing {
    background-color: rgba(98, 0, 234, 0.1);
  }

  .track-play-icon {
    width: 30px;
    text-align: center;
    color: var(--primary);
    margin-right: var(--spacing-sm);
  }

  .track-image {
    width: 50px;
    height: 50px;
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    margin-right: var(--spacing-md);
  }

  .track-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .track-details {
    flex: 1;
  }

  .track-title {
    font-weight: 500;
  }

  .track-performer {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .track-genre {
    background-color: var(--background-alt);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-xs);
    margin-right: var(--spacing-md);
  }

  .track-duration {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    width: 60px;
    text-align: right;
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .track-genre {
      display: none;
    }
  }

  @media (max-width: 576px) {
    .track-image {
      width: 40px;
      height: 40px;
    }
  }
</style>