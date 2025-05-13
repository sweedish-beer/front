<template>
  <div class="event-list">
    <div class="page-header">
      <div class="container">
        <h1>Events</h1>
        <p>Discover upcoming performances and concerts.</p>
      </div>
    </div>

    <div class="container">
      <div class="filters">
        <div class="search-box">
          <input type="text" v-model="search" placeholder="Search events..." @input="filterEvents" />
        </div>

        <div class="location-filter">
          <select v-model="selectedLocation" @change="filterEvents">
            <option value="">All Locations</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Loading events...
      </div>

      <div v-else-if="filteredEvents.length === 0" class="empty-state">
        No events found matching your criteria.
      </div>

      <div v-else class="grid-display">
        <EventCard v-for="event in filteredEvents" :key="event.id" :event="event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import EventCard from '@/components/event/EventCard.vue';
  import { useEventStore } from '@/stores/events';
  import { storeToRefs } from 'pinia';

  const eventStore = useEventStore();
  const { events, loading } = storeToRefs(eventStore);

  // Import the Event type from your strapi types
  import type { Event } from '@/types/strapi';

  // Explicitly type events as Ref<Event[]>
  const typedEvents = events as unknown as import('vue').Ref<Event[]>;

  // Add reactive search and selectedLocation variables
  const search = ref('');
  const selectedLocation = ref('');

  const locations = computed(() => {
    const locationSet = new Set<string>();

    typedEvents.value.forEach(event => {
      if (event.attributes.city) {
        locationSet.add(event.attributes.city);
      }
    });

    return Array.from(locationSet).sort();
  });

  const filteredEvents = computed(() => {
    return typedEvents.value.filter(event => {
      const matchesSearch = search.value === '' ||
        event.attributes.title.toLowerCase().includes(search.value.toLowerCase()) ||
        event.attributes.venueName?.toLowerCase().includes(search.value.toLowerCase());

      const matchesLocation = selectedLocation.value === '' ||
        event.attributes.city === selectedLocation.value;

      return matchesSearch && matchesLocation;
    });
  });

  function filterEvents() {
    // This function exists just to trigger the computed property
  }

  onMounted(() => {
    eventStore.fetchUpcomingEvents();
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

  .location-filter select {
    padding: var(--spacing-md);
    border: 1px solid #ccc;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-md);
    background-color: white;
  }

  .grid-display {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
  }

  @media (max-width: 992px) {
    .grid-display {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .grid-display {
      grid-template-columns: 1fr;
    }
  }
</style>