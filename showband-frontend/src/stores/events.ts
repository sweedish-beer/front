// src/stores/events.ts
import { defineStore } from 'pinia'
import { eventService } from '@/services/api'

interface EventAttributes {
  title: string
  dateTime: string
  venueName?: string
  city?: string
  image?: {
    data?: {
      attributes?: {
        url?: string
      }
    }
  }
  // Add other attributes as needed
}

interface Event {
  id: number
  attributes: EventAttributes
}

export const useEventStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
    loading: false,
    error: null as any,
  }),

  actions: {
    async fetchEvents(params = {}) {
      this.loading = true
      try {
        console.log('Fetching events with params:', params)
        const data = await eventService.getAll(params)
        console.log('Received events data:', data)
        if (!data || data.length === 0) {
          console.warn('No events found in response')
        }
        this.events = data || []
      } catch (error) {
        console.error('Error in store:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchUpcomingEvents() {
      console.log('Fetching upcoming events')
      this.loading = true
      try {
        const data = await eventService.getUpcoming()
        console.log('Received upcoming events:', data)
        if (!data || data.length === 0) {
          console.warn('No upcoming events found')
        }
        this.events = data || []
      } catch (error) {
        console.error('Error fetching upcoming events:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
