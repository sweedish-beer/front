<template>
  <div class="album-list">
    <div class="page-header">
      <div class="container">
        <h1>Albums</h1>
        <p>Explore music collections from your favorite performers.</p>
      </div>
    </div>

    <div class="container">
      <div class="filters">
        <div class="search-box">
          <input type="text" v-model="search" placeholder="Search albums..." @input="filterAlbums" />
        </div>
      </div>

      <div v-if="loading" class="loading">
        Loading albums...
      </div>

      <div v-else-if="filteredAlbums.length === 0" class="empty-state">
        No albums found matching your criteria.
      </div>

      <div v-else class="grid-display">
        <AlbumCard v-for="album in filteredAlbums" :key="album.id" :album="album" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import AlbumCard from '@/components/album/AlbumCard.vue';
  import { useAlbumStore } from '@/stores/albums';
  import { storeToRefs } from 'pinia';

  const albumStore = useAlbumStore();
  const { albums, loading } = storeToRefs(albumStore);

  const search = ref('');

  const filteredAlbums = computed(() => {
    return albums.value.filter(album => {
      const matchesSearch = search.value === '' ||
        album.attributes.title.toLowerCase().includes(search.value.toLowerCase());

      return matchesSearch;
    });
  });

  function filterAlbums() {
    // This function exists just to trigger the computed property
  }

  onMounted(() => {
    albumStore.fetchAlbums();
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
    margin-bottom: var(--spacing-lg);
  }

  .search-box input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid #ccc;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-md);
  }

  .grid-display {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
  }

  @media (max-width: 992px) {
    .grid-display {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .grid-display {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .grid-display {
      grid-template-columns: 1fr;
    }
  }
</style>