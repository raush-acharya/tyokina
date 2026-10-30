// Product images, keyed by catalog id. They are AI-generated studio-style illustrations (made with ChatGPT's
// image tool), not photographs of the exact units, and the app says so wherever they are shown.
// Square, 800px, WebP: sharp at 2x for the 340px hero and the 64px thumbnail alike.
import xm5 from './assets/products/xm5.webp'
import qc45 from './assets/products/qc45.webp'
import apm from './assets/products/apm.webp'
import xm4 from './assets/products/xm4.webp'
import mba from './assets/products/mba.webp'
import lgc4 from './assets/products/lgc4.webp'
import mx3s from './assets/products/mx3s.webp'
import s24 from './assets/products/s24.webp'
import v15 from './assets/products/v15.webp'

export interface Photo {
  src: string
  alt: string
}

export const photos: Record<string, Photo> = {
  xm5: { src: xm5, alt: 'Silver-white Sony WH-1000XM5 over-ear headphones' },
  qc45: { src: qc45, alt: 'Black Bose QuietComfort 45 over-ear headphones' },
  apm: { src: apm, alt: 'Silver Apple AirPods Max over-ear headphones' },
  xm4: { src: xm4, alt: 'Black Sony WH-1000XM4 over-ear headphones' },
  mba: { src: mba, alt: 'Silver MacBook Air M3 open on a blue and violet wallpaper' },
  lgc4: { src: lgc4, alt: 'LG C4 OLED television showing a colourful abstract wallpaper' },
  mx3s: { src: mx3s, alt: 'Graphite Logitech MX Master 3S wireless mouse' },
  s24: { src: s24, alt: 'Black Samsung Galaxy S24 smartphone, front and back' },
  v15: { src: v15, alt: 'Dyson V15 cordless stick vacuum with its cleaner head' },
}
