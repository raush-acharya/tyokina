import { photos } from '../photos'
import { cx } from './ui'

/**
 * A product image. These are AI-generated illustrations, so the large version says so in a caption
 * (the app's rule: be honest about what we know and what we don't). Products without an image show a plain frame.
 */
export function ProductPhoto({ pid, name, size = 'lg' }: { pid: string; name: string; size?: 'lg' | 'sm' }) {
  const p = photos[pid]
  if (!p) {
    return (
      <div className={cx('photo', 'photo--' + size, 'photo--empty')} role="img" aria-label={`No image of the ${name} yet`}>
        {size === 'lg' && <span className="small muted">Image coming soon</span>}
      </div>
    )
  }
  return (
    <figure className={cx('photo', 'photo--' + size)}>
      <img src={p.src} alt={p.alt} width={800} height={800} loading={size === 'sm' ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  )
}
