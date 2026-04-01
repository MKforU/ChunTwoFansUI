import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const navLinks = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/gallery', label: '图片库', icon: '🖼️' },
  { path: '/works', label: '作品', icon: '🎬' },
  { path: '/halloffame', label: '名人堂', icon: '🏆' },
  { path: '/guestbook', label: '留言', icon: '💬' },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, primaryColor } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 隐藏入口：连续点击 Logo 5 次 进入管理员登录
  const handleLogoClick = () => {
    clickCountRef.current += 1
    clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, 2000)
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0
      navigate('/admin')
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={theme === 'light' ? {
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
      } : {
        background: scrolled ? 'rgba(0,0,0,0.4)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - 连续点击 5 次进入管理后台 */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="text-2xl">🦊</span>
            <span className="font-bold text-lg" style={theme === 'light' ? { color: '#312e81' } : { background: `linear-gradient(135deg, ${primaryColor}, #9C27B0, #B71C1C)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>纯儿小屋</span>
          </div>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              const isLight = theme === 'light'
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    background: isActive
                      ? (isLight ? `linear-gradient(135deg, ${primaryColor}, #9C27B0)` : `linear-gradient(135deg, ${primaryColor}20, transparent)`)
                      : 'transparent',
                    border: isActive
                      ? (isLight ? 'none' : `1px solid ${primaryColor}30`)
                      : '1px solid transparent',
                    color: isActive && isLight ? '#fff' : (isLight ? '#312e81' : 'rgba(255,255,255,0.8)'),
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isLight ? 'rgba(233,30,99,0.06)' : 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-base">{link.icon}</span>
                    <span className="text-sm" style={isActive ? {
                      background: isLight ? 'none' : `linear-gradient(135deg, ${primaryColor}, #9C27B0, #B71C1C)`,
                      WebkitBackgroundClip: isLight ? 'unset' : 'text',
                      backgroundClip: isLight ? 'unset' : 'text',
                      color: isLight ? '#fff' : 'transparent',
                    } : undefined}>
                      {link.label}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={theme === 'light' ? {
              background: 'rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.1)',
            } : undefined}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = primaryColor
              e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}50`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
            style={theme === 'light' ? {
              background: 'rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.1)',
            } : {
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t pt-4"
            style={theme === 'light' ? {
              borderColor: 'rgba(0,0,0,0.1)',
            } : {
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {/* 导航链接 */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                const isLight = theme === 'light'
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                    style={{
                      background: isActive
                        ? (isLight ? `linear-gradient(135deg, ${primaryColor}, #9C27B0)` : `linear-gradient(135deg, ${primaryColor}20, transparent)`)
                        : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'),
                      border: isActive
                        ? (isLight ? 'none' : `1px solid ${primaryColor}30`)
                        : `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`,
                      color: isActive && isLight ? '#fff' : (isLight ? '#312e81' : 'rgba(255,255,255,0.8)'),
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-base">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* 主题切换按钮 */}
            <button
              onClick={() => {
                toggleTheme()
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-3 w-full px-4 py-3 mt-3 rounded-lg transition-all duration-300"
              style={theme === 'light' ? {
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#312e81',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="text-base">{theme === 'dark' ? '切换亮色' : '切换暗色'}</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
