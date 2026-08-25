import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.webp'
import mascot from '../../assets/mascot.webp'
import { requestOtp, verifyOtp } from '../../api/auth'
import { OtpInput } from '../../components/OtpInput/OtpInput'
import styles from './LoginPage.module.css'

const OTP_LENGTH = 6

export function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await requestOtp(email)
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = await verifyOtp(email, code)
      localStorage.setItem('token', token)
      navigate('/profiles')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChangeEmail() {
    setStep('email')
    setCode('')
    setError('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formContent}>
          <img src={logo} alt="YouPlay Jr." className={styles.logo} />

          <h1 className={styles.title}>
            Aperte o play.
            <br />
            A gente cuida do resto.
          </h1>

          <p className={styles.subtitle}>
            Um catálogo escolhido por faixa de idade, sem anúncios e com tempo
            de tela sob controle dos pais.
          </p>

          {step === 'email' ? (
            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <label className={styles.label} htmlFor="email">
                E-MAIL
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="familia@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              {error && <p className={styles.error}>{error}</p>}

              <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleOtpSubmit}>
              <label className={styles.label}>CÓDIGO</label>
              <p className={styles.otpHint}>
                Enviamos um código para <strong>{email}</strong>
              </p>

              <OtpInput
                length={OTP_LENGTH}
                value={code}
                onChange={setCode}
                disabled={loading}
              />

              {error && <p className={styles.error}>{error}</p>}

              <button
                className={styles.button}
                type="submit"
                disabled={loading || code.length < OTP_LENGTH}
              >
                {loading ? 'Validando...' : 'Entrar'}
              </button>

              <button
                type="button"
                className={styles.linkButton}
                onClick={handleChangeEmail}
              >
                Usar outro e-mail
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.artSide}>
        <div className={styles.mascotCircle}>
          <img src={mascot} alt="Juca, o mascote do YouPlay Jr." className={styles.mascot} />
        </div>
      </div>
    </div>
  )
}
