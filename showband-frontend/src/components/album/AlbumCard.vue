<template>
  <div class="album-card">
    <router-link :to="`/albums/${album.id}`">
      <div class="album-image">
        <img :src="albumImage" :alt="album.attributes.title" />
      </div>
      <div class="album-info">
        <h3 class="album-title">{{ album.attributes.title }}</h3>
        <p v-if="performer" class="album-performer">
          {{ performer.attributes.name }}
        </p>
        <p v-if="album.attributes.releaseDate" class="album-year">
          {{ releaseYear }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    album: {
      type: Object,
      required: true
    }
  });

  const albumImage = computed(() => {
    if (!props.album.attributes.coverArt?.data) {
      return '/placeholder-album.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${props.album.attributes.coverArt.data.attributes.url}`;
  });

  const performer = computed(() => {
    return props.album.attributes.performer?.data || null;
  });

  const releaseYear = computed(() => {
    if (!props.album.attributes.releaseDate) return '';
    return new Date(props.album.attributes.releaseDate).getFullYear();
  });
</script>

<style scoped>
  .album-card {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: var(--background);
  }

  .album-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .album-image {
    aspect-ratio: 1 / 1;
    overflow: hidden;
  }

  .album-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .album-card:hover .album-image img {
    transform: scale(1.05);
  }

  .album-info {
    padding: var(--spacing-md);
  }

  .album-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }

  .album-performer {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .album-year {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
</style>