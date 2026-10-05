import { photos } from '../photos'
import { cx } from './ui'

/**
 * A product photo with its licence credit. Products without a sourced photo
 * show a plain frame rather than a stand-in drawing.
 */
export function ProductPhoto({ pid, name, size = 'lg' }: { pid: string; name: string; size?: 'lg' | 'sm' }) {
  const p = photos[pid]
  if (!p) {
    return (
      <div className={cx('photo', 'photo--' + size, 'photo--empty')} role="img" aria-label={`No photo of the ${name} yet`}>
        {size === 'lg' && <span className="small muted">Photo coming soon</span>}
      </div>
    )
  }
  return (
    <figure className={cx('photo', 'photo--' + size)}>
      <img src={p.src} alt={p.alt ?? name} loading="lazy" decoding="async" />
      {size === 'lg' && (
        <figcaption className="photo__credit">
          Photo: <a href={p.page} target="_blank" rel="noreferrer">{p.author}</a>, {p.license}
        </figcaption>
      )}
    </figure>
  )
}
