import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/constants/routes'
import { predictionApi } from '@/shared/api/prediction.api'
import { cn } from '@/shared/lib/utils'

const STAGES_KEYS = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6']
const STAGE_DURATION = 900

export function Step5Processing({ imageFile }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentStage, setCurrentStage] = useState(0)
  const [done, setDone] = useState(false)
  const [apiError, setApiError] = useState(null)

  const resultIdRef = useRef(null)
  const apiDoneRef = useRef(false)
  const animDoneRef = useRef(false)

  const finalize = useRef(() => {
    setTimeout(() => {
      setDone(true)
      setTimeout(() => {
        navigate(ROUTES.ANALYSIS.RESULT(resultIdRef.current))
      }, 1200)
    }, 300)
  })

  const tryFinalize = useRef(() => {
    if (apiDoneRef.current && animDoneRef.current) {
      finalize.current()
    }
  })

  useEffect(() => {
    if (!imageFile) {
      setApiError(t('screening.step5.errorNoImage'))
      return
    }

    predictionApi
      .submit(imageFile)
      .then((result) => {
        resultIdRef.current = result.id
        apiDoneRef.current = true
        queryClient.invalidateQueries({ queryKey: ['predictions'] })
        tryFinalize.current()
      })
      .catch((err) => {
        const detail = err?.response?.data?.detail
        setApiError(typeof detail === 'string' ? detail : t('screening.step5.errorFailed'))
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (apiError) return
    if (currentStage >= STAGES_KEYS.length) {
      animDoneRef.current = true
      tryFinalize.current()
      return
    }
    const timer = setTimeout(() => {
      setCurrentStage((s) => s + 1)
    }, STAGE_DURATION)
    return () => clearTimeout(timer)
  }, [currentStage, apiError])

  if (apiError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 py-10 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{t('screening.step5.errorTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">{apiError}</p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          {t('results.backDashboard')}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-8 py-10 text-center"
    >
      <div className="relative">
        <AnimatePresence>
          {done ? (
            <motion.div
              key="done"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div key="loading" className="relative flex h-20 w-20 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-4 border-t-primary border-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <AnimatePresence mode="wait">
          <motion.p
            key={done ? 'done' : 'analyzing'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-base font-semibold text-foreground"
          >
            {done ? t('screening.step5.done') : t('screening.step5.analyzing')}
          </motion.p>
        </AnimatePresence>
        <p className="mt-1 text-sm text-muted-foreground">
          {done ? t('screening.step5.goingToResults') : t('screening.step5.pleaseWait')}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        {STAGES_KEYS.map((key, i) => {
          const isComplete = i < currentStage
          const isCurrent = i === currentStage && !done
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-300',
                isComplete && 'bg-emerald-50 dark:bg-emerald-950/30',
                isCurrent && 'bg-primary/8 border border-primary/20',
                !isComplete && !isCurrent && 'opacity-40',
              )}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isComplete && 'text-emerald-700 dark:text-emerald-300',
                  isCurrent && 'text-primary',
                  !isComplete && !isCurrent && 'text-muted-foreground',
                )}
              >
                {t(`screening.step5.${key}`)}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
