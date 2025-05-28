<template>
  <div style="height: 100%; width: 100%; position: relative;">
    <div ref="mapContainer" style="height: 100%; width: 100%;"></div>
    <div ref="popupContainer" id="popup" class="ol-popup">
      <span ref="popupContent"></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { fromLonLat } from 'ol/proj'
import Overlay from 'ol/Overlay'
import { Style, Fill, Stroke, Circle as CircleStyle, Icon } from 'ol/style'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'

const props = defineProps({
  selectedMine: Object
})

const mapContainer = ref()
const map = ref()
const polygonSource = ref()
const markerSource = ref()
const popupContainer = ref()
const popupContent = ref()
let overlay = null;

// Style for mine polygons
const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.3)' // Red fill, semi-transparent
  }),
  stroke: new Stroke({
    color: 'rgba(255, 0, 0, 0.8)', // Red border
    width: 2
  })
})

// Style for selected mine polygons
const selectedPolygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.5)' // More opaque red for selected
  }),
  stroke: new Stroke({
    color: 'rgba(255, 0, 0, 1)', // Solid red border
    width: 5,
    lineDash: [15, 10],
    lineDashOffset: 0
  }),
  zIndex: 100
})

// Style for location markers
const markerStyle = new Style({
  image: new Icon({
    src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    scale: 0.5,
    anchor: [0.5, 1],
    crossOrigin: 'anonymous'  // Add this to handle CORS
  })
})

// Style for selected location markers
const selectedMarkerStyle = new Style({
  image: new Icon({
    src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    scale: 0.5,
    anchor: [0.5, 1],
    crossOrigin: 'anonymous'  // Add this to handle CORS
  })
})

const loadMines = async () => {
  try {
    const response = await fetch('/api/mines')
    const mines = await response.json()
    
    // Clear existing features
    polygonSource.value.clear()
    markerSource.value.clear()
    
    // Add polygon features
    const polygonFeatures = mines.map(mine => {
      if (!mine.geometry) return null
      
      try {
        const geometry = typeof mine.geometry === 'string' 
          ? JSON.parse(mine.geometry) 
          : mine.geometry
        
        const feature = new GeoJSON().readFeature({
          type: 'Feature',
          geometry,
          properties: {
            ...mine,
            id: mine.id
          }
        }, { featureProjection: map.value.getView().getProjection() })
        
        return feature
      } catch (e) {
        console.error('Error parsing mine geometry:', e)
        return null
      }
    }).filter(Boolean)
    
    polygonSource.value.addFeatures(polygonFeatures)
    
    // Add marker features for mine centers
    const markerFeatures = mines.map(mine => {
      if (!mine.geometry) return null
      
      try {
        const geometry = typeof mine.geometry === 'string' 
          ? JSON.parse(mine.geometry) 
          : mine.geometry
        
        // Get center point of the polygon
        const coords = geometry.coordinates[0][0] // First point of first polygon
        const point = new Point(fromLonLat(coords))
        
        const feature = new Feature({
          geometry: point,
          properties: {
            ...mine,
            id: mine.id
          }
        })
        
        return feature
      } catch (e) {
        console.error('Error creating mine marker:', e)
        return null
      }
    }).filter(Boolean)
    
    markerSource.value.addFeatures(markerFeatures)
    
  } catch (err) {
    console.error('Failed to fetch mines:', err)
  }
}

const zoomToMine = (mine) => {
  if (!mine?.geometry) return
  
  try {
    const geometry = typeof mine.geometry === 'string' 
      ? JSON.parse(mine.geometry) 
      : mine.geometry
    
    // Highlight selected features
    polygonSource.value.forEachFeature(f => {
      f.setStyle(f.get('id') === mine.id ? selectedPolygonStyle : polygonStyle)
    })
    
    markerSource.value.forEachFeature(f => {
      f.setStyle(f.get('id') === mine.id ? selectedMarkerStyle : markerStyle)
    })
    
    // Zoom to polygon
    const view = map.value.getView()
    const polygonFeature = new GeoJSON().readFeature({
      type: 'Feature',
      geometry
    }, { featureProjection: view.getProjection() })
    
    view.fit(polygonFeature.getGeometry(), {
      padding: [50, 50, 50, 50],
      duration: 1000,
      maxZoom: 15
    })
    
    // Show popup with all mine attributes except geometry and id
    popupContent.value.innerHTML = `
      <div class='mine-popup'>
        <h4>${mine['Mine Name'] || mine.mine_name}</h4>
        ${Object.entries(mine)
          .filter(([key]) => key !== 'geometry' && key !== 'id')
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join('')}
      </div>
    `
    
    // Position popup at marker location
    const coords = geometry.coordinates[0][0] // First point of first polygon
    overlay.setPosition(fromLonLat(coords))
  } catch (e) {
    console.error('Error zooming to mine:', e)
  }
}

onMounted(async () => {
  await nextTick()
  
  // Create sources and layers
  polygonSource.value = new VectorSource()
  markerSource.value = new VectorSource()
  
  const polygonLayer = new VectorLayer({ 
    source: polygonSource.value,  // Make sure source is set
    style: polygonStyle,
    zIndex: 1  // Add zIndex to control layer order
  })
  
  const markerLayer = new VectorLayer({
    source: markerSource.value,  // Make sure source is set
    style: markerStyle,
    zIndex: 2  // Put markers above polygons
  })
  
  // Initialize map
  map.value = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({ source: new OSM() }),
      polygonLayer,
      markerLayer
    ],
    view: new View({
      center: fromLonLat([29, -18]), // Zimbabwe center
      zoom: 6
    })
  })

  // Initialize popup
  overlay = new Overlay({
    element: popupContainer.value,
    autoPan: true,
    autoPanAnimation: { duration: 250 }
  })
  map.value.addOverlay(overlay)

  // Load mine data
  await loadMines()

  // Add debug logging
  console.log('Marker source features:', markerSource.value.getFeatures().length)
  console.log('Polygon source features:', polygonSource.value.getFeatures().length)

  // Click handler for features
  map.value.on('singleclick', function (evt) {
    overlay.setPosition(undefined)
    
    // Check if clicked on a marker or polygon
    map.value.forEachFeatureAtPixel(evt.pixel, function (feature) {
      const props = feature.getProperties()
      if (props.id) {  // Only handle mine features
        zoomToMine(props)
      }
    })
  })
})

watch(() => props.selectedMine, (mine) => {
  if (mine) zoomToMine(mine)
})

defineExpose({
  zoomToMine
})
</script>

<style scoped>
.ol-popup {
  position: absolute;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid rgba(0,0,0,0.2);
  min-width: 240px;
  z-index: 1000;
  box-shadow: 0 3px 14px rgba(0,0,0,0.4);
}

.mine-popup h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
}

.mine-popup p {
  margin: 8px 0;
  font-size: 1rem;
  color: #555;
}

.mine-popup strong {
  color: #2c3e50;
  font-weight: 600;
}
</style>
