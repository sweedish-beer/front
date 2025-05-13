<template>
  <header class="header">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <h1>ShowBand</h1>
      </router-link>

      <nav class="main-nav">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/performers">Performers</router-link></li>
          <li><router-link to="/tracks">Tracks</router-link></li>
          <li><router-link to="/albums">Albums</router-link></li>
          <li><router-link to="/events">Events</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
  .header {
    background-color: var(--background);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) 0;
  }

  .logo h1 {
    margin: 0;
    color: var(--primary);
    font-size: var(--font-size-xl);
  }

  .main-nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .main-nav li {
    margin-left: var(--spacing-lg);
  }

  .main-nav a {
    color: var(--text-primary);
    font-weight: 500;
    padding: var(--spacing-xs) 0;
  }

  .main-nav a.router-link-active {
    color: var(--primary);
    border-bottom: 2px solid var(--primary);
  }

  @media (max-width: 768px) {
    .header-container {
      flex-direction: column;
      align-items: flex-start;
    }

    .main-nav {
      margin-top: var(--spacing-md);
      width: 100%;
      overflow-x: auto;
    }

    .main-nav ul {
      width: max-content;
    }

    .main-nav li:first-child {
      margin-left: 0;
    }
  }
</style>