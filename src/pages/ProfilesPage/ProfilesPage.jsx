import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.webp'
import mascot from '../../assets/mascot-standing.webp'
import { getProfiles } from '../../api/profiles'
import { Avatar } from '../../components/Avatar/Avatar'
import { ageRangeLabel } from '../../constants/profile'
import styles from './ProfilesPage.module.css'

export function ProfilesPage() {
  const navigate = useNavigate()
  const [profiles] = useState(getProfiles)

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.artSide}>
          <div className={styles.mascotCircle}>
            <img src={mascot} alt="Juca, o mascote do YouPlay Jr." className={styles.mascot} />
          </div>
        </div>

        <div className={styles.content}>
          <img src={logo} alt="YouPlay Jr." className={styles.logo} />

          <h1 className={styles.title}>Quem vai assistir hoje?</h1>

          <div className={styles.grid}>
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className={styles.card}
                onClick={() => navigate(`/home?profile=${profile.id}`)}
              >
                <Avatar name={profile.name} color={profile.color} size="md" />
                <span className={styles.cardName}>{profile.name}</span>
                <span className={styles.cardAge}>{ageRangeLabel(profile.ageRange)}</span>
              </button>
            ))}

            <Link to="/profiles/new" className={`${styles.card} ${styles.newCard}`}>
              <span className={styles.plus}>+</span>
              <span className={styles.newCardLabel}>Novo perfil</span>
            </Link>
          </div>

          <div className={styles.footerActions}>
            <button type="button" className={styles.parentsButton}>
              Área dos pais
            </button>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
