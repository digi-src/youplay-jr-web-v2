import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import {
  ArrowLeft,
  Expand,
  ListVideo,
  LoaderCircle,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import styles from './StreamingPlayer.module.css'

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'

  const totalSeconds = Math.floor(value)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function getPlaybackSource(source) {
  if (!source || !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)) {
    return source
  }

  try {
    const url = new URL(source)
    const sourceType =
      url.hostname === 'stream.youplay.com.br'
        ? 'stream'
        : url.hostname === 'media.youplay.com.br'
          ? 'media'
          : null

    return sourceType ? `/__hls_proxy__/${sourceType}${url.pathname}${url.search}` : source
  } catch {
    return source
  }
}

export function StreamingPlayer({ episode, series, episodes, onBack, onSelectEpisode }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const controlsTimerRef = useRef(null)
  const networkRetriesRef = useRef(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [playerError, setPlayerError] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [episodePanelOpen, setEpisodePanelOpen] = useState(false)
  const [nextCountdown, setNextCountdown] = useState(null)

  const source = episode.url || episode.src || ''
  const playbackSource = getPlaybackSource(source)
  const sourceError = source ? '' : 'Este episódio ainda não possui um vídeo disponível.'
  const visibleError = playerError || sourceError
  const currentIndex = episodes.findIndex((item) => String(item.id) === String(episode.id))
  const nextEpisode = currentIndex >= 0 ? episodes[currentIndex + 1] : null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumeProgress = isMuted ? 0 : volume * 100

  const revealControls = useCallback(() => {
    setControlsVisible(true)
    window.clearTimeout(controlsTimerRef.current)

    if (videoRef.current && !videoRef.current.paused && !episodePanelOpen) {
      controlsTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3200)
    }
  }, [episodePanelOpen])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video || visibleError) return

    if (video.paused) {
      video.play().catch(() => setPlayerError('O navegador bloqueou a reprodução do vídeo.'))
    } else {
      video.pause()
    }
  }, [visibleError])

  const skip = useCallback((seconds) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds))
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
  }, [])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      container.requestFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!source) {
      return undefined
    }

    let hls = null
    const directVideo = /\.(mp4|webm|ogg)(?:$|\?)/i.test(playbackSource)
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl')

    if (!directVideo && !nativeHls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        backBufferLength: 60,
      })
      hls.loadSource(playbackSource)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        networkRetriesRef.current = 0
        setIsLoading(false)
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.FRAG_LOADED, () => {
        networkRetriesRef.current = 0
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetriesRef.current < 2) {
          networkRetriesRef.current += 1
          hls.startLoad()
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError()
        } else {
          setIsLoading(false)
          setPlayerError(
            data.type === Hls.ErrorTypes.NETWORK_ERROR
              ? 'O servidor de vídeo não respondeu. Tente novamente em alguns instantes.'
              : 'Não foi possível reproduzir este vídeo.',
          )
          hls.destroy()
        }
      })
    } else {
      video.src = playbackSource
      video.load()
      video.play().catch(() => {})
    }

    return () => {
      hls?.destroy()
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [episode.id, playbackSource, source])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.target instanceof HTMLInputElement) return

      if (event.code === 'Space') {
        event.preventDefault()
        togglePlay()
      } else if (event.key === 'ArrowLeft') {
        skip(-10)
      } else if (event.key === 'ArrowRight') {
        skip(10)
      } else if (event.key.toLowerCase() === 'm') {
        toggleMute()
      } else if (event.key.toLowerCase() === 'f') {
        toggleFullscreen()
      } else if (event.key === 'Escape' && episodePanelOpen) {
        setEpisodePanelOpen(false)
      }

      revealControls()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [episodePanelOpen, revealControls, skip, toggleFullscreen, toggleMute, togglePlay])

  useEffect(() => {
    if (nextCountdown === null) return undefined

    if (nextCountdown === 0) {
      if (nextEpisode) onSelectEpisode(nextEpisode.id)
      return undefined
    }

    const timer = window.setTimeout(() => setNextCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [nextCountdown, nextEpisode, onSelectEpisode])

  useEffect(
    () => () => {
      window.clearTimeout(controlsTimerRef.current)
    },
    [],
  )

  const episodeItems = useMemo(
    () =>
      episodes.map((item, index) => ({
        ...item,
        displayNumber: item.epiId ?? index + 1,
        isCurrent: String(item.id) === String(episode.id),
      })),
    [episode.id, episodes],
  )

  function handleVolumeChange(event) {
    const video = videoRef.current
    if (!video) return

    const nextVolume = Number(event.target.value)
    video.volume = nextVolume
    video.muted = nextVolume === 0
  }

  function handleSeek(event) {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Number(event.target.value)
    setCurrentTime(video.currentTime)
  }

  function handleEnded() {
    setIsPlaying(false)
    setControlsVisible(true)

    if (nextEpisode) {
      setNextCountdown(8)
    } else {
      setEpisodePanelOpen(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className={styles.player}
      onMouseMove={revealControls}
      onPointerDown={revealControls}
      onMouseLeave={() => isPlaying && !episodePanelOpen && setControlsVisible(false)}
    >
      <video
        ref={videoRef}
        className={styles.video}
        poster={episode.poster || ''}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => {
          setIsPlaying(true)
          revealControls()
        }}
        onPause={() => {
          setIsPlaying(false)
          setControlsVisible(true)
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume)
          setIsMuted(event.currentTarget.muted)
        }}
        onEnded={handleEnded}
      />

      <div className={styles.videoShade} aria-hidden="true" />

      {isLoading && !visibleError && (
        <div className={styles.loading}>
          <LoaderCircle size={44} aria-hidden="true" />
        </div>
      )}

      {visibleError && (
        <div className={styles.errorOverlay}>
          <h2>Ops, o vídeo não abriu</h2>
          <p>{visibleError}</p>
          <button type="button" onClick={onBack}>
            Voltar para a série
          </button>
        </div>
      )}

      {!isPlaying && !isLoading && !visibleError && nextCountdown === null && (
        <button type="button" className={styles.centerPlay} onClick={togglePlay} aria-label="Reproduzir">
          <Play size={38} fill="currentColor" aria-hidden="true" />
        </button>
      )}

      <div
        className={`${styles.playerChrome} ${controlsVisible || !isPlaying || episodePanelOpen ? styles.playerChromeVisible : ''}`}
      >
        <header className={styles.topBar}>
          <button type="button" className={styles.iconButton} onClick={onBack} aria-label="Voltar">
            <ArrowLeft size={25} />
          </button>
          <div className={styles.titleBlock}>
            <span>{series?.name || 'YouPlay Jr.'}</span>
            <strong>
              Episódio {episode.epiId ?? currentIndex + 1} · {episode.name}
            </strong>
          </div>
        </header>

        <div className={styles.bottomBar}>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            className={styles.progressRange}
            style={{ '--range-progress': `${progress}%` }}
            aria-label="Progresso do vídeo"
          />

          <div className={styles.controlsRow}>
            <div className={styles.controlsGroup}>
              <button type="button" className={styles.iconButton} onClick={togglePlay} aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}>
                {isPlaying ? <Pause size={27} fill="currentColor" /> : <Play size={27} fill="currentColor" />}
              </button>
              <button type="button" className={styles.iconButton} onClick={() => skip(-10)} aria-label="Voltar 10 segundos">
                <RotateCcw size={23} />
                <span className={styles.skipLabel}>10</span>
              </button>
              <button type="button" className={styles.iconButton} onClick={() => skip(10)} aria-label="Avançar 10 segundos">
                <RotateCw size={23} />
                <span className={styles.skipLabel}>10</span>
              </button>
              <div className={styles.volumeControl}>
                <button type="button" className={styles.iconButton} onClick={toggleMute} aria-label={isMuted ? 'Ativar som' : 'Silenciar'}>
                  {isMuted || volume === 0 ? <VolumeX size={25} /> : <Volume2 size={25} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeRange}
                  style={{ '--range-progress': `${volumeProgress}%` }}
                  aria-label="Volume"
                />
              </div>
              <span className={styles.timeLabel}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className={styles.controlsGroup}>
              <button
                type="button"
                className={`${styles.episodesButton} ${episodePanelOpen ? styles.episodesButtonActive : ''}`}
                onClick={() => setEpisodePanelOpen((open) => !open)}
              >
                <ListVideo size={22} />
                <span>Próximos episódios</span>
              </button>
              <button type="button" className={styles.iconButton} onClick={toggleFullscreen} aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}>
                {isFullscreen ? <Minimize size={25} /> : <Expand size={25} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className={`${styles.episodePanel} ${episodePanelOpen ? styles.episodePanelOpen : ''}`}>
        <div className={styles.panelHeader}>
          <div>
            <span>{series?.name || 'Série'}</span>
            <h2>Próximos episódios</h2>
          </div>
          <button type="button" className={styles.iconButton} onClick={() => setEpisodePanelOpen(false)} aria-label="Fechar lista">
            <X size={24} />
          </button>
        </div>

        <div className={styles.episodePanelList}>
          {episodeItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.panelEpisode} ${item.isCurrent ? styles.panelEpisodeCurrent : ''}`}
              onClick={() => !item.isCurrent && onSelectEpisode(item.id)}
              disabled={item.isCurrent}
            >
              <div className={styles.panelThumb}>
                {item.poster ? <img src={item.poster} alt="" loading="lazy" /> : <span>{item.displayNumber}</span>}
                {!item.isCurrent && <Play size={18} fill="currentColor" aria-hidden="true" />}
              </div>
              <div className={styles.panelEpisodeInfo}>
                <span>{item.isCurrent ? 'Assistindo agora' : `Episódio ${item.displayNumber}`}</span>
                <strong>{item.name}</strong>
                {item.runtime > 0 && <small>{item.runtime} min</small>}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {nextCountdown !== null && nextEpisode && (
        <div className={styles.nextOverlay}>
          <span>A seguir</span>
          <h2>{nextEpisode.name}</h2>
          <p>Começando em {nextCountdown}s</p>
          <div className={styles.nextActions}>
            <button type="button" className={styles.nextPrimary} onClick={() => onSelectEpisode(nextEpisode.id)}>
              Assistir agora
            </button>
            <button type="button" className={styles.nextSecondary} onClick={() => setNextCountdown(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
