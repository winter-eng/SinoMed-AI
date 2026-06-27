import { Settings } from 'lucide-react'
import { DoctorPlaceholder } from '../components/DoctorPlaceholder'

export function DoctorSettingsPage() {
  return (
    <DoctorPlaceholder
      icon={Settings}
      titleKey="doctor.settings.title"
      subtitleKey="doctor.settings.subtitle"
    />
  )
}
