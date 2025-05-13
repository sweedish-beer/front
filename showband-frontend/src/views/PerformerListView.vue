<template>
  <div class="performer-list">
    <div class="page-header">
      <div class="container">
        <h1>Performers</h1>
        <p>Discover talented musicians and bands from around the world.</p>
      </div>
    </div>

    <div class="container">
      <div class="filters">
        <div class="search-box">
          <input type="text" v-model="search" placeholder="Search performers..." @input="filterPerformers" />
        </div>

        <div class="genre-filter">
          <select v-model="selectedGenre" @change="filterPerformers">
            <option value="">All Genres</option>
            <option v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Loading performers...
      </div>

      <div v-else-if="filteredPerformers.length === 0" class="empty-state">
        No performers found matching your criteria.
      </div>

      <div v-else class="grid-display">
        <PerformerCard v-for="performer in filteredPerformers" :key="performer.id" :performer="performer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import PerformerCard from '@/components/performer/PerformerCard.vue';
  import { usePerformerStore } from '@/stores/performers';
  import { storeToRefs } from 'pinia';

  const performerStore = usePerformerStore();
  const { performers, loading } = storeToRefs(performerStore);

  const search = ref('');
  const selectedGenre = ref('');

  const genres = computed(() => {
    const genreSet = new Set();

    performers.value.forEach(performer => {
      if (performer.attributes.genre) {
        genreSet.add(performer.attributes.genre);
      }
    });

    return Array.from(genreSet).sort();
  });

  const filteredPerformers = computed(() => {
    return performers.value.filter(performer => {
      const matchesSearch = search.value === '' ||
        performer.attributes.name.toLowerCase().includes(search.value.toLowerCase());

      const matchesGenre = selectedGenre.value === '' ||
        performer.attributes.genre === selectedGenre.value;

      return matchesSearch && matchesGenre;
    });
  });

  function filterPerformers() {
    // This function exists just to trigger the computed property
  }

  onMounted(() => {
    performerStore.fetchPerformers();
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
    .filters {
      flex-direction: column;
    }

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