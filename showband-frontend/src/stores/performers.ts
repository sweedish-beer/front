// src/stores/performers.ts
import { defineStore } from 'pinia'
import { performerService } from '@/services/api'
import type { Performer } from '@/types/strapi'

export const usePerformerStore = defineStore('performers', {
  state: () => ({
    performers: [] as Performer[],
    currentPerformer: null as Performer | null,
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    async fetchPerformers(params = {}) {
      this.loading = true
      try {
        console.log('Fetching performers with params:', params)
        const data = await performerService.getAll(params)
        console.log('Received performers data:', data)
        this.performers = data || []
      } catch (error) {
        console.error('Error in store:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },

    async fetchPerformerBySlug(slug: string) {
      this.loading = true
      try {
        console.log('Fetching performer by slug:', slug)
        const data = await performerService.getBySlug(slug)
        console.log('Performer by slug result:', data)
        this.currentPerformer = data
        return data
      } catch (error) {
        console.error('Error fetching performer by slug:', error)
        this.error = error as Error
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedPerformers() {
      console.log('Fetching featured performers')
      this.loading = true
      try {
        const data = await performerService.getFeatured()
        console.log('Featured performers result:', data)
        this.performers = data || []
      } catch (error) {
        console.error('Error fetching featured performers:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    featuredPerformers(): Performer[] {
      return this.performers.filter((performer) => performer.attributes.featured)
    },

    verifiedPerformers(): Performer[] {
      return this.performers.filter((performer) => performer.attributes.verified)
    },
  },
})
