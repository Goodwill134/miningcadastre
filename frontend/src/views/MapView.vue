<template>
  <div class="map-view">
    <h1>Mine Cadastre Map</h1>
    <div class="map-container">
      <!-- Map implementation would go here -->
      <p>Displaying mining claims and concessions</p>
      <MapComponent />
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue'

export default {
  name: 'MapView',
  components: { MapComponent }
}
</script>

<style scoped>
.map-view {
  padding: 1rem 0;
}

h1 {
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 2.2rem;
  text-align: center;
}

.map-container {
  height: 500px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 1rem;
}
</style>
