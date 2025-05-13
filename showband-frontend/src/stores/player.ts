// src/stores/player.ts
import { defineStore } from 'pinia'
import type { Track } from '@/types/strapi'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null as Track | null,
    isPlaying: false,
    queue: [] as Track[],
    currentIndex: 0,
    volume: 80,
  }),

  actions: {
    setTrack(track: Track) {
      this.currentTrack = track
      this.isPlaying = true
    },

    setQueue(tracks: Track[], startIndex = 0) {
      this.queue = tracks
      this.currentIndex = startIndex
      this.currentTrack = tracks[startIndex]
      this.isPlaying = true
    },

    play() {
      this.isPlaying = true
    },

    pause() {
      this.isPlaying = false
    },

    next() {
      if (this.currentIndex < this.queue.length - 1) {
        this.currentIndex++
        this.currentTrack = this.queue[this.currentIndex]
        this.isPlaying = true
      }
    },

    previous() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.currentTrack = this.queue[this.currentIndex]
        this.isPlaying = true
      }
    },

    setVolume(value: number) {
      this.volume = value
    },
  },

  getters: {
    hasNext(): boolean {
      return this.currentIndex < this.queue.length - 1
    },

    hasPrevious(): boolean {
      return this.currentIndex > 0
    },

    currentTrackDuration(): number | null {
      return this.currentTrack?.attributes.duration || null
    },

    currentTrackAudioUrl(): string | null {
      if (!this.currentTrack?.attributes.audioFile?.data?.attributes?.url) {
        return null
      }

      const url = this.currentTrack.attributes.audioFile.data.attributes.url
      if (url.startsWith('http')) return url
      return `${import.meta.env.VITE_API_URL}${url}`
    },

    currentTrackCoverArtUrl(): string | null {
      if (!this.currentTrack?.attributes.coverArt?.data?.attributes?.url) {
        return null
      }

      const url = this.currentTrack.attributes.coverArt.data.attributes.url
      if (url.startsWith('http')) return url
      return `${import.meta.env.VITE_API_URL}${url}`
    },

    currentTrackPerformerName(): string | null {
      return this.currentTrack?.attributes.performer?.data?.attributes?.name || null
    },
  },
})
