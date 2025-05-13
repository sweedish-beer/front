<template>
  <div class="performer-detail" v-if="currentPerformer">
    <div class="performer-header" :style="headerStyle">
      <div class="container">
        <div class="performer-profile">
          <div class="profile-image">
            <img :src="profileImage" :alt="currentPerformer.attributes.name" />
            <div v-if="currentPerformer.attributes.verified" class="verified-badge">
              ✓
            </div>
          </div>
          <div class="profile-info">
            <h1>{{ currentPerformer.attributes.name }}</h1>
            <div class="performer-meta">
              <span v-if="currentPerformer.attributes.genre" class="genre">
                {{ currentPerformer.attributes.genre }}
              </span>
              <span v-if="currentPerformer.attributes.location" class="location">
                {{ currentPerformer.attributes.location }}
              </span>
            </div>
            <div class="social-links" v-if="socialLinks.length">
              <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" target="_blank" class="social-link">
                {{ link.platform }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container content-section">
      <div class="performer-bio" v-if="currentPerformer.attributes.bio">
        <h2>Biography</h2>
        <div v-html="currentPerformer.attributes.bio"></div>
      </div>

      <div class="performer-tracks" v-if="tracks.length">
        <h2>Tracks</h2>
        <div class="tracks-list">
          <div v-for="(track, index) in tracks" :key="track.id" class="track-item"
            :class="{ 'is-playing': isCurrentTrack(track) }" @click="playTrack(track, index)">
            <div class="track-number">{{ index + 1 }}</div>
            <div class="track-play-icon">
              <span v-if="isCurrentTrack(track) && isPlaying">⏸</span>
              <span v-else>▶</span>
            </div>
            <div class="track-image">
              <img :src="getTrackImage(track)" :alt="track.attributes.title" />
            </div>
            <div class="track-details">
              <div class="track-title">{{ track.attributes.title }}</div>
              <div v-if="track.attributes.genre" class="track-genre">
                {{ track.attributes.genre }}
              </div>
            </div>
            <div class="track-duration">
              {{ formatDuration(track.attributes.duration) }}
            </div>
          </div>
        </div>
      </div>

      <div class="performer-albums" v-if="albums.length">
        <h2>Albums</h2>
        <div class="grid-display">
          <AlbumCard v-for="album in albums" :key="album.id" :album="album" />
        </div>
      </div>

      <div class="performer-events" v-if="events.length">
        <h2>Upcoming Events</h2>
        <div class="events-list">
          <EventCard v-for="event in events" :key="event.id" :event="event" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading container">
    Loading performer details...
  </div>
  <div v-else class="not-found container">
    Performer not found.
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { usePerformerStore } from '@/stores/performers';
  import { usePlayerStore } from '@/stores/player';
  import { storeToRefs } from 'pinia';
  import AlbumCard from '@/components/album/AlbumCard.vue';
  import EventCard from '@/components/event/EventCard.vue';

  const route = useRoute();
  const performerStore = usePerformerStore();
  const playerStore = usePlayerStore();
  const { currentPerformer, loading } = storeToRefs(performerStore);
  const { currentTrack, isPlaying } = storeToRefs(playerStore);

  const slug = computed(() => route.params.slug as string);

  const profileImage = computed(() => {
    if (!currentPerformer.value?.attributes.profileImage?.data) {
      return '/placeholder-profile.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${currentPerformer.value.attributes.profileImage.data.attributes.url}`;
  });

  const headerStyle = computed(() => {
    if (!currentPerformer.value?.attributes.coverImage?.data) {
      return {
        backgroundColor: 'var(--primary-dark)'
      };
    }

    const coverUrl = `${import.meta.env.VITE_API_URL}${currentPerformer.value.attributes.coverImage.data.attributes.url}`;

    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${coverUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  });

  const socialLinks = computed(() => {
    if (!currentPerformer.value?.attributes.socialLinks) return [];

    try {
      return JSON.parse(currentPerformer.value.attributes.socialLinks);
    } catch (error) {
      console.error('Error parsing social links:', error);
      return [];
    }
  });

  const tracks = computed(() => {
    if (!currentPerformer.value?.attributes.tracks?.data) return [];
    return currentPerformer.value.attributes.tracks.data;
  });

  const albums = computed(() => {
    if (!currentPerformer.value?.attributes.albums?.data) return [];
    return currentPerformer.value.attributes.albums.data;
  });

  const events = computed(() => {
    if (!currentPerformer.value?.attributes.events?.data) return [];

    // Filter future events and sort by date
    const today = new Date();
    return currentPerformer.value.attributes.events.data
      .filter(event => new Date(event.attributes.dateTime) >= today)
      .sort((a, b) => new Date(a.attributes.dateTime).getTime() - new Date(b.attributes.dateTime).getTime());
  });

  function getTrackImage(track) {
    if (!track.attributes.coverArt?.data) {
      return '/placeholder-cover.jpg';
    }

    return `${import.meta.env.VITE_API_URL}${track.attributes.coverArt.data.attributes.url}`;
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
      playerStore.setQueue(tracks.value, index);
    }
  }

  onMounted(async () => {
    await performerStore.fetchPerformerBySlug(slug.value);
  });
</script>

<style scoped>
  .performer-header {
    color: white;
    padding: var(--spacing-xl) 0;
    margin-bottom: var(--spacing-xl);
  }

  .performer-profile {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .profile-image {
    position: relative;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid white;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .verified-badge {
    position: absolute;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
    background-color: var(--primary);
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-md);
    font-weight: bold;
    border: 2px solid white;
  }

  .profile-info h1 {
    color: white;
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-xxl);
  }

  .performer-meta {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .genre,
  .location {
    background-color: rgba(255, 255, 255, 0.2);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
  }

  .social-links {
    display: flex;
    gap: var(--spacing-sm);
  }

  .social-link {
    display: inline-block;
    background-color: var(--primary);
    color: white;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    transition: background-color 0.3s ease;
  }

  .social-link:hover {
    background-color: var(--primary-light);
  }

  .content-section {
    margin-bottom: var(--spacing-xl);
  }

  .content-section h2 {
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-xl);
    color: var(--primary);
  }

  .performer-bio,
  .performer-tracks,
  .performer-albums,
  .performer-events {
    margin-bottom: var(--spacing-xl);
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

  .track-number {
    width: 30px;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    text-align: center;
  }

  .track-play-icon {
    width: 30px;
    text-align: center;
    color: var(--primary);
  }

  .track-image {
    width: 40px;
    height: 40px;
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

  .track-genre {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }

  .track-duration {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .grid-display {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
  }

  .events-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
  }

  @media (max-width: 992px) {
    .grid-display {
      grid-template-columns: repeat(3, 1fr);
    }

    .events-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .performer-profile {
      flex-direction: column;
      text-align: center;
    }

    .performer-meta {
      justify-content: center;
    }

    .social-links {
      justify-content: center;
    }

    .grid-display {
      grid-template-columns: repeat(2, 1fr);
    }

    .events-list {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 576px) {
    .grid-display {
      grid-template-columns: 1fr;
    }

    .track-item {
      flex-wrap: wrap;
    }

    .track-details {
      width: 100%;
      margin-top: var(--spacing-sm);
    }
  }
</style>