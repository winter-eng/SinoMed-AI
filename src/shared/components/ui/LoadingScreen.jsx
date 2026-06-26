import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

export function LoadingScreen({ message, className, fullScreen = true }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'fixed inset-0 z-50 bg-background',
        !fullScreen && 'w-full py-16',
        className,
      )}
    >
      <motion.div
        className="relative flex h-12 w-12 items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-primary/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="h-5 w-5 rounded-full bg-primary" />
      </motion.div>

      {message && (
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}
