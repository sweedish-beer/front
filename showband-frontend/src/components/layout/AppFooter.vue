<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-logo">
        <h2>ShowBand</h2>
        <p>Discover amazing music and live events</p>
      </div>

      <div class="footer-links">
        <div class="link-group">
          <h3>Navigation</h3>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/performers">Performers</router-link></li>
            <li><router-link to="/tracks">Tracks</router-link></li>
            <li><router-link to="/albums">Albums</router-link></li>
            <li><router-link to="/events">Events</router-link></li>
          </ul>
        </div>

        <div class="link-group">
          <h3>Social</h3>
          <ul>
            <li><a href="#" target="_blank">Facebook</a></li>
            <li><a href="#" target="_blank">Twitter</a></li>
            <li><a href="#" target="_blank">Instagram</a></li>
            <li><a href="#" target="_blank">YouTube</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ currentYear }} ShowBand. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
  .footer {
    background-color: var(--primary-dark);
    color: white;
    padding-top: var(--spacing-xl);
  }

  .footer-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
  }

  .footer-logo h2 {
    color: white;
    margin-bottom: var(--spacing-sm);
  }

  .footer-logo p {
    opacity: 0.8;
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }

  .link-group h3 {
    color: white;
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-md);
  }

  .link-group ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .link-group li {
    margin-bottom: var(--spacing-sm);
  }

  .link-group a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
  }

  .link-group a:hover {
    color: white;
  }

  .footer-bottom {
    background-color: rgba(0, 0, 0, 0.2);
    padding: var(--spacing-md) 0;
    text-align: center;
  }

  .footer-bottom p {
    margin: 0;
    opacity: 0.7;
    font-size: var(--font-size-sm);
  }

  @media (max-width: 768px) {
    .footer-container {
      grid-template-columns: 1fr;
    }

    .footer-links {
      grid-template-columns: 1fr;
    }
  }
</style>