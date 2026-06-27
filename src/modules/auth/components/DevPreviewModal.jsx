import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/providers/AuthProvider'

const ROLES = [
  { id: 'patient', label: 'Patient' },
  { id: 'assistant', label: 'Medical Assistant' },
  { id: 'doctor', label: 'Doctor' },
]

export function DevPreviewModal({ isOpen, onClose }) {
  const { devPreviewPatient, devPreviewAssistant, devPreviewDoctor } = useAuth()

  const handleSelect = (roleId) => {
    onClose()
    if (roleId === 'patient') devPreviewPatient()
    else if (roleId === 'assistant') devPreviewAssistant()
    else if (roleId === 'doctor') devPreviewDoctor()
    // LoginPage redirect guard handles navigation automatically
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-0.5 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/50 uppercase">
              DEV
            </p>
            <h2 className="text-base font-semibold text-foreground">Developer Preview</h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">Choose interface:</p>
            <div className="flex flex-col gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleSelect(role.id)}
                  className="flex h-11 w-full items-center rounded-xl border border-border bg-muted/50 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
                >
                  {role.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
