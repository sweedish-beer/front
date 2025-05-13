// src/stores/events.ts
import { defineStore } from 'pinia'
import { eventService } from '@/services/api'
import type { Event } from '@/types/strapi'

export const useEventStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    async fetchEvents(params = {}) {
      this.loading = true
      try {
        console.log('Fetching events with params:', params)
        const data = await eventService.getAll(params)
        console.log('Received events data:', data)
        this.events = data || []
      } catch (error) {
        console.error('Error in store:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },

    async fetchUpcomingEvents() {
      console.log('Fetching upcoming events')
      this.loading = true
      try {
        const data = await eventService.getUpcoming()
        console.log('Upcoming events result:', data)
        this.events = data || []
      } catch (error) {
        console.error('Error fetching upcoming events:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    featuredEvents(): Event[] {
      return this.events.filter((event) => event.attributes.featured)
    },

    sortedUpcomingEvents(): Event[] {
      return [...this.events].sort((a, b) => {
        const dateA = new Date(a.attributes.dateTime).getTime()
        const dateB = new Date(b.attributes.dateTime).getTime()
        return dateA - dateB
      })
    },

    eventsByPerformer:
      (state) =>
      (performerId: number): Event[] => {
        return state.events.filter((event) =>
          event.attributes.performers?.data?.some((performer) => performer.id === performerId),
        )
      },
  },
})
