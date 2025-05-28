<template>
  <div class="server-status" :class="{ 'offline': !status.isOnline }">
    <div class="status-icon">
      <span v-if="status.isOnline" class="online-dot">✓</span>
      <span v-else class="offline-dot">!</span>
    </div>
    <div class="status-message">
      {{ status.message }}
      <small>Last checked: {{ lastCheck }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useServerHealth } from '@/utils/healthCheck'

const { status } = useServerHealth()

const lastCheck = computed(() => {
  return new Date(status.value.lastCheck).toLocaleTimeString()
})
</script>

<style scoped>
.server-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--color-background-soft);
  margin-bottom: 20px;
}

.status-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.online-dot {
  background-color: #4CAF50;
  color: white;
}

.offline-dot {
  background-color: #f44336;
  color: white;
}

.status-message {
  flex: 1;
}

.offline {
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
}

small {
  font-size: 0.8em;
  color: var(--color-text-secondary);
}
</style>
