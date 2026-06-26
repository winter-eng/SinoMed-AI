import { Outlet } from 'react-router-dom'
import { DesktopTopbar } from './DesktopTopbar'
import { MobileTopbar } from './MobileTopbar'
import { MobileBottomNav } from './MobileBottomNav'

export function WebAppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DesktopTopbar />
      <MobileTopbar />

      <main className="flex-1 pb-20 lg:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}
