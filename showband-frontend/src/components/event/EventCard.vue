<!-- src/components/event/EventCard.vue -->
<template>
  <div class="event-card">
    <router-link :to="`/events/${event.id}`">
      <div class="event-image">
        <img :src="eventImage" :alt="event.attributes.title" />
        <div class="event-date">
          <div class="date-day">{{ eventDay }}</div>
          <div class="date-month">{{ eventMonth }}</div>
        </div>
      </div>
      <div class="event-info">
        <h3 class="event-title">{{ event.attributes.title }}</h3>
        <p v-if="event.attributes.venueName" class="event-venue">
          {{ event.attributes.venueName }}
          <span v-if="event.attributes.city">· {{ event.attributes.city }}</span>
        </p>
        <div class="event-time">{{ eventTime }}</div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { Event } from '@/types/strapi';

  const props = defineProps<{
    event: Event
  }>();

  const eventImage = computed(() => {
    if (!props.event.attributes.image?.data?.attributes?.url) {
      return '../../images/placeholder-event.jpeg';
    }

    const url = props.event.attributes.image.data.attributes.url;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  });

  const eventDay = computed(() => {
    const date = new Date(props.event.attributes.dateTime);
    return date.getDate();
  });

  const eventMonth = computed(() => {
    const date = new Date(props.event.attributes.dateTime);
    return date.toLocaleString('default', { month: 'short' });
  });

  const eventTime = computed(() => {
    const date = new Date(props.event.attributes.dateTime);
    return date.toLocaleTimeString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  });
</script>

<style scoped>
  .event-card {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: var(--background);
  }

  .event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .event-image {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .event-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .event-card:hover .event-image img {
    transform: scale(1.05);
  }

  .event-date {
    position: absolute;
    top: var(--spacing-md);
    left: var(--spacing-md);
    background-color: var(--primary);
    color: white;
    width: 60px;
    text-align: center;
    border-radius: var(--border-radius-sm);
    overflow: hidden;
  }

  .date-day {
    font-size: var(--font-size-xl);
    font-weight: bold;
    padding: var(--spacing-xs) 0;
  }

  .date-month {
    background-color: rgba(0, 0, 0, 0.2);
    padding: var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
    text-transform: uppercase;
  }

  .event-info {
    padding: var(--spacing-md);
  }

  .event-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }

  .event-venue {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .event-time {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
</style>