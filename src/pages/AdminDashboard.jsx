import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const STORAGE_KEY = 'adminLoggedIn'
const SITE_DATA_KEY = 'fansite-site-data'
const GALLERY_KEY = 'fansite-gallery-data'
const WORKS_KEY = 'fansite-works-data'
const MESSAGES_KEY = 'fansite-guestbook-messages'
const HOF_KEY = 'fansite-halloffame'

const defaultSiteData = {
  name: '{{昵称}}',
  subtitle: '{{简介描述}}',
  avatar: '/avatar.jpg',
  basicInfo: [
    { emoji: '🎂', label: '生日', value: '{{生日信息}}' },
    { emoji: '📏', label: '身高', value: '{{身高信息}}' },
    { emoji: '💼', label: '职业', value: '{{职业信息}}' },
    { emoji: '📍', label: '所在地', value: '{{所在地}}' },
  ],
  socialLinks: [
    { name: '抖音', url: '#', icon: 'douyin' },
    { name: 'B站', url: '#', icon: 'bilibili' },
    { name: '微博', url: '#', icon: 'weibo' },
    { name: '小红书', url: '#', icon: 'xiaohongshu' },
  ],
  birthday: { month: 1, day: 1 }
}

const emojiOptions = ['🎂', '📏', '💼', '📍', '⭐', '🎵', '🎮', '📚', '💬', '🌍', '❤️', '🐱', '🎨', '📸', '🌈']

function loadData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch { return defaultValue }
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { primaryColor } = useStore()
  const [activeTab, setActiveTab] = useState('site')

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const [siteData, setSiteData] = useState(() => loadData(SITE_DATA_KEY, defaultSiteData))
  const [galleryData, setGalleryData] = useState(() => loadData(GALLERY_KEY, []))
  const [worksData, setWorksData] = useState(() => loadData(WORKS_KEY, []))
  const [messagesData, setMessagesData] = useState(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [hofData, setHofData] = useState(() => {
    try {
      const saved = localStorage.getItem(HOF_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [toast, setToast] = useState(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newWork, setNewWork] = useState({ title: '', description: '', cover: '', url: '', tags: '' })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    navigate('/')
  }

  // ============ 站点信息 ============
  const handleSiteSave = () => {
    saveData(SITE_DATA_KEY, siteData)
    showToast('✅ 站点信息已保存')
  }

  // 详细信息 增删
  const addBasicInfo = () => {
    setSiteData({ ...siteData, basicInfo: [...siteData.basicInfo, { emoji: '⭐', label: '', value: '' }] })
  }
  const removeBasicInfo = (index) => {
    setSiteData({ ...siteData, basicInfo: siteData.basicInfo.filter((_, i) => i !== index) })
  }
  const updateBasicInfo = (index, field, value) => {
    const updated = [...siteData.basicInfo]
    updated[index] = { ...updated[index], [field]: value }
    setSiteData({ ...siteData, basicInfo: updated })
  }

  // 社交链接 增删
  const addSocialLink = () => {
    setSiteData({ ...siteData, socialLinks: [...siteData.socialLinks, { name: '', url: '#', icon: '🔗' }] })
  }
  const removeSocialLink = (index) => {
    setSiteData({ ...siteData, socialLinks: siteData.socialLinks.filter((_, i) => i !== index) })
  }
  const updateSocialLink = (index, field, value) => {
    const updated = [...siteData.socialLinks]
    updated[index] = { ...updated[index], [field]: value }
    setSiteData({ ...siteData, socialLinks: updated })
  }

  // ============ 图片库 ============
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return
    const updated = [...galleryData, { id: Date.now(), src: newImageUrl.trim(), alt: '图片' }]
    setGalleryData(updated)
    saveData(GALLERY_KEY, updated)
    setNewImageUrl('')
    showToast('✅ 图片已添加')
  }
  const handleDeleteImage = (id) => {
    const updated = galleryData.filter(img => img.id !== id)
    setGalleryData(updated)
    saveData(GALLERY_KEY, updated)
    showToast('✅ 图片已删除')
  }

  // ============ 作品 ============
  const handleAddWork = () => {
    if (!newWork.title.trim()) return
    const work = {
      id: Date.now(),
      title: newWork.title.trim(),
      description: newWork.description.trim(),
      cover: newWork.cover.trim() || `https://picsum.photos/400/300?random=${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tags: newWork.tags.split(',').map(t => t.trim()).filter(Boolean),
      url: newWork.url.trim() || '#'
    }
    const updated = [...worksData, work]
    setWorksData(updated)
    saveData(WORKS_KEY, updated)
    setNewWork({ title: '', description: '', cover: '', url: '', tags: '' })
    showToast('✅ 作品已添加')
  }
  const handleDeleteWork = (id) => {
    const updated = worksData.filter(w => w.id !== id)
    setWorksData(updated)
    saveData(WORKS_KEY, updated)
    showToast('✅ 作品已删除')
  }

  // ============ 留言审核 ============
  const handleApproveMessage = (id) => {
    const updated = messagesData.map(m => m.id === id ? { ...m, approved: true } : m)
    setMessagesData(updated)
    saveData(MESSAGES_KEY, updated)
    showToast('✅ 留言已审核通过')
  }
  const handleDeleteMessage = (id) => {
    const updated = messagesData.filter(m => m.id !== id)
    setMessagesData(updated)
    saveData(MESSAGES_KEY, updated)
    showToast('✅ 留言已删除')
  }
  const handleApproveAll = () => {
    const updated = messagesData.map(m => ({ ...m, approved: true }))
    setMessagesData(updated)
    saveData(MESSAGES_KEY, updated)
    showToast('✅ 已全部审核通过')
  }

  // ============ 名人堂 ============
  const hofApprove = (id) => {
    const updated = hofData.map(m => m.id === id ? { ...m, approved: true } : m)
    setHofData(updated)
    saveData(HOF_KEY, updated)
    showToast('✅ 已通过')
  }
  const hofDelete = (id) => {
    const updated = hofData.filter(m => m.id !== id)
    setHofData(updated)
    saveData(HOF_KEY, updated)
    showToast('✅ 已删除')
  }
  const hofUpdateField = (id, field, value) => {
    const updated = hofData.map(m => m.id === id ? { ...m, [field]: value } : m)
    setHofData(updated)
    saveData(HOF_KEY, updated)
  }
  const hofApproveAll = () => {
    const updated = hofData.map(m => ({ ...m, approved: true }))
    setHofData(updated)
    saveData(HOF_KEY, updated)
    showToast('✅ 已全部通过')
  }

  const pendingHof = hofData.filter(m => !m.approved)
  const approvedHof = hofData.filter(m => m.approved).sort((a, b) => (a.order || 999) - (b.order || 999))

  const pendingMessages = messagesData.filter(m => !m.approved)
  const approvedMessages = messagesData.filter(m => m.approved)

  // 样式
  const inputClass = "w-full px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300"
  const inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }
  const smallInputClass = "px-3 py-2 rounded-lg text-white text-sm focus:outline-none"
  const smallInputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }

  const tabs = [
    { id: 'site', label: '站点信息', icon: '🏠' },
    { id: 'gallery', label: '图片库', icon: '🖼️' },
    { id: 'works', label: '作品管理', icon: '🎬' },
    { id: 'messages', label: '留言审核', icon: '💬', badge: pendingMessages.length },
    { id: 'halloffame', label: '名人堂', icon: '🏆', badge: pendingHof.length },
  ]

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

      <div className="max-w-5xl mx-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold gradient-text">管理后台</h1>
            <p className="text-white/40 text-sm mt-1">管理网站内容</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="px-4 py-2 rounded-xl glass-dark text-white/60 hover:text-white text-sm transition-all">
              ← 返回首页
            </button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-red-400/70 hover:text-red-400 text-sm transition-all">
              退出登录
            </button>
          </div>
        </div>

        {/* Tab 导航 */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2 transition-all duration-300"
              style={{
                background: activeTab === tab.id ? `linear-gradient(135deg, ${primaryColor}30, transparent)` : 'transparent',
                borderColor: activeTab === tab.id ? primaryColor : 'rgba(255,255,255,0.15)',
                borderWidth: '1px',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs text-white"
                  style={{ background: '#E91E63' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ====== 站点信息 ====== */}
        {activeTab === 'site' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* 基本信息 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">📋 基本信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">昵称</label>
                  <input style={inputStyle} className={inputClass}
                    value={siteData.name}
                    onChange={e => setSiteData({ ...siteData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">简介</label>
                  <input style={inputStyle} className={inputClass}
                    value={siteData.subtitle}
                    onChange={e => setSiteData({ ...siteData, subtitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">头像链接</label>
                  <input style={inputStyle} className={inputClass}
                    value={siteData.avatar}
                    onChange={e => setSiteData({ ...siteData, avatar: e.target.value })}
                    placeholder="/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            {/* 详细信息 - 支持增删行 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">📝 详细信息</h2>
                <button
                  onClick={addBasicInfo}
                  className="px-3 py-1.5 rounded-lg text-xs text-white transition-all"
                  style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}60` }}
                >
                  + 添加一行
                </button>
              </div>
              {siteData.basicInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  {/* Emoji 选择 */}
                  <div className="relative group">
                    <button className="text-xl w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      {item.emoji}
                    </button>
                    <div className="absolute top-full left-0 mt-1 p-2 rounded-xl glass-dark opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10"
                      style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                      <div className="grid grid-cols-5 gap-1">
                        {emojiOptions.map(em => (
                          <button key={em} className="text-lg hover:scale-110 transition-transform"
                            onClick={() => updateBasicInfo(i, 'emoji', em)}>
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <input style={smallInputStyle} className={`${smallInputClass} w-24`}
                    value={item.label}
                    onChange={e => updateBasicInfo(i, 'label', e.target.value)}
                    placeholder="标签"
                  />
                  <input style={smallInputStyle} className={`${smallInputClass} flex-1`}
                    value={item.value}
                    onChange={e => updateBasicInfo(i, 'value', e.target.value)}
                    placeholder="内容"
                  />
                  <button
                    onClick={() => removeBasicInfo(i)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* 社交链接 - 支持增删行 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">🔗 社交链接</h2>
                <button
                  onClick={addSocialLink}
                  className="px-3 py-1.5 rounded-lg text-xs text-white transition-all"
                  style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}60` }}
                >
                  + 添加链接
                </button>
              </div>
              {siteData.socialLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <input style={smallInputStyle} className={`${smallInputClass} w-24`}
                    value={link.name}
                    onChange={e => updateSocialLink(i, 'name', e.target.value)}
                    placeholder="名称"
                  />
                  <input style={smallInputStyle} className={`${smallInputClass} flex-1`}
                    value={link.url}
                    placeholder="https://..."
                    onChange={e => updateSocialLink(i, 'url', e.target.value)}
                  />
                  <button
                    onClick={() => removeSocialLink(i)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* 生日 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">🎂 生日设置</h2>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">月份</label>
                  <input type="number" min="1" max="12" style={smallInputStyle} className={`${smallInputClass} w-24`}
                    value={siteData.birthday.month}
                    onChange={e => setSiteData({ ...siteData, birthday: { ...siteData.birthday, month: parseInt(e.target.value) || 1 } })}
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">日期</label>
                  <input type="number" min="1" max="31" style={smallInputStyle} className={`${smallInputClass} w-24`}
                    value={siteData.birthday.day}
                    onChange={e => setSiteData({ ...siteData, birthday: { ...siteData.birthday, day: parseInt(e.target.value) || 1 } })}
                  />
                </div>
              </div>
            </div>

            {/* 保存 */}
            <div className="flex justify-end">
              <button onClick={handleSiteSave}
                className="px-8 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}
              >
                保存所有信息
              </button>
            </div>
          </motion.div>
        )}

        {/* ====== 图片库 ====== */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-2xl glass-dark p-6 mb-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">➕ 添加图片</h2>
              <div className="flex gap-3">
                <input style={inputStyle} className="flex-1 px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none text-sm"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="输入图片 URL（https://...）"
                />
                <button onClick={handleAddImage} disabled={!newImageUrl.trim()}
                  className="px-6 py-2.5 rounded-xl text-white text-sm disabled:opacity-40 transition-all"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                  添加
                </button>
              </div>
            </div>
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">已有图片 ({galleryData.length})</h2>
              {galleryData.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">还没有添加图片</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryData.map(img => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden">
                      <img src={img.src} alt="" className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeleteImage(img.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs hover:bg-red-500 transition-colors">
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ====== 作品管理 ====== */}
        {activeTab === 'works' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-2xl glass-dark p-6 mb-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">➕ 添加作品</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-white/60 text-sm mb-1">标题 *</label>
                  <input style={inputStyle} className={inputClass}
                    value={newWork.title}
                    onChange={e => setNewWork({ ...newWork, title: e.target.value })}
                    placeholder="作品标题"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">描述</label>
                  <textarea style={inputStyle} className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none resize-none text-sm"
                    rows={2}
                    value={newWork.description}
                    onChange={e => setNewWork({ ...newWork, description: e.target.value })}
                    placeholder="作品描述"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-white/60 text-sm mb-1">封面 URL</label>
                    <input style={smallInputStyle} className="w-full px-3 py-2 rounded-lg text-white placeholder-white/30 focus:outline-none text-sm"
                      value={newWork.cover}
                      onChange={e => setNewWork({ ...newWork, cover: e.target.value })}
                      placeholder="留空自动生成"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-white/60 text-sm mb-1">链接 URL</label>
                    <input style={smallInputStyle} className="w-full px-3 py-2 rounded-lg text-white placeholder-white/30 focus:outline-none text-sm"
                      value={newWork.url}
                      onChange={e => setNewWork({ ...newWork, url: e.target.value })}
                      placeholder="作品链接"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">标签（逗号分隔）</label>
                  <input style={inputStyle} className="w-full px-3 py-2 rounded-lg text-white placeholder-white/30 focus:outline-none text-sm"
                    value={newWork.tags}
                    onChange={e => setNewWork({ ...newWork, tags: e.target.value })}
                    placeholder="短视频, 原创, 创意"
                  />
                </div>
                <div className="flex justify-end">
                  <button onClick={handleAddWork} disabled={!newWork.title.trim()}
                    className="px-6 py-2.5 rounded-xl text-white text-sm disabled:opacity-40 transition-all"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                    添加作品
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">已有作品 ({worksData.length})</h2>
              {worksData.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">还没有添加作品</p>
              ) : (
                <div className="space-y-3">
                  {worksData.map(work => (
                    <div key={work.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <img src={work.cover} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{work.title}</p>
                        <p className="text-white/40 text-xs truncate">{work.description}</p>
                        <div className="flex gap-1 mt-1">
                          {work.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-white/30 text-xs flex-shrink-0">{work.date}</span>
                      <button onClick={() => handleDeleteWork(work.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors flex-shrink-0">
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ====== 留言审核 ====== */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* 待审核 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  ⏳ 待审核 ({pendingMessages.length})
                </h2>
                {pendingMessages.length > 0 && (
                  <button onClick={handleApproveAll}
                    className="px-3 py-1.5 rounded-lg text-xs text-white transition-all"
                    style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}60` }}>
                    全部通过
                  </button>
                )}
              </div>
              {pendingMessages.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">没有待审核的留言 🎉</p>
              ) : (
                <div className="space-y-3">
                  {pendingMessages.map(msg => (
                    <div key={msg.id} className="p-4 rounded-xl" style={{ background: 'rgba(233,30,99,0.08)', border: '1px solid rgba(233,30,99,0.2)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: 'rgba(233,30,99,0.4)' }}>
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-medium">{msg.name}</span>
                            <span className="text-white/30 text-xs">{new Date(msg.timestamp).toLocaleString('zh-CN')}</span>
                          </div>
                          <p className="text-white/70 text-sm">{msg.content}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => handleApproveMessage(msg.id)}
                          className="px-4 py-1.5 rounded-lg text-xs text-white transition-all hover:opacity-80"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                          ✓ 通过
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id)}
                          className="px-4 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                          ✕ 删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 已通过 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">
                ✅ 已通过 ({approvedMessages.length})
              </h2>
              {approvedMessages.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">还没有已通过的留言</p>
              ) : (
                <div className="space-y-3">
                  {approvedMessages.map(msg => (
                    <div key={msg.id} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{msg.name}</span>
                          <span className="text-white/30 text-xs">{new Date(msg.timestamp).toLocaleString('zh-CN')}</span>
                          {msg.likes > 0 && <span className="text-white/30 text-xs">❤️ {msg.likes}</span>}
                        </div>
                        <p className="text-white/70 text-sm">{msg.content}</p>
                      </div>
                      <button onClick={() => handleDeleteMessage(msg.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors flex-shrink-0">
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ====== 名人堂管理 ====== */}
        {activeTab === 'halloffame' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* 待审核 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">⏳ 待审核 ({pendingHof.length})</h2>
                {pendingHof.length > 0 && (
                  <button onClick={hofApproveAll}
                    className="px-3 py-1.5 rounded-lg text-xs text-white transition-all"
                    style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}60` }}>
                    全部通过
                  </button>
                )}
              </div>
              {pendingHof.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">没有待审核的入驻申请 🎉</p>
              ) : (
                <div className="space-y-3">
                  {pendingHof.map(m => (
                    <div key={m.id} className="p-4 rounded-xl" style={{ background: 'rgba(233,30,99,0.08)', border: '1px solid rgba(233,30,99,0.2)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ background: m.avatar ? 'transparent' : `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                          {m.avatar ? (
                            <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-lg">{m.nickname.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium">{m.nickname}</div>
                          <div className="text-white/50 text-sm">🎵 {m.douyinName}</div>
                          {m.douyinUrl && <div className="text-white/30 text-xs truncate mt-1">🔗 {m.douyinUrl}</div>}
                          {m.avatar && <div className="text-white/30 text-xs truncate mt-0.5">📷 头像已设置</div>}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => hofApprove(m.id)}
                          className="px-4 py-1.5 rounded-lg text-xs text-white transition-all hover:opacity-80"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                          ✓ 通过
                        </button>
                        <button onClick={() => hofDelete(m.id)}
                          className="px-4 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                          ✕ 删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 已通过 */}
            <div className="rounded-2xl glass-dark p-6" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <h2 className="text-lg font-semibold text-white mb-4">✅ 已通过 ({approvedHof.length})</h2>
              {approvedHof.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">还没有成员</p>
              ) : (
                <div className="space-y-4">
                  {approvedHof.map((m, index) => (
                    <div key={m.id} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {/* 左侧信息 */}
                      <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: m.avatar ? 'transparent' : `linear-gradient(135deg, ${primaryColor}, #9C27B0)` }}>
                        {m.avatar ? (
                          <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-lg">{m.nickname.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* 昵称 */}
                        <div className="flex items-center gap-2">
                          <span className="text-white/50 text-xs w-16">昵称</span>
                          <input value={m.nickname}
                            onChange={e => hofUpdateField(m.id, 'nickname', e.target.value)}
                            className="flex-1 px-2 py-1 rounded text-white text-sm focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        </div>
                        {/* 抖音名 */}
                        <div className="flex items-center gap-2">
                          <span className="text-white/50 text-xs w-16">抖音名</span>
                          <input value={m.douyinName}
                            onChange={e => hofUpdateField(m.id, 'douyinName', e.target.value)}
                            className="flex-1 px-2 py-1 rounded text-white text-sm focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        </div>
                        {/* 抖音链接 */}
                        <div className="flex items-center gap-2">
                          <span className="text-white/50 text-xs w-16">主页链接</span>
                          <input value={m.douyinUrl || ''}
                            onChange={e => hofUpdateField(m.id, 'douyinUrl', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-2 py-1 rounded text-white text-sm focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        </div>
                        {/* 头像链接 */}
                        <div className="flex items-center gap-2">
                          <span className="text-white/50 text-xs w-16">头像</span>
                          <input value={m.avatar || ''}
                            onChange={e => hofUpdateField(m.id, 'avatar', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-2 py-1 rounded text-white text-sm focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        </div>
                        {/* 控制选项 */}
                        <div className="flex items-center gap-4 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={m.showDouyinUrl || false}
                              onChange={e => hofUpdateField(m.id, 'showDouyinUrl', e.target.checked)}
                              className="w-4 h-4 rounded" />
                            <span className="text-white/70">允许外显抖音主页</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-white/50 text-xs">排序</span>
                            <input type="number" min={1} max={999} value={m.order || ''}
                              onChange={e => hofUpdateField(m.id, 'order', parseInt(e.target.value) || 999)}
                              className="w-16 px-2 py-1 rounded text-white text-sm focus:outline-none text-center"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                          <span className="text-white/20 text-xs">#{index + 1}</span>
                        </div>
                      </div>
                      {/* 删除 */}
                      <button onClick={() => hofDelete(m.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors flex-shrink-0">
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard