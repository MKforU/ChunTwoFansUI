import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const HOF_KEY = 'fansite-halloffame'

function loadData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch { return defaultValue }
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function HallOfFame() {
  const { primaryColor } = useStore()
  const [members, setMembers] = useState(() => loadData(HOF_KEY, []))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nickname: '', douyinName: '', douyinUrl: '', avatar: '', showDouyinUrl: false })
  const [toast, setToast] = useState('')

  // 只显示已审核通过的成员
  const visibleMembers = members
    .filter(m => m.approved)
    .sort((a, b) => (a.order || 999) - (b.order || 999))

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nickname.trim() || !form.douyinName.trim()) return

    const newMember = {
      id: Date.now(),
      nickname: form.nickname.trim(),
      douyinName: form.douyinName.trim(),
      douyinUrl: form.douyinUrl.trim(),
      avatar: form.avatar.trim(),
      showDouyinUrl: form.showDouyinUrl,
      approved: false,
      order: 999,
      createdAt: new Date().toISOString()
    }

    const updated = [...members, newMember]
    setMembers(updated)
    saveData(HOF_KEY, updated)
    setForm({ nickname: '', douyinName: '', douyinUrl: '', avatar: '', showDouyinUrl: false })
    setShowForm(false)
    showToast('🎉 申请已提交，等待管理员审核')
  }

  return (
    <div className="min-h-screen px-4 py-8 pb-32">
      {/* 提示 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl glass-dark text-white text-sm"
            style={{ borderColor: primaryColor }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">名人堂</h1>
          <p className="text-white/60">我们最棒的粉丝家人们 💖</p>
        </motion.div>

        {/* 成员展示 */}
        {visibleMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-white/40 text-lg">还没有成员入驻</p>
            <p className="text-white/30 text-sm mt-2">成为第一个加入的人吧！</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {visibleMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl glass-dark overflow-hidden text-center p-6 transition-all duration-300 hover:scale-[1.02]"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primaryColor
                  e.currentTarget.style.boxShadow = `0 0 25px 4px ${primaryColor}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* 头像 */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden"
                  style={{
                    background: member.avatar
                      ? 'transparent'
                      : `linear-gradient(135deg, ${primaryColor}, #9C27B0)`,
                    border: `2px solid ${primaryColor}50`
                  }}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {member.nickname.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* 昵称 */}
                <h3 className="text-white font-bold text-lg mb-1">{member.nickname}</h3>

                {/* 抖音名 */}
                <p className="text-white/60 text-sm mb-3 flex items-center justify-center gap-1">
                  <span>🎵</span> {member.douyinName}
                </p>

                {/* 抖音主页（仅管理员允许外显时显示） */}
                {member.showDouyinUrl && member.douyinUrl && (
                  <a
                    href={member.douyinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
                    style={{
                      background: `${primaryColor}20`,
                      color: primaryColor,
                      border: `1px solid ${primaryColor}40`
                    }}
                  >
                    <span>🔗</span> 访问主页
                  </a>
                )}

                {/* 序号徽章 */}
                <div className="mt-4">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.4)'
                    }}
                  >
                    #{index + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 加入按钮 */}
        {!showForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}
            >
              🏆 申请入驻
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">📝 申请入驻</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  ✕ 取消
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">昵称 *</label>
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={e => setForm({ ...form, nickname: e.target.value })}
                    placeholder="你想展示的昵称"
                    maxLength={20}
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1.5">抖音名字 *</label>
                  <input
                    type="text"
                    value={form.douyinName}
                    onChange={e => setForm({ ...form, douyinName: e.target.value })}
                    placeholder="你的抖音昵称"
                    maxLength={30}
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1.5">抖音主页链接</label>
                  <input
                    type="url"
                    value={form.douyinUrl}
                    onChange={e => setForm({ ...form, douyinUrl: e.target.value })}
                    placeholder="https://www.douyin.com/..."
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                  <p className="text-white/30 text-xs mt-1">需管理员审核后才可能对外展示</p>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showDouyinUrl}
                      onChange={e => setForm({ ...form, showDouyinUrl: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white/60 text-sm">允许对外展示我的抖音主页</span>
                  </label>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1.5">头像链接</label>
                  <input
                    type="url"
                    value={form.avatar}
                    onChange={e => setForm({ ...form, avatar: e.target.value })}
                    placeholder="https://... (留空使用默认头像)"
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                  <p className="text-white/30 text-xs mt-1">建议使用抖音头像链接</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!form.nickname.trim() || !form.douyinName.trim()}
                    className="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-40 hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}
                  >
                    提交申请
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default HallOfFame
