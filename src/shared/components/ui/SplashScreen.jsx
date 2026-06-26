import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Logo } from './Logo'

export function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 50% 40%, hsl(var(--primary) / 0.07) 0%, transparent 70%), hsl(var(--background))',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.04, y: -10 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center gap-7"
      >
        <Logo size="xl" showText={false} />

        <div className="flex flex-col items-center gap-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            SinoMed AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Inspired by Ibn Sina
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-xs text-muted-foreground/60 tracking-wide"
          >
            AI Healthcare Platform
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
          className="h-0.5 w-16 rounded-full bg-primary/40 origin-left"
        />
      </motion.div>
    </motion.div>
  )
}
