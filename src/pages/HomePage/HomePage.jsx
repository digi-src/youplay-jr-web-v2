import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Info, Play, Search } from 'lucide-react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { CatalogCard } from '../../components/CatalogCard/CatalogCard'
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu'
import { fetchTitles } from '../../api/titles'
import { getProfile } from '../../api/profiles'
import { CATID_SERIES, CONTINUE_WATCHING } from '../../constants/catalog'
import heroMascot from '../../assets/mascot-headphones.webp'
import ctaMascot from '../../assets/mascot-sitting.webp'
import styles from './HomePage.module.css'

const AGE_FILTERS = [
  { value: 'all', label: 'Todas as idades' },
  { value: '2-5', label: '2–5' },
  { value: '6-10', label: '6–10' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const profile = getProfile(searchParams.get('profile'))
  const [ageFilter, setAgeFilter] = useState('all')

  const [series, setSeries] = useState([])
  const [seriesLoading, setSeriesLoading] = useState(true)
  const [seriesError, setSeriesError] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchTitles(CATID_SERIES)
      .then((data) => {
        if (!cancelled) setSeries(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) setSeriesError(err.message)
      })
      .finally(() => {
        if (!cancelled) setSeriesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppLayout>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="#top" className={styles.navLinkActive}>
            Início
          </a>
          <Link to={`/series${profile ? `?profile=${profile.id}` : ''}`} className={styles.navLink}>
            Séries
          </Link>
          <Link
            to={`/minha-lista${profile ? `?profile=${profile.id}` : ''}`}
            className={styles.navLink}
          >
            Minha lista
          </Link>
        </nav>

        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar desenhos e músicas"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.ageFilters}>
          {AGE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.agePill} ${ageFilter === option.value ? styles.agePillActive : ''}`}
              onClick={() => setAgeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <ProfileMenu />
      </header>

      <div id="top" className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.heroTag}>Tempo de tela com propósito</span>
            <h1 className={styles.heroTitle}>
              Muito além do <span>entretenimento.</span>
            </h1>
            <p className={styles.heroDescription}>
              Conteúdo selecionado, seguro e cheio de valores para acompanhar o desenvolvimento
              do seu filho nos primeiros anos.
            </p>

            <div className={styles.heroActions}>
              <button type="button" className={styles.watchButton}>
                <Play size={17} fill="currentColor" aria-hidden="true" />
                Começar agora
              </button>
              <button type="button" className={styles.listButton}>
                <Info size={18} aria-hidden="true" />
                Saiba mais
              </button>
            </div>
          </div>

          <div className={styles.heroArt}>
            <img src={heroMascot} alt="" className={styles.heroMascot} />
          </div>

          <span className={`${styles.heroDecoration} ${styles.heroHeart}`} aria-hidden="true">
            ♥
          </span>
          <span className={`${styles.heroDecoration} ${styles.heroStar}`} aria-hidden="true">
            ★
          </span>
          <span className={`${styles.heroDecoration} ${styles.heroMusic}`} aria-hidden="true">
            ♫
          </span>
          <span className={`${styles.heroSpark} ${styles.heroSparkOne}`} aria-hidden="true" />
          <span className={`${styles.heroSpark} ${styles.heroSparkTwo}`} aria-hidden="true" />
          <span className={`${styles.heroSpark} ${styles.heroSparkThree}`} aria-hidden="true" />
          <span className={styles.heroBook} aria-hidden="true">
            <span />
          </span>
        </section>

        <CatalogRow
          title="Continuar assistindo"
          subtitle={`de onde ${profile ? `${profile.name} parou` : 'você parou'}`}
        >
          {CONTINUE_WATCHING.map((item) => (
            <CatalogCard key={item.id} {...item} />
          ))}
        </CatalogRow>

        <CatalogRow
          title="Séries atuais"
          subtitle="episódios novos toda semana"
          viewAllHref={`/series${profile ? `?profile=${profile.id}` : ''}`}
        >
          {seriesLoading && <p className={styles.stateText}>Carregando séries...</p>}
          {!seriesLoading && seriesError && <p className={styles.stateText}>{seriesError}</p>}
          {!seriesLoading &&
            !seriesError &&
            series.map((title) => (
              <CatalogCard
                key={title.id}
                cover={title.poster}
                title={title.name}
                onClick={() =>
                  navigate(`/series/${title.id}${profile ? `?profile=${profile.id}` : ''}`)
                }
              />
            ))}
        </CatalogRow>

        <section className={styles.screenTimeCard}>
          <img src={ctaMascot} alt="" className={styles.screenTimeMascot} />
          <div className={styles.screenTimeText}>
            <h2 className={styles.screenTimeTitle}>Hora de descansar os olhos</h2>
            <p className={styles.screenTimeDescription}>
              Defina o limite diário de tela e escolha as faixas de idade liberadas para cada
              perfil.
            </p>
          </div>
          <button type="button" className={styles.screenTimeButton}>
            Abrir controles
          </button>
        </section>
      </div>
    </AppLayout>
  )
}

function CatalogRow({ title, subtitle, children, viewAllHref = '#top' }) {
  const scrollerRef = useRef(null)
  const [scrollState, setScrollState] = useState({ canGoBack: false, canGoForward: false })

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    function updateScrollState() {
      const edgeTolerance = 3
      setScrollState({
        canGoBack: scroller.scrollLeft > edgeTolerance,
        canGoForward:
          scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - edgeTolerance,
      })
    }

    const animationFrame = window.requestAnimationFrame(updateScrollState)
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(scroller)
    scroller.addEventListener('scroll', updateScrollState, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      scroller.removeEventListener('scroll', updateScrollState)
    }
  }, [children])

  function scroll(direction) {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      left: direction * Math.max(240, scroller.clientWidth * 0.72),
      behavior: 'smooth',
    })
  }

  return (
    <section className={styles.row}>
      <div className={styles.rowHeader}>
        <div>
          <h2 className={styles.rowTitle}>{title}</h2>
          <p className={styles.rowSubtitle}>{subtitle}</p>
        </div>
        <div className={styles.rowActions}>
          <Link to={viewAllHref} className={styles.rowLink}>
            Ver tudo →
          </Link>
          {(scrollState.canGoBack || scrollState.canGoForward) && (
            <div className={styles.rowNavigation}>
              <button
                type="button"
                onClick={() => scroll(-1)}
                disabled={!scrollState.canGoBack}
                aria-label={`Ver itens anteriores de ${title}`}
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={!scrollState.canGoForward}
                aria-label={`Ver próximos itens de ${title}`}
              >
                <ChevronRight size={19} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollerRef} className={styles.rowScroller}>
        {children}
      </div>
    </section>
  )
}
