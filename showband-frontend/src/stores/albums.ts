import { defineStore } from 'pinia'
import { albumService } from '@/services/api'

export const useAlbumStore = defineStore('albums', {
  state: () => ({
    albums: [],
    currentAlbum: null as null | Record<string, any>,
    loading: false,
    error: null as null | unknown,
  }),

  actions: {
    async fetchAlbums(params = {}) {
      this.loading = true
      try {
        this.albums = await albumService.getAll(params)
        this.loading = false
      } catch (error) {
        this.error = error
        this.loading = false
      }
    },

    async fetchAlbumById(id: number | string): Promise<void> {
      this.loading = true
      try {
      this.currentAlbum = await albumService.getById(Number(id))
      this.loading = false
      } catch (error: unknown) {
      this.error = error
      this.loading = false
      }
    },
  },
})
