import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore, siteConfig } from '../store/useStore'

function TimeBlock({ value, unit, primaryColor }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (value !== displayValue) {
      setAnimKey(prev => prev + 1)
      setDisplayValue(value)
    }
  }, [value, displayValue])

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden" style={{ width: '3rem', height: '2.5rem' }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={animKey}
            initial={{ y: '100%', opacity: 0, rotateX: 90 }}
            animate={{ y: '0%', opacity: 1, rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
            exit={{ y: '-100%', opacity: 0, rotateX: -90 }}
            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-bold tabular-nums"
            style={{ color: primaryColor }}
          >
            {String(value).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-white/60 text-xs mt-1">{unit}</span>
    </div>
  )
}

function BirthdayCountdown() {
  const { primaryColor } = useStore()
  const [countdown, setCountdown] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false
  })

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const birthday = siteConfig.birthday
      let year = now.getFullYear()

      let nextBirthday = new Date(year, birthday.month - 1, birthday.day)
      if (nextBirthday < now) {
        nextBirthday = new Date(year + 1, birthday.month - 1, birthday.day)
      }

      const diff = nextBirthday - now

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds, isToday: false })
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  if (countdown.isToday) {
    return (
      <div className="text-center py-4">
        <span className="text-3xl mb-2 block">🎂</span>
        <p className="text-white font-semibold text-lg">今天是生日！</p>
        <p className="text-white/60 text-sm">祝生日快乐！</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="text-white/60 text-sm mb-3 flex items-center justify-center gap-1.5">
        <span>🎉</span>
        距离下一个生日还有
      </p>
      <div className="flex justify-center gap-4">
        <TimeBlock value={countdown.days} unit="天" primaryColor={primaryColor} />
        <TimeBlock value={countdown.hours} unit="时" primaryColor={primaryColor} />
        <TimeBlock value={countdown.minutes} unit="分" primaryColor={primaryColor} />
        <TimeBlock value={countdown.seconds} unit="秒" primaryColor={primaryColor} />
      </div>
    </div>
  )
}

export default BirthdayCountdown
