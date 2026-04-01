import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const playlist = [
  { id: 1, title: 'NONONO', artist: 'Apink', url: './music/NONONO.mp3', cover: null },
]

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function MusicPlayer() {
  const { isMusicPlaying, setMusicPlaying, volume, setVolume, primaryColor } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  const currentTrack = playlist[currentIndex]

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isMusicPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [isMusicPlaying])

  const playNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIndex)
  }, [currentIndex])

  const playPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    setCurrentIndex(prevIndex)
  }, [currentIndex])

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = percent * duration
    setProgress(percent)
  }

  // 自动播放
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = currentTrack.url
    audio.volume = volume
    audio.load()
    audio.play().catch(() => {}) // 浏览器限制时静默失败
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 切歌时重新加载
  useEffect(() => {
    if (currentIndex === 0) return // 初始已处理
    const audio = audioRef.current
    if (!audio) return
    audio.src = currentTrack.url
    audio.load()
    if (isMusicPlaying) {
      audio.play().catch(() => {})
    }
    setProgress(0)
    setCurrentTime(0)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (duration) setProgress(audio.currentTime / duration)
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => playNext()
    const onWaiting = () => setIsLoading(true)
    const onCanPlay = () => setIsLoading(false)
    const onPlay = () => setMusicPlaying(true)
    const onPause = () => setMusicPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [duration, playNext, setMusicPlaying])

  // 同步音量
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      <motion.div
        className="fixed bottom-16 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* 展开的播放器面板 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-72 rounded-xl glass-dark overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="p-4">
                {/* 封面 */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isMusicPlaying ? 'animate-vinyl-spin' : ''
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 30%, #1a1a1a 70%)',
                      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(180deg, ${primaryColor}40 0%, #1a1a1a 100%)`,
                        border: '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {isLoading ? (
                        <span className="text-sm animate-pulse">⏳</span>
                      ) : (
                        <span className="text-sm">🎵</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{currentTrack.title}</p>
                    <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mb-3">
                  <div
                    ref={progressRef}
                    className="h-1.5 rounded-full overflow-hidden cursor-pointer group"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full rounded-full transition-all relative"
                      style={{
                        width: `${progress * 100}%`,
                        background: `linear-gradient(90deg, ${primaryColor}, #9C27B0)`,
                      }}
                    >
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: '#fff', boxShadow: `0 0 6px ${primaryColor}` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-white/40 text-xs">{formatTime(currentTime)}</span>
                    <span className="text-white/40 text-xs">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* 控制按钮 */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={playPrev}
                    className="text-white/60 hover:text-white transition-colors text-lg"
                  >
                    ⏮️
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)`,
                    }}
                  >
                    {isLoading ? '⏳' : isMusicPlaying ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={playNext}
                    className="text-white/60 hover:text-white transition-colors text-lg"
                  >
                    ⏭️
                  </button>
                </div>

                {/* 音量控制 */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-white/60 text-sm">
                    {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor} ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 迷你播放按钮 */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full glass-dark flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            borderColor: isMusicPlaying ? primaryColor : 'rgba(255,255,255,0.2)',
            boxShadow: isMusicPlaying ? `0 0 15px 2px ${primaryColor}50` : 'none',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">{isMusicPlaying ? '🎵' : '🎶'}</span>
        </motion.button>
      </motion.div>
    </>
  )
}

export default MusicPlayer
