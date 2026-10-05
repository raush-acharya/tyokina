// Freely licensed product photos (Wikimedia Commons), keyed by catalog id.
// Each entry keeps the author, licence and source page so the credit can be shown.
export interface Photo {
  src: string
  author: string
  license: string
  page: string
  alt?: string
}

export const photos: Record<string, Photo> = {}
