import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import GlassCard from '../components/GlassCard'

// 本地存储的留言 key
const MESSAGES_KEY = 'fansite-guestbook-messages'

function Guestbook() {
  const { primaryColor } = useStore()
  const [messages, setMessages] = useState([])
  const [newName, setNewName] = useState('')
  const [newContent, setNewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 加载留言
  useEffect(() => {
    const saved = localStorage.getItem(MESSAGES_KEY)
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse messages:', e)
      }
    }
  }, [])

  // 只显示已审核通过的留言
  const visibleMessages = messages.filter(m => m.approved)
  const totalCount = messages.length

  // 保存留言
  const saveMessages = (msgs) => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs))
    setMessages(msgs)
  }

  // 提交留言
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newName.trim() || !newContent.trim()) return

    setIsSubmitting(true)

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    const newMessage = {
      id: Date.now(),
      name: newName.trim(),
      content: newContent.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      approved: false  // 新留言默认待审核
    }

    saveMessages([newMessage, ...messages])
    setNewName('')
    setNewContent('')
    setIsSubmitting(false)
  }

  // 点赞
  const handleLike = (id) => {
    const updated = messages.map(msg => 
      msg.id === id ? { ...msg, likes: (msg.likes || 0) + 1 } : msg
    )
    saveMessages(updated)
  }

  // 删除留言
  const handleDelete = (id) => {
    if (window.confirm('确定要删除这条留言吗？')) {
      saveMessages(messages.filter(msg => msg.id !== id))
    }
  }

  // 格式化时间
  const formatTime = (iso) => {
    const date = new Date(iso)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen px-4 py-8 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">留言板</h1>
          <p className="text-white/60">留下你的足迹吧～</p>
          <p className="text-white/30 text-xs mt-1">留言需管理员审核通过后才会显示</p>
        </motion.div>

        {/* 统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: '总留言', value: totalCount, icon: '📝' },
            { label: '已通过', value: visibleMessages.length, icon: '✅' },
            { label: '总点赞', value: visibleMessages.reduce((sum, m) => sum + (m.likes || 0), 0), icon: '❤️' }
          ].map((stat, i) => (
            <GlassCard key={i} className="p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        {/* 留言表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="你的名字"
                  maxLength={50}
                  className="flex-1 px-4 py-3 rounded-xl glass-dark text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    '--tw-ring-color': `${primaryColor}40`
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primaryColor
                    e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}30`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newName.trim() || !newContent.trim()}
                  className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)`
                  }}
                >
                  {isSubmitting ? '发送中...' : '发送'}
                </button>
              </div>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="写下你想说的话..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  '--tw-ring-color': `${primaryColor}40`
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primaryColor
                  e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}30`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <div className="text-right text-white/40 text-sm">
                {newContent.length}/500
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* 留言列表 */}
        <div className="space-y-4">
          {visibleMessages.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-white/60">还没有留言，来写下第一条吧～</p>
            </GlassCard>
          ) : (
            visibleMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}
                      >
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{msg.name}</div>
                        <div className="text-white/50 text-sm">{formatTime(msg.timestamp)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-white/40 hover:text-red-400 transition-colors text-sm"
                    >
                      删除
                    </button>
                  </div>
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => handleLike(msg.id)}
                      className="flex items-center gap-1.5 text-white/60 hover:text-red-400 transition-colors text-sm"
                    >
                      <span>❤️</span>
                      <span>{msg.likes || 0}</span>
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>

        {/* Giscus 评论（可选，后期启用） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <GlassCard className="p-6 text-center">
            <p className="text-white/50 text-sm">
              💬 后期可接入 Giscus 实现更强大的评论功能
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Guestbook
