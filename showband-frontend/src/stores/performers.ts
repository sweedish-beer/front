import { defineStore } from 'pinia'
import { performerService } from '@/services/api'

export const usePerformerStore = defineStore('performers', {
  state: () => ({
    performers: [],
    currentPerformer: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPerformers(params = {}) {
      this.loading = true
      try {
        this.performers = await performerService.getAll(params)
        this.loading = false
      } catch (error) {
        this.error = error
        this.loading = false
      }
    },

    async fetchPerformerBySlug(slug) {
      this.loading = true
      try {
        this.currentPerformer = await performerService.getBySlug(slug)
        this.loading = false
        return this.currentPerformer
      } catch (error) {
        this.error = error
        this.loading = false
      }
    },
  },
})
