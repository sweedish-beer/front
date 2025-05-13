// src/types/strapi.ts

// Common types for Strapi responses
export interface StrapiResponse<T> {
  data: T
  meta: any
}

// Media types
export interface StrapiMediaFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  path: string | null
  url: string
}

export interface StrapiMediaAttributes {
  name: string
  alternativeText: string | null
  caption: string | null
  width: number | null
  height: number | null
  formats: Record<string, StrapiMediaFormat> | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
}

export interface StrapiMedia {
  data: {
    id: number
    attributes: StrapiMediaAttributes
  } | null
}

// Relation types
export interface StrapiRelation<T> {
  data: { id: number; attributes: T }[] | null
}

export interface StrapiSingleRelation<T> {
  data: { id: number; attributes: T } | null
}

// Performer types
export interface PerformerAttributes {
  name: string
  slug: string
  bio: string | null
  genre: string | null
  location: string | null
  profileImage: StrapiMedia
  coverImage: StrapiMedia
  websiteUrl: string | null
  socialLinks: any | null
  featured: boolean
  verified: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  tracks?: StrapiRelation<TrackAttributes>
  albums?: StrapiRelation<AlbumAttributes>
  events?: StrapiRelation<EventAttributes>
  localizations?: StrapiRelation<PerformerAttributes>
}

export interface Performer {
  id: number
  attributes: PerformerAttributes
}

// Track types
export interface TrackAttributes {
  title: string
  audioFile: StrapiMedia
  coverArt: StrapiMedia
  releaseDate: string | null
  duration: number | null
  genre: string | null
  description: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  performer?: StrapiSingleRelation<PerformerAttributes>
  album?: StrapiSingleRelation<AlbumAttributes>
  localizations?: StrapiRelation<TrackAttributes>
}

export interface Track {
  id: number
  attributes: TrackAttributes
}

// Album types
export interface AlbumAttributes {
  title: string
  coverArt: StrapiMedia
  releaseDate: string | null
  description: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  performer?: StrapiSingleRelation<PerformerAttributes>
  tracks?: StrapiRelation<TrackAttributes>
  localizations?: StrapiRelation<AlbumAttributes>
}

export interface Album {
  id: number
  attributes: AlbumAttributes
}

// Event types
export interface EventAttributes {
  title: string
  dateTime: string
  endDateTime: string | null
  venueName: string | null
  address: string | null
  city: string | null
  country: string | null
  description: string | null
  image: StrapiMedia
  ticketUrl: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  performers?: StrapiRelation<PerformerAttributes>
  localizations?: StrapiRelation<EventAttributes>
}

export interface Event {
  id: number
  attributes: EventAttributes
}
