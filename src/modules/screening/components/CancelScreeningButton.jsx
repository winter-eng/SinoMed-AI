import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function CancelScreeningButton({ hasData, onCancel }) {
  const { t } = useTranslation()
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (!hasData) {
      onCancel()
      return
    }
    setConfirming(true)
  }

  return (
    <div className="flex justify-center py-2">
      <AnimatePresence mode="wait">
        {confirming ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm text-muted-foreground text-center max-w-[260px]">
              {t('screening.cancelConfirm')}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="inline-flex h-9 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent active:scale-[0.97]"
              >
                {t('screening.cancelNo')}
              </button>
              <button
                onClick={onCancel}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 px-4 text-sm font-medium text-white transition-colors active:scale-[0.97]"
              >
                <X className="h-3.5 w-3.5" />
                {t('screening.cancelYes')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="cancel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 px-5 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:border-amber-300 dark:hover:border-amber-700/60"
          >
            <X className="h-4 w-4" />
            {t('screening.cancel')}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
