<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <div class="logo">MineCadastre</div>
        <nav class="main-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/map">Map</router-link>
        </nav>
      </div>
    </header>
    <main class="app-content">
      <div class="container">
        <RouterView />
      </div>
    </main>
    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ currentYear }} MineCadastre System</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.app-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: var(--secondary-color);
}

.app-content {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}
</style>
