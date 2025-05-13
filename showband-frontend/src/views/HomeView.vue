<template>
  <!-- Your existing template code is fine -->
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import PerformerCard from '@/components/performer/PerformerCard.vue';
  import TrackCard from '@/components/track/TrackCard.vue';
  import EventCard from '@/components/event/EventCard.vue';
  import { performerService, trackService, eventService } from '@/services/api';

  // Define interfaces for your Strapi data structure
  interface StrapiAttributes {
    [key: string]: any;
  }

  interface StrapiEntity {
    id: number;
    attributes: StrapiAttributes;
  }

  // State with proper typing
  const featuredPerformers = ref<StrapiEntity[]>([]);
  const featuredTracks = ref<StrapiEntity[]>([]);
  const upcomingEvents = ref<StrapiEntity[]>([]);
  const performersLoading = ref(true);
  const tracksLoading = ref(true);
  const eventsLoading = ref(true);

  // Methods
  async function fetchFeaturedPerformers() {
    try {
      performersLoading.value = true;
      console.log('Fetching featured performers...');
      const data = await performerService.getFeatured();
      console.log('Featured performers result:', data);
      featuredPerformers.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching featured performers:', error);
      featuredPerformers.value = [];
    } finally {
      performersLoading.value = false;
    }
  }

  async function fetchFeaturedTracks() {
    try {
      tracksLoading.value = true;
      console.log('Fetching featured tracks...');
      const data = await trackService.getFeatured();
      console.log('Featured tracks result:', data);
      featuredTracks.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching featured tracks:', error);
      featuredTracks.value = [];
    } finally {
      tracksLoading.value = false;
    }
  }

  async function fetchUpcomingEvents() {
    try {
      eventsLoading.value = true;
      console.log('Fetching upcoming events...');
      const data = await eventService.getUpcoming();
      console.log('Upcoming events result:', data);
      upcomingEvents.value = Array.isArray(data) ? data.slice(0, 3) : []; // Limit to 3 events
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      upcomingEvents.value = [];
    } finally {
      eventsLoading.value = false;
    }
  }

  function refreshData() {
    console.log('Manually refreshing all data');
    fetchFeaturedPerformers();
    fetchFeaturedTracks();
    fetchUpcomingEvents();
  }

  // Lifecycle
  onMounted(() => {
    fetchFeaturedPerformers();
    fetchFeaturedTracks();
    fetchUpcomingEvents();
  });
</script>

<style scoped>
  /* Your existing styles */
</style>