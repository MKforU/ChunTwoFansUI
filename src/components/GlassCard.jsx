import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

function GlassCard({ children, className = '', hover = true }) {
  const { primaryColor } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl glass-dark overflow-hidden ${className}`}
      style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = primaryColor
          e.currentTarget.style.boxShadow = `0 0 25px 4px ${primaryColor}60, 0 0 0 2px ${primaryColor}`
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
