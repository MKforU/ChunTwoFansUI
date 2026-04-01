import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const navLinks = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/gallery', label: '图片库', icon: '🖼️' },
  { path: '/works', label: '作品', icon: '🎬' },
  { path: '/guestbook', label: '留言', icon: '💬' },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, primaryColor } = useStore()
  const [scrolled, setScrolled] = useState(false)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - 连续点击 5 次进入管理后台 */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="text-2xl">🦊</span>
            <span className="font-bold text-lg gradient-text">粉丝站</span>
          </div>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    color: isActive ? 'transparent' : 'rgba(255,255,255,0.8)',
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}40, transparent)`,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{link.icon}</span>
                    <span style={isActive ? {
                      background: `linear-gradient(135deg, ${primaryColor}, #9C27B0, #B71C1C)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    } : {}}>
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
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center transition-all duration-300 hover:scale-110"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = primaryColor
              e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}50`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* 移动端菜单 */}
          <div className="md:hidden flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  <span className="text-lg">{link.icon}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
