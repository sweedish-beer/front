// src/services/api.ts
import axios from 'axios'
import type { Performer, Track, Album, Event, StrapiResponse } from '@/types/strapi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337'
const API_TOKEN = import.meta.env.VITE_API_TOKEN

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

// Helper to handle Strapi's data structure
const extractData = <T>(response: { data: StrapiResponse<T> }): T => {
  if (!response.data?.data) {
    console.warn('No data property in response')
    return [] as unknown as T
  }

  return response.data.data
}

export const performerService = {
  async getAll(params = {}): Promise<Performer[]> {
    try {
      console.log('Calling Performers API with params:', params)
      const response = await api.get('/performers', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData<Performer[]>(response)
    } catch (error) {
      console.error('Error fetching performers:', error)
      return []
    }
  },

  async getBySlug(slug: string): Promise<Performer | null> {
    try {
      const response = await api.get('/performers', {
        params: {
          'filters[slug][$eq]': slug,
          populate: '*',
        },
      })
      const performers = extractData<Performer[]>(response)
      return performers.length > 0 ? performers[0] : null
    } catch (error) {
      console.error('Error fetching performer by slug:', error)
      return null
    }
  },

  async getFeatured(): Promise<Performer[]> {
    return this.getAll({
      'filters[featured][$eq]': true,
      populate: '*',
    })
  },
}

export const trackService = {
  async getAll(params = {}): Promise<Track[]> {
    try {
      console.log('Calling Tracks API with params:', params)
      const response = await api.get('/tracks', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData<Track[]>(response)
    } catch (error) {
      console.error('Error fetching tracks:', error)
      return []
    }
  },

  async getFeatured(): Promise<Track[]> {
    return this.getAll({
      'filters[featured][$eq]': true,
      populate: '*',
    })
  },
}

export const albumService = {
  async getAll(params = {}): Promise<Album[]> {
    try {
      console.log('Calling Albums API with params:', params)
      const response = await api.get('/albums', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData<Album[]>(response)
    } catch (error) {
      console.error('Error fetching albums:', error)
      return []
    }
  },

  async getById(id: number): Promise<Album | null> {
    try {
      const response = await api.get(`/albums/${id}`, {
        params: {
          populate: '*',
        },
      })
      return extractData<Album>(response)
    } catch (error) {
      console.error('Error fetching album by ID:', error)
      return null
    }
  },

  async getFeatured(): Promise<Album[]> {
    return this.getAll({
      'filters[featured][$eq]': true,
      populate: '*',
    })
  },
}

export const eventService = {
  async getAll(params = {}): Promise<Event[]> {
    try {
      console.log('Calling Events API with params:', params)
      const response = await api.get('/events', {
        params: {
          populate: '*',
          ...params,
        },
      })
      return extractData<Event[]>(response)
    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  },

  async getUpcoming(): Promise<Event[]> {
    const today = new Date().toISOString()
    return this.getAll({
      'filters[dateTime][$gt]': today,
      'sort[0]': 'dateTime:asc',
      populate: '*',
    })
  },
}
