// src/stores/tracks.ts
import { defineStore } from 'pinia'
import { trackService } from '@/services/api'
import type { Track } from '@/types/strapi'

export const useTrackStore = defineStore('tracks', {
  state: () => ({
    tracks: [] as Track[],
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    async fetchTracks(params = {}) {
      this.loading = true
      try {
        console.log('Fetching tracks with params:', params)
        const data = await trackService.getAll(params)
        console.log('Received tracks data:', data)
        this.tracks = data || []
      } catch (error) {
        console.error('Error in store:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedTracks() {
      console.log('Fetching featured tracks')
      this.loading = true
      try {
        const data = await trackService.getFeatured()
        console.log('Featured tracks result:', data)
        this.tracks = data || []
      } catch (error) {
        console.error('Error fetching featured tracks:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    featuredTracks(): Track[] {
      return this.tracks.filter((track) => track.attributes.featured)
    },

    tracksByPerformer:
      (state) =>
      (performerId: number): Track[] => {
        return state.tracks.filter((track) => track.attributes.performer?.data?.id === performerId)
      },

    tracksByGenre:
      (state) =>
      (genre: string): Track[] => {
        return state.tracks.filter((track) => track.attributes.genre === genre)
      },
  },
})
