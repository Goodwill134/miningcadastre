import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'

// Removed TypeScript interface ServerStatus
export const useServerHealth = () => {
  const status = ref({
    isOnline: true,
    lastCheck: new Date(),
    message: 'Server is online'
  })

  const checkServer = async () => {
    try {
      const response = await fetch('/health')
      if (response.ok) {
        status.value = {
          isOnline: true,
          lastCheck: new Date(),
          message: 'Server is online'
        }
      } else {
        throw new Error('Server returned error status')
      }
    } catch (error) {
      status.value = {
        isOnline: false,
        lastCheck: new Date(),
        message: 'Server is offline'
      }
      
      // Show toast notification
      const toast = useToast()
      toast.error('Backend server is not responding. Please check the connection.')
    }
  }

  // Check server status periodically
  let interval: NodeJS.Timeout

  const startMonitoring = () => {
    checkServer()
    interval = setInterval(checkServer, 5000) // Check every 5 seconds
  }

  const stopMonitoring = () => {
    if (interval) {
      clearInterval(interval)
    }
  }

  onMounted(startMonitoring)
  onUnmounted(stopMonitoring)

  return {
    status,
    checkServer,
    startMonitoring,
    stopMonitoring
  }
}
