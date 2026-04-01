import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

// 管理员账号密码
const ADMIN_USERNAME = 'chuner'
const ADMIN_PASSWORD = 'Lovechuner'
const STORAGE_KEY = 'adminLoggedIn'

function AdminLogin() {
  const navigate = useNavigate()
  const { primaryColor } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 检查是否已登录
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 600))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true')
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('账号或密码错误')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold gradient-text mb-2">系统登录</h1>
          <p className="text-white/40 text-sm">请输入凭证以继续</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/70 text-sm mb-2">账号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-white/30 focus:outline-none transition-all duration-300"
              placeholder="请输入账号"
              autoComplete="off"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor
                e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}30`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-white/30 focus:outline-none transition-all duration-300"
              placeholder="请输入密码"
              autoComplete="off"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor
                e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}30`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-40 hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)`
            }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                验证中...
              </span>
            ) : '进入'}
          </button>
        </form>

        {/* 返回 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white/30 hover:text-white/50 text-sm transition-colors"
          >
            返回首页
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin