// src/stores/tracks.ts
import { defineStore } from 'pinia'
import { trackService } from '@/services/api'

interface TrackAttributes {
  title: string
  featured?: boolean
  // Add other properties as needed
  coverArt?: {
    data?: {
      attributes?: {
        url?: string
      }
    }
  }
  performer?: {
    data?: {
      attributes?: {
        name?: string
      }
    }
  }
}

interface Track {
  id: number
  attributes: TrackAttributes
}

export const useTrackStore = defineStore('tracks', {
  state: () => ({
    tracks: [] as Track[],
    loading: false,
    error: null as any,
  }),

  actions: {
    async fetchTracks(params = {}) {
      this.loading = true
      try {
        console.log('Fetching tracks with params:', params)
        const data = await trackService.getAll(params)
        console.log('Received tracks data:', data)
        if (!data || data.length === 0) {
          console.warn('No tracks found in response')
        }
        this.tracks = data || []
      } catch (error) {
        console.error('Error in store:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedTracks() {
      console.log('Fetching featured tracks')
      await this.fetchTracks({
        'filters[featured][$eq]': true,
      })
      console.log('Featured tracks count:', this.tracks.length)
    },
  },
})
