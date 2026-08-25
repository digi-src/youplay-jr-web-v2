import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Users, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProfile } from '../../api/profiles'
import { Avatar } from '../Avatar/Avatar'
import styles from './ProfileMenu.module.css'

export function ProfileMenu() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const profile = getProfile(searchParams.get('profile'))
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false)

  useEffect(() => {
    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return

      if (logoutConfirmationOpen) {
        setLogoutConfirmationOpen(false)
      } else {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [logoutConfirmationOpen])

  function openLogoutConfirmation() {
    setMenuOpen(false)
    setLogoutConfirmationOpen(true)
  }

  function logout() {
    localStorage.removeItem('token')
    setLogoutConfirmationOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className={styles.wrapper} ref={menuRef}>
        <button
          type="button"
          className={`${styles.trigger} ${menuOpen ? styles.triggerOpen : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <Avatar name={profile?.name} color={profile?.color || 'var(--color-primary)'} size="sm" />
          <span className={styles.profileText}>
            <small>Assistindo como</small>
            <strong>{profile?.name || 'Perfil'}</strong>
          </span>
          <ChevronDown
            size={17}
            className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          />
        </button>

        {menuOpen && (
          <div className={styles.dropdown} role="menu">
            <div className={styles.dropdownProfile}>
              <Avatar name={profile?.name} color={profile?.color || 'var(--color-primary)'} size="sm" />
              <div>
                <strong>{profile?.name || 'Perfil atual'}</strong>
                <span>{profile ? 'Perfil infantil ativo' : 'Selecione um perfil'}</span>
              </div>
            </div>

            <div className={styles.divider} />

            <button type="button" role="menuitem" onClick={() => navigate('/profiles')}>
              <Users size={19} aria-hidden="true" />
              Trocar perfil
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.logoutItem}
              onClick={openLogoutConfirmation}
            >
              <LogOut size={19} aria-hidden="true" />
              Sair da conta
            </button>
          </div>
        )}
      </div>

      {logoutConfirmationOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLogoutConfirmationOpen(false)
          }}
        >
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setLogoutConfirmationOpen(false)}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className={styles.modalIcon}>
              <LogOut size={27} aria-hidden="true" />
            </div>
            <h2 id="logout-title">Sair da conta?</h2>
            <p>Você precisará entrar novamente para acessar os perfis e continuar assistindo.</p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setLogoutConfirmationOpen(false)}
              >
                Cancelar
              </button>
              <button type="button" className={styles.confirmButton} onClick={logout}>
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
