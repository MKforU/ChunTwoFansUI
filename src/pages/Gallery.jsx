import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import GlassCard from '../components/GlassCard'

// 图片数据结构 - 支持真实图片原始比例
// 使用时替换 src 为真实图片路径，浏览器会自动按原始比例渲染
const sampleImages = [
  // 示例：真实图片格式
  // { id: 1, src: '/images/photo1.jpg', alt: '描述' },
  // { id: 2, src: '/images/photo2.png', alt: '描述' },
  // 目前使用 picsum 随机图片占位（不同宽高比模拟真实图片）
  { id: 1, src: 'https://picsum.photos/400/600?random=1', alt: '图片 1' },    // 竖长
  { id: 2, src: 'https://picsum.photos/400/300?random=2', alt: '图片 2' },    // 横宽
  { id: 3, src: 'https://picsum.photos/400/400?random=3', alt: '图片 3' },    // 正方形
  { id: 4, src: 'https://picsum.photos/400/550?random=4', alt: '图片 4' },
  { id: 5, src: 'https://picsum.photos/400/350?random=5', alt: '图片 5' },
  { id: 6, src: 'https://picsum.photos/400/700?random=6', alt: '图片 6' },    // 很长的
  { id: 7, src: 'https://picsum.photos/400/280?random=7', alt: '图片 7' },
  { id: 8, src: 'https://picsum.photos/400/450?random=8', alt: '图片 8' },
  { id: 9, src: 'https://picsum.photos/400/380?random=9', alt: '图片 9' },
  { id: 10, src: 'https://picsum.photos/400/520?random=10', alt: '图片 10' },
  { id: 11, src: 'https://picsum.photos/400/320?random=11', alt: '图片 11' },
  { id: 12, src: 'https://picsum.photos/400/480?random=12', alt: '图片 12' },
  { id: 13, src: 'https://picsum.photos/400/360?random=13', alt: '图片 13' },
  { id: 14, src: 'https://picsum.photos/400/600?random=14', alt: '图片 14' },
  { id: 15, src: 'https://picsum.photos/400/290?random=15', alt: '图片 15' },
  { id: 16, src: 'https://picsum.photos/400/420?random=16', alt: '图片 16' },
]

function Gallery() {
  const { primaryColor, openImageViewer, closeImageViewer, isImageViewerOpen, images, currentImageIndex, setImageIndex } = useStore()
  const [filter, setFilter] = useState('all')

  const categories = [
    { id: 'all', label: '全部', icon: '🎨' },
    { id: 'photo', label: '照片', icon: '📷' },
    { id: 'fanart', label: '粉丝创作', icon: '🖼️' },
    { id: 'screenshot', label: '截图', icon: '🎬' },
  ]

  const handleImageClick = (index) => {
    openImageViewer(sampleImages, index)
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">图片库</h1>
          <p className="text-white/60">精选照片与粉丝创作</p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-8 flex-wrap"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                filter === cat.id ? 'glass-dark' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                borderColor: filter === cat.id ? primaryColor : 'rgba(255,255,255,0.2)',
                background: filter === cat.id ? `linear-gradient(135deg, ${primaryColor}20, transparent)` : 'transparent'
              }}
            >
              <span>{cat.icon}</span>
              <span className="text-white">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* 瀑布流图片网格 */}
        <div className="masonry-grid">
          {sampleImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.02 }}
            >
              <div
                className="rounded-xl overflow-hidden glass-dark cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                onClick={() => handleImageClick(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primaryColor
                  e.currentTarget.style.boxShadow = `0 0 20px 4px ${primaryColor}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 图片查看器 */}
        <AnimatePresence>
          {isImageViewerOpen && images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
              onClick={closeImageViewer}
            >
              {/* 关闭按钮 */}
              <button
                onClick={closeImageViewer}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white z-10"
              >
                ✕
              </button>

              {/* 计数器 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-dark text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* 左右切换 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setImageIndex(currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white"
              >
                →
              </button>

              {/* 图片 */}
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={images[currentImageIndex]?.src}
                alt=""
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Gallery
