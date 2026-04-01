import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import GlassCard from '../components/GlassCard'

// 示例作品数据（可替换）
const sampleWorks = [
  {
    id: 1,
    title: '作品标题一',
    description: '这是作品的描述内容，可以介绍作品的背景、特色等信息。',
    cover: 'https://picsum.photos/400/300?random=1',
    date: '2026-01-15',
    tags: ['短视频', '创意'],
    url: '#'
  },
  {
    id: 2,
    title: '作品标题二',
    description: '另一个作品的描述信息。',
    cover: 'https://picsum.photos/400/300?random=2',
    date: '2026-02-20',
    tags: ['直播', '互动'],
    url: '#'
  },
  {
    id: 3,
    title: '作品标题三',
    description: '精彩作品的详细介绍。',
    cover: 'https://picsum.photos/400/300?random=3',
    date: '2026-03-10',
    tags: ['视频', '原创'],
    url: '#'
  },
]

function Works() {
  const { primaryColor } = useStore()

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">作品展示</h1>
          <p className="text-white/60">精选创作内容</p>
        </motion.div>

        {/* 作品列表 */}
        <div className="space-y-6">
          {sampleWorks.map((work, index) => (
            <motion.a
              key={work.id}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block"
            >
              <GlassCard className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* 封面 */}
                  <div className="md:w-64 flex-shrink-0">
                    <img
                      src={work.cover}
                      alt={work.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{work.title}</h3>
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <span>📅</span>
                          <span>{work.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {work.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: `${primaryColor}20`,
                            color: primaryColor,
                            border: `1px solid ${primaryColor}40`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 描述 */}
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                      {work.description}
                    </p>

                    {/* 查看按钮 */}
                    <div className="mt-4">
                      <span
                        className="inline-flex items-center gap-1 text-sm transition-colors"
                        style={{ color: primaryColor }}
                      >
                        查看详情 →
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.a>
          ))}
        </div>

        {/* 占位提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <GlassCard className="inline-block px-8 py-4">
            <p className="text-white/50 text-sm">
              💡 更多作品即将上线，敬请期待...
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Works
