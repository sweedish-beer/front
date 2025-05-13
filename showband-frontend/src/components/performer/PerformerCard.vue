<template>
  <div class="performer-card">
    <router-link :to="`/performer/${performer.id}`">
      <div class="performer-image">
        <img :src="performerImage" :alt="performer.attributes.name" />
        <span v-if="performer.attributes.verified" class="verified-badge">✔</span>
      </div>
      <div class="performer-info">
        <h3 class="performer-name">{{ performer.attributes.name }}</h3>
        <p v-if="performer.attributes.genre" class="performer-genre">
          {{ performer.attributes.genre }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    performer: {
      type: Object,
      required: true
    }
  });

  const performerImage = computed(() => {
    if (!props.performer.attributes.profileImage?.data) {
      return '/placeholder-profile.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${props.performer.attributes.profileImage.data.attributes.url}`;
  });
</script>

<style scoped>
  .performer-card {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: var(--background);
  }

  .performer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .performer-image {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
  }

  .performer-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .performer-card:hover .performer-image img {
    transform: scale(1.05);
  }

  .verified-badge {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    background-color: var(--primary);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-sm);
    font-weight: bold;
  }

  .performer-info {
    padding: var(--spacing-md);
  }

  .performer-name {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }

  .performer-genre {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
</style>