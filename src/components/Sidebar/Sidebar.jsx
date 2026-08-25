import { useNavigate } from 'react-router-dom'
import { Home, PanelLeftClose, PanelLeftOpen, Star, Tv } from 'lucide-react'
import logo from '../../assets/logo.webp'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { icon: Home, label: 'Início', path: '/home' },
  { icon: Tv, label: 'Séries', path: '/series' },
  { icon: Star, label: 'Minha lista', path: '/minha-lista' },
]

export function Sidebar({ profile, activePath, collapsed, onToggleCollapsed }) {
  const navigate = useNavigate()

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="YouPlay Jr." className={styles.logo} />
        </div>
        <button
          type="button"
          className={styles.toggle}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            type="button"
            className={`${styles.navItem} ${activePath === path || (path !== '/home' && activePath.startsWith(`${path}/`)) ? styles.navItemActive : ''}`}
            onClick={() => navigate(`${path}${profile ? `?profile=${profile.id}` : ''}`)}
            title={label}
          >
            <Icon size={20} strokeWidth={2.2} />
            <span className={styles.navLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
