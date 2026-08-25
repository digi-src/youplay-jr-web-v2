import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { getProfile } from '../../api/profiles'
import styles from './AppLayout.module.css'

const STORAGE_KEY = 'youplay_sidebar_collapsed'

export function AppLayout({ children }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const profile = getProfile(searchParams.get('profile'))
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        profile={profile}
        activePath={location.pathname}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />
      <main className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>{children}</main>
    </div>
  )
}
