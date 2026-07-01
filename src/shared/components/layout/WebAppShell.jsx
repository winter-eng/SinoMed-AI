import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { DesktopTopbar } from './DesktopTopbar'
import { MobileTopbar } from './MobileTopbar'
import { MobileBottomNav } from './MobileBottomNav'
import { PatientChatFAB } from '@/shared/components/ui/PatientChatFAB'

export function WebAppShell() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DesktopTopbar />
      <MobileTopbar />

      <main className="flex-1 pb-20 lg:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileBottomNav />
      <PatientChatFAB />
    </div>
  )
}
