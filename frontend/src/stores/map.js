import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    center: [48.8566, 2.3522], // Default to Paris
    zoom: 13
  }),
  actions: {
    updateCenter(center) {
      this.center = center
    },
    updateZoom(zoom) {
      this.zoom = zoom
    }
  }
})
