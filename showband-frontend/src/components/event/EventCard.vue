<template>
  <div class="event-card">
    <router-link :to="`/events/${event.id}`">
      <div class="event-image">
        <img :src="eventImage" :alt="event.attributes.title" />
        <div class="event-date">
          <div class="date-day">{{ dateDay }}</div>
          <div class="date-month">{{ dateMonth }}</div>
        </div>
      </div>
      <div class="event-info">
        <h3 class="event-title">{{ event.attributes.title }}</h3>
        <p v-if="event.attributes.venueName" class="event-venue">
          {{ event.attributes.venueName }}
          <span v-if="event.attributes.city"> · {{ event.attributes.city }}</span>
        </p>
        <div class="event-performers" v-if="event.attributes.performers?.data?.length">
          <span v-for="(performer, index) in event.attributes.performers.data" :key="performer.id">
            {{ performer.attributes.name }}{{ index < event.attributes.performers.data.length - 1 ? ', ' : '' }} </span>
        </div>
        <div class="event-time">{{ eventTime }}</div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    event: {
      type: Object,
      required: true
    }
  });

  const eventImage = computed(() => {
    if (!props.event.attributes.image?.data) {
      return '/placeholder-event.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${props.event.attributes.image.data.attributes.url}`;
  });

  const dateDay = computed(() => {
    const date = new Date(props.event.attributes.dateTime);
    return date.getDate();
  });

  const dateMonth = computed(() => {
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

  .event-performers {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
    color: var(--primary);
  }

  .event-time {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
</style>