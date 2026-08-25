import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search, Tv } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { CatalogCard } from '../../components/CatalogCard/CatalogCard'
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu'
import { fetchTitles } from '../../api/titles'
import { getProfile } from '../../api/profiles'
import { CATID_SERIES } from '../../constants/catalog'
import styles from './SeriesPage.module.css'

export function SeriesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const profile = getProfile(searchParams.get('profile'))
  const [query, setQuery] = useState('')
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchTitles(CATID_SERIES)
      .then((data) => {
        if (!cancelled) setSeries(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredSeries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    if (!normalizedQuery) return series

    return series.filter((item) =>
      `${item.name || ''} ${item.info || ''}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
    )
  }, [query, series])

  const profileSuffix = profile ? `?profile=${profile.id}` : ''

  return (
    <AppLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(`/home${profileSuffix}`)}
          >
            <ArrowLeft size={19} />
            Início
          </button>
          <ProfileMenu />
        </header>

        <main className={styles.content}>
          <section className={styles.intro}>
            <div className={styles.introIcon}>
              <Tv size={28} aria-hidden="true" />
            </div>
            <div>
              <span>Catálogo YouPlay Jr.</span>
              <h1>Séries atuais</h1>
              <p>Descubra todas as séries disponíveis e escolha a próxima aventura.</p>
            </div>
          </section>

          <section className={styles.toolbar} aria-label="Ferramentas do catálogo">
            <label className={styles.searchBox}>
              <Search size={19} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar uma série"
              />
            </label>
            <span className={styles.resultCount}>
              {loading
                ? 'Carregando catálogo...'
                : `${filteredSeries.length} ${filteredSeries.length === 1 ? 'série encontrada' : 'séries encontradas'}`}
            </span>
          </section>

          {loading && (
            <div className={styles.grid} aria-label="Carregando séries">
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <div />
                  <span />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className={styles.stateCard}>
              <h2>Não foi possível carregar as séries</h2>
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && filteredSeries.length === 0 && (
            <div className={styles.stateCard}>
              <h2>Nenhuma série encontrada</h2>
              <p>Tente buscar com outro nome.</p>
              <button type="button" onClick={() => setQuery('')}>
                Limpar busca
              </button>
            </div>
          )}

          {!loading && !error && filteredSeries.length > 0 && (
            <div className={styles.grid}>
              {filteredSeries.map((title) => (
                <CatalogCard
                  key={title.id}
                  cover={title.poster}
                  title={title.name}
                  subtitle={title.year || undefined}
                  onClick={() => navigate(`/series/${title.id}${profileSuffix}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  )
}
