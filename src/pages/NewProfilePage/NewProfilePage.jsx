import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import mascot from '../../assets/mascot-standing.webp'
import { createProfile } from '../../api/profiles'
import { Avatar } from '../../components/Avatar/Avatar'
import {
  AGE_RANGES,
  AVATAR_COLORS,
  SCREEN_TIME_OPTIONS,
  ageRangeLabel,
  screenTimeLabel,
} from '../../constants/profile'
import styles from './NewProfilePage.module.css'

export function NewProfilePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [ageRange, setAgeRange] = useState(AGE_RANGES[1].value)
  const [color, setColor] = useState(AVATAR_COLORS[0])
  const [screenTimeLimit, setScreenTimeLimit] = useState(SCREEN_TIME_OPTIONS[1].value)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    createProfile({ name: name.trim(), ageRange, color, screenTimeLimit })
    navigate('/profiles')
  }

  return (
    <div className={styles.page}>
      <Link to="/profiles" className={styles.backButton}>
        ← Perfis
      </Link>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.eyebrow}>Novo perfil</p>
          <h1 className={styles.title}>Vamos criar o perfil da criança</h1>
          <p className={styles.subtitle}>
            A idade define o catálogo que aparece na Home. Você pode mudar
            tudo isso depois na área dos pais.
          </p>

          <label className={styles.label} htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da criança"
            required
          />

          <p className={styles.label}>Idade</p>
          <div className={styles.pillRow}>
            {AGE_RANGES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.pill} ${ageRange === option.value ? styles.pillActive : ''}`}
                onClick={() => setAgeRange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className={styles.label}>Cor do avatar</p>
          <div className={styles.colorRow}>
            {AVATAR_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`Cor ${option}`}
                className={`${styles.colorSwatch} ${color === option ? styles.colorSwatchActive : ''}`}
                style={{ background: option }}
                onClick={() => setColor(option)}
              />
            ))}
          </div>

          <p className={styles.label}>Limite diário de tela</p>
          <div className={styles.pillRow}>
            {SCREEN_TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.pill} ${screenTimeLimit === option.value ? styles.pillActive : ''}`}
                onClick={() => setScreenTimeLimit(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.submitButton} type="submit" disabled={!name.trim()}>
              Criar perfil
            </button>
            <Link to="/profiles" className={styles.cancelButton}>
              Cancelar
            </Link>
          </div>
        </form>

        <div className={styles.preview}>
          <p className={styles.previewEyebrow}>Prévia</p>
          <Avatar name={name || '?'} color={color} size="lg" />
          <p className={styles.previewName}>{name || 'Nome da criança'}</p>
          <p className={styles.previewMeta}>
            {ageRangeLabel(ageRange)} · {screenTimeLabel(screenTimeLimit)}
          </p>
          <img src={mascot} alt="" className={styles.previewMascot} />
        </div>
      </div>
    </div>
  )
}
