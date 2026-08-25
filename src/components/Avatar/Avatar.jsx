import styles from './Avatar.module.css'

export function Avatar({ name, color, size = 'md' }) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background: color }}
    >
      {initial}
    </div>
  )
}
