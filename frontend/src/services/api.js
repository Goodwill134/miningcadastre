import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if needed
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const parcelsApi = {
  async getParcels(params = {}) {
    return api.get('/api/parcels', { params })
  },
  async getParcel(id) {
    return api.get(`/api/parcels/${id}`)
  },
  async createParcel(data) {
    return api.post('/api/parcels', data)
  },
  async updateParcel(id, data) {
    return api.put(`/api/parcels/${id}`, data)
  },
  async deleteParcel(id) {
    return api.delete(`/api/parcels/${id}`)
  }
};

export const preciParcelsApi = {
  async getParcels() {
    return api.get('/api/preci-parcels')
  }
};

export const propertiesApi = {
  async getProperties(params = {}) {
    return api.get('/api/properties', { params })
  },

  async createProperty(data) {
    return api.post('/api/properties', data)
  },

  async updateProperty(id, data) {
    return api.put(`/api/properties/${id}`, data)
  },

  async deleteProperty(id) {
    return api.delete(`/api/properties/${id}`)
  }
}

export const ownersApi = {
  async getOwners(params = {}) {
    return api.get('/api/owners', { params })
  },

  async createOwner(data) {
    return api.post('/api/owners', data)
  },

  async updateOwner(id, data) {
    return api.put(`/api/owners/${id}`, data)
  },

  async deleteOwner(id) {
    return api.delete(`/api/owners/${id}`)
  }
}
