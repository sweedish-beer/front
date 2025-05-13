import { defineStore } from 'pinia'

interface Track {
  id: number
  attributes: {
    title: string
    audioFile: any
    coverArt: any
    performer: any
    // Add other track properties
  }
}

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
      }
    },

    previous() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.currentTrack = this.queue[this.currentIndex]
      }
    },

    setVolume(value: number) {
      this.volume = value
    },
  },
})
