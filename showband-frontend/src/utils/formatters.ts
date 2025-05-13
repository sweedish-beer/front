export function formatDuration(durationInMinutes: number): string {
  if (!durationInMinutes) return '--:--'

  const minutes = Math.floor(durationInMinutes)
  const seconds = Math.round((durationInMinutes - minutes) * 60)

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function extractImageUrl(strapiImage: any, fallback = '/placeholder.jpg'): string {
  if (!strapiImage?.data) return fallback

  return `${import.meta.env.VITE_API_URL}${strapiImage.data.attributes.url}`
}
