<template>
  <div class="home">
    <h1>Welcome to MineCadastre</h1>
    <p class="subtitle">Showing latest mining claims</p>
    
    <div class="stats">
      <div class="stat-card">
        <h3>{{ mines.length }}</h3>
        <p>Registered Mines</p>
      </div>
    </div>
    
    <div class="layout">
      <div class="mine-list">
        <div 
          class="mine-card" 
          v-for="mine in mines" 
          :key="mine.id"
          @click="selectMine(mine)"
          :class="{ selected: selectedMine?.id === mine.id }"
        >
          <h3>{{ mine['Mine Name'] }}</h3>
          <div class="mine-details">
            <p><strong>Mineral:</strong> {{ mine.Mineral }}</p>
            <p><strong>Area:</strong> {{ mine.Area }}</p>
            <p><strong>District:</strong> {{ mine.District }}</p>
            <p><strong>Licence No:</strong> {{ mine['Licence No'] }}</p>
          </div>
        </div>
      </div>
      
      <div class="map-container">
        <MapComponent 
          ref="map"
          :selectedMine="selectedMine"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue'

export default {
  name: 'HomeView',
  components: { MapComponent },
  data() {
    return {
      mines: [],
      selectedMine: null
    }
  },
  methods: {
    selectMine(mine) {
      this.selectedMine = mine
      this.$refs.map?.zoomToMine(mine)
    }
  },
  async created() {
    const response = await fetch('/api/mines')
    this.mines = await response.json()
  }
}
</script>

<style scoped>
.home {
  padding: 2rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 70vh;
}

.map-container {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
}

.stat-card h3 {
  margin: 0;
  font-size: 2rem;
}

.mine-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 1rem;
}

.mine-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.mine-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.mine-card.selected {
  border: 2px solid var(--primary-color);
  background-color: #f0f7ff;
}

.mine-card h3 {
  margin-top: 0;
  color: var(--primary-color);
}

.mine-details p {
  margin: 0.5rem 0;
}
</style>
