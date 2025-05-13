// src/services/api.ts
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to handle Strapi's data structure
const extractData = (response: any) => {
  console.log('Raw API response:', response)
  if (!response?.data) {
    console.warn('No data property in response')
    return []
  }

  if (!response.data.data) {
    console.warn('No data.data property in response')
    return []
  }

  const extractedData = response.data.data
  console.log('Extracted data:', extractedData)
  return extractedData
}

export const performerService = {
  async getAll(params = {}) {
    try {
      console.log('Calling Performers API with params:', params)
      const response = await api.get('/performers', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData(response)
    } catch (error) {
      console.error('Error fetching performers:', error)
      return []
    }
  },

  async getBySlug(slug: string) {
    try {
      const response = await api.get('/performers', {
        params: {
          'filters[slug][$eq]': slug,
          populate: '*',
        },
      })
      return extractData(response)[0]
    } catch (error) {
      console.error('Error fetching performer by slug:', error)
      return null
    }
  },

  async getFeatured() {
    return this.getAll({
      'filters[featured][$eq]': true,
      populate: '*',
    })
  },
}

export const trackService = {
  async getAll(params = {}) {
    try {
      console.log('Calling Tracks API with params:', params)
      const response = await api.get('/tracks', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData(response)
    } catch (error) {
      console.error('Error fetching tracks:', error)
      return []
    }
  },

  async getFeatured() {
    return this.getAll({
      'filters[featured][$eq]': true,
      populate: '*',
    })
  },
}

export const albumService = {
  async getAll(params = {}) {
    try {
      console.log('Calling Albums API with params:', params)
      const response = await api.get('/albums', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData(response)
    } catch (error) {
      console.error('Error fetching albums:', error)
      return []
    }
  },

  async getById(id: number) {
    try {
      const response = await api.get(`/albums/${id}`, {
        params: {
          populate: '*',
        },
      })
      return extractData(response)
    } catch (error) {
      console.error('Error fetching album by ID:', error)
      return null
    }
  },

  async getFeatured() {
    return this.getAll({
      'filters[featured][$eq]': true,
      populate: '*',
    })
  },
}

export const eventService = {
  async getAll(params = {}) {
    try {
      console.log('Calling Events API with params:', params)
      const response = await api.get('/events', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData(response)
    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  },

  async getUpcoming() {
    const today = new Date().toISOString()
    return this.getAll({
      'filters[dateTime][$gt]': today,
      'sort[0]': 'dateTime:asc',
      populate: '*',
    })
  },
}
