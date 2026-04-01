import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import GlassCard from '../components/GlassCard'

// 示例图片数据（可替换）
const sampleImages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/400/${300 + (i % 5) * 100}?random=${i}`,
  alt: `图片 ${i + 1}`,
  width: 400,
  height: 300 + (i % 5) * 100
}))

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
              className="mb-4"
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
