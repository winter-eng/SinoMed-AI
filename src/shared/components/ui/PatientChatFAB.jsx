import { Link, useLocation } from 'react-router-dom'
import { Bot, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'
import { ROUTES } from '@/shared/constants/routes'

export function PatientChatFAB() {
  const location = useLocation()
  const onAiChat = location.pathname === ROUTES.CHAT
  const onDoctorChat = location.pathname === ROUTES.PATIENT_DOCTOR_CHAT

  if (onAiChat && onDoctorChat) return null

  return (
    <div
      className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3 lg:bottom-8 lg:right-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {!onDoctorChat && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.4 }}
        >
          <Link
            to={ROUTES.PATIENT_DOCTOR_CHAT}
            aria-label="Doctor Chat"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Stethoscope className="h-5 w-5 text-primary" />
          </Link>
        </motion.div>
      )}

      {!onAiChat && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.3 }}
        >
          <Link
            to={ROUTES.CHAT}
            aria-label="AI Chat"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Bot className="h-6 w-6" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
