import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, siteConfig } from '../store/useStore'

function MusicPlayer() {
  const { isMusicPlaying, setMusicPlaying, volume, setVolume, primaryColor } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    title: '背景音乐',
    artist: '未知艺术家',
    cover: null
  })
  const audioRef = useRef(null)

  // 示例音乐列表（可替换为实际音乐）
  const playlist = [
    { id: 1, title: '歌曲一', artist: '艺术家', url: '/music/song1.mp3' },
    { id: 2, title: '歌曲二', artist: '艺术家', url: '/music/song2.mp3' },
  ]

  const togglePlay = () => {
    setMusicPlaying(!isMusicPlaying)
  }

  return (
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
                    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
                      border: '2px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {currentTrack.cover ? (
                      <img src={currentTrack.cover} alt="" className="w-full h-full rounded-full object-cover" />
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
                  className="h-1.5 rounded-full overflow-hidden cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: '30%',
                      background: `linear-gradient(90deg, ${primaryColor}, #9C27B0)`
                    }}
                  />
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center justify-center gap-4">
                <button className="text-white/60 hover:text-white transition-colors">⏮️</button>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)`,
                  }}
                >
                  {isMusicPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="text-white/60 hover:text-white transition-colors">⏭️</button>
              </div>

              {/* 音量控制 */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-white/60 text-sm">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${primaryColor} ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`
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
          boxShadow: isMusicPlaying ? `0 0 15px 2px ${primaryColor}50` : 'none'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = primaryColor
          e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}50`
        }}
        onMouseLeave={(e) => {
          if (!isMusicPlaying) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <span className="text-xl">{isMusicPlaying ? '🎵' : '🎶'}</span>
      </motion.button>
    </motion.div>
  )
}

export default MusicPlayer
