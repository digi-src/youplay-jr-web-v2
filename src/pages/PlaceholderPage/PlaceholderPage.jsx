import { AppLayout } from '../../components/AppLayout/AppLayout'
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu'
import styles from './PlaceholderPage.module.css'

export function PlaceholderPage({ title }) {
  return (
    <AppLayout>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <ProfileMenu />
        </header>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>Essa página ainda está em construção.</p>
        </div>
      </div>
    </AppLayout>
  )
}
