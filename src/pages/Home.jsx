import { motion } from 'framer-motion'
import { useStore, siteConfig } from '../store/useStore'
import GlassCard from '../components/GlassCard'
import BirthdayCountdown from '../components/BirthdayCountdown'

function Home() {
  const { primaryColor } = useStore()

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero 区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-12"
        >
          {/* 头像 */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden glass-dark"
              style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                {siteConfig.avatar ? (
                  <img 
                    src={siteConfig.avatar} 
                    alt={siteConfig.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl opacity-50">🦊</span>
                )}
              </div>
            </motion.div>
          </div>

          {/* 信息 */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 gradient-text"
            >
              {siteConfig.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/70 text-lg md:text-xl mb-6"
            >
              {siteConfig.subtitle}
            </motion.p>

            {/* 社交链接 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {siteConfig.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl glass-dark glass-dark-hover transition-all duration-300 text-white/80 hover:text-white text-sm flex items-center gap-2"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = primaryColor
                    e.currentTarget.style.boxShadow = `0 0 15px 2px ${primaryColor}40`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span>{link.icon === 'douyin' ? '🎵' : link.icon === 'bilibili' ? '📺' : link.icon === 'weibo' ? '📝' : '📱'}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* 信息卡片区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <GlassCard className="p-6">
            <h2 className="text-white text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📋</span>
              基本信息
            </h2>
            <div className="space-y-3">
              {siteConfig.basicInfo.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-white/60 text-xs">{item.label}</div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 生日倒计时 */}
          <GlassCard className="p-6">
            <h2 className="text-white text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>🎂</span>
              生日倒计时
            </h2>
            <BirthdayCountdown />
          </GlassCard>
        </div>

        {/* 数据统计占位 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <h2 className="text-white text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📊</span>
              社交数据
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl glass-dark">
                <div className="text-2xl font-bold gradient-text">--</div>
                <div className="text-white/60 text-sm">粉丝数</div>
              </div>
              <div className="p-4 rounded-xl glass-dark">
                <div className="text-2xl font-bold gradient-text">--</div>
                <div className="text-white/60 text-sm">获赞数</div>
              </div>
              <div className="p-4 rounded-xl glass-dark">
                <div className="text-2xl font-bold gradient-text">--</div>
                <div className="text-white/60 text-sm">作品数</div>
              </div>
              <div className="p-4 rounded-xl glass-dark">
                <div className="text-2xl font-bold gradient-text">--</div>
                <div className="text-white/60 text-sm">播放量</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
