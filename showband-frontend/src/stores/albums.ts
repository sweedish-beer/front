// src/stores/albums.ts
import { defineStore } from 'pinia'
import { albumService } from '@/services/api'
import type { Album } from '@/types/strapi'

export const useAlbumStore = defineStore('albums', {
  state: () => ({
    albums: [] as Album[],
    currentAlbum: null as Album | null,
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    async fetchAlbums(params = {}) {
      this.loading = true
      try {
        console.log('Fetching albums with params:', params)
        const data = await albumService.getAll(params)
        console.log('Received albums data:', data)
        this.albums = data || []
      } catch (error) {
        console.error('Error in store:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },

    async fetchAlbumById(id: number) {
      this.loading = true
      try {
        console.log('Fetching album by ID:', id)
        const data = await albumService.getById(id)
        console.log('Album by ID result:', data)
        this.currentAlbum = data
        return data
      } catch (error) {
        console.error('Error fetching album by ID:', error)
        this.error = error as Error
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedAlbums() {
      console.log('Fetching featured albums')
      this.loading = true
      try {
        const data = await albumService.getFeatured()
        console.log('Featured albums result:', data)
        this.albums = data || []
      } catch (error) {
        console.error('Error fetching featured albums:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    featuredAlbums(): Album[] {
      return this.albums.filter((album) => album.attributes.featured)
    },

    albumsByPerformer:
      (state) =>
      (performerId: number): Album[] => {
        return state.albums.filter((album) => album.attributes.performer?.data?.id === performerId)
      },
  },
})
