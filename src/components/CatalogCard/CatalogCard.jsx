import styles from './CatalogCard.module.css'

export function CatalogCard({ cover, tone = 'purple', badge, title, subtitle, progress, onClick }) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={styles.card}
      onClick={onClick}
    >
      <div className={styles.coverWrapper}>
        {cover ? (
          <img src={cover} alt={title} className={styles.coverImage} />
        ) : (
          <div className={`${styles.placeholder} ${styles[tone]}`} />
        )}
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      <p className={styles.title}>{title}</p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {typeof progress === 'number' && (
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
    </Tag>
  )
}
