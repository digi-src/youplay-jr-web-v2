import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Play, ChevronLeft } from 'lucide-react'
import { fetchTitle } from '../../api/titles'
import { AVATAR_COLORS } from '../../constants/profile'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu'
import styles from './SeriesDetailPage.module.css'

export function SeriesDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const profileId = searchParams.get('profile')
  const [tab, setTab] = useState('episodes')

  const [title, setTitle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchTitle(id)
      .then((data) => {
        if (!cancelled) setTitle(data)
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
  }, [id])

  const episodes = [...(title?.episodes ?? [])].sort((a, b) => (a.epiId ?? 0) - (b.epiId ?? 0))

  function watchEpisode(episodeId) {
    const params = new URLSearchParams({ series: id })
    if (profileId) params.set('profile', profileId)
    navigate(`/watch/${episodeId}?${params.toString()}`)
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Voltar
          </button>
          <ProfileMenu />
        </div>

        {loading && <p className={styles.stateText}>Carregando série...</p>}
        {!loading && error && <p className={styles.stateText}>{error}</p>}

        {!loading && !error && title && (
          <>
            <section className={styles.hero}>
              <div className={styles.heroDecorCircle} />
              <div className={styles.heroDecorCircleSmall} />

              <div className={styles.coverWrapper}>
                {title.poster ? (
                  <img src={title.poster} alt={title.name} className={styles.coverImage} />
                ) : (
                  <div className={styles.coverPlaceholder} />
                )}
              </div>

              <div className={styles.heroInfo}>
                <p className={styles.eyebrow}>
                  Série · {episodes.length} episódio{episodes.length === 1 ? '' : 's'}
                </p>
                <h1 className={styles.title}>{title.name}</h1>
                {title.info && <p className={styles.description}>{title.info}</p>}

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.watchButton}
                    onClick={() => episodes[0] && watchEpisode(episodes[0].id)}
                    disabled={episodes.length === 0}
                  >
                    <Play size={16} fill="currentColor" strokeWidth={0} /> Assistir
                  </button>
                  <button type="button" className={styles.listButton}>
                    + Minha lista
                  </button>
                </div>

                <div className={styles.tabs}>
                  <button
                    type="button"
                    className={`${styles.tab} ${tab === 'episodes' ? styles.tabActive : ''}`}
                    onClick={() => setTab('episodes')}
                  >
                    Episódios
                  </button>
                  <button
                    type="button"
                    className={`${styles.tab} ${tab === 'details' ? styles.tabActive : ''}`}
                    onClick={() => setTab('details')}
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            </section>

            <section className={styles.content}>
              <div className={styles.contentHeader}>
                <div>
                  <h2 className={styles.contentTitle}>
                    {tab === 'episodes' ? 'Todos os episódios' : 'Sobre a série'}
                  </h2>
                  <p className={styles.contentSubtitle}>
                    {tab === 'episodes'
                      ? `${episodes.length} ${episodes.length === 1 ? 'episódio disponível' : 'episódios disponíveis'}`
                      : 'Informações gerais'}
                  </p>
                </div>
              </div>

              {tab === 'episodes' ? (
                <div className={styles.episodeList}>
                  {episodes.length === 0 && (
                    <p className={styles.emptyState}>Nenhum episódio disponível ainda.</p>
                  )}
                  {episodes.map((episode, index) => (
                    <article key={episode.id} className={styles.episodeCard}>
                      <button
                        type="button"
                        className={styles.episodePreview}
                        style={{ '--episode-color': AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                        onClick={() => watchEpisode(episode.id)}
                        aria-label={`Assistir episódio ${episode.epiId}`}
                      >
                        <div className={styles.episodeFallback} aria-hidden="true">
                          {episode.epiId}
                        </div>
                        {episode.poster && (
                          <img
                            src={episode.poster}
                            alt={`Preview de ${episode.name}`}
                            className={styles.episodePreviewImage}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                        <span className={styles.episodeNumber}>Episódio {episode.epiId}</span>
                        <span className={styles.playButton} aria-hidden="true">
                          <Play size={19} fill="currentColor" strokeWidth={0} />
                        </span>
                      </button>
                      <div className={styles.episodeInfo}>
                        <span className={styles.episodeName}>{episode.name}</span>
                        <span className={styles.episodeMeta}>
                          {episode.runtime > 0 ? `${episode.runtime} min` : 'Pronto para assistir'}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.detailsGrid}>
                  <div className={styles.detailCard}>
                    <p className={styles.detailLabel}>Ano</p>
                    <p className={styles.detailValue}>{title.year ?? '—'}</p>
                  </div>
                  <div className={styles.detailCard}>
                    <p className={styles.detailLabel}>Total de episódios</p>
                    <p className={styles.detailValue}>{episodes.length}</p>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  )
}
