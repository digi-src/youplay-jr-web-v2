import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { fetchTitle } from '../../api/titles'
import { StreamingPlayer } from '../../components/StreamingPlayer/StreamingPlayer'
import styles from './WatchPage.module.css'

export function WatchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const seriesIdFromUrl = searchParams.get('series')
  const profileId = searchParams.get('profile')

  const [episode, setEpisode] = useState(null)
  const [series, setSeries] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPlayerData() {
      setLoading(true)
      setError('')

      try {
        const episodeData = await fetchTitle(id)
        const parentId = seriesIdFromUrl || episodeData.parId
        const seriesData = parentId ? await fetchTitle(parentId) : null

        if (!cancelled) {
          setEpisode(episodeData)
          setSeries(seriesData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Não foi possível carregar este episódio.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPlayerData()

    return () => {
      cancelled = true
    }
  }, [id, seriesIdFromUrl])

  const episodes = useMemo(
    () =>
      [...(series?.episodes ?? [])].sort((a, b) => (a.epiId ?? 0) - (b.epiId ?? 0)),
    [series],
  )

  function watchEpisode(episodeId) {
    const params = new URLSearchParams()
    const parentId = series?.id || seriesIdFromUrl || episode?.parId

    if (parentId) params.set('series', parentId)
    if (profileId) params.set('profile', profileId)

    navigate(`/watch/${episodeId}?${params.toString()}`)
  }

  function goBack() {
    const parentId = series?.id || seriesIdFromUrl || episode?.parId

    if (parentId) {
      navigate(`/series/${parentId}${profileId ? `?profile=${profileId}` : ''}`)
      return
    }

    navigate(-1)
  }

  if (loading) {
    return (
      <div className={styles.statePage}>
        <LoaderCircle className={styles.spinner} size={38} aria-hidden="true" />
        <p>Preparando seu episódio...</p>
      </div>
    )
  }

  if (error || !episode) {
    return (
      <div className={styles.statePage}>
        <h1>Não foi possível abrir o player</h1>
        <p>{error}</p>
        <button type="button" onClick={goBack}>
          Voltar para a série
        </button>
      </div>
    )
  }

  return (
    <StreamingPlayer
      key={episode.id}
      episode={episode}
      series={series}
      episodes={episodes}
      onBack={goBack}
      onSelectEpisode={watchEpisode}
    />
  )
}
