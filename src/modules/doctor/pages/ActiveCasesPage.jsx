import { Activity } from 'lucide-react'
import { DoctorPlaceholder } from '../components/DoctorPlaceholder'

export function ActiveCasesPage() {
  return (
    <DoctorPlaceholder
      icon={Activity}
      titleKey="doctor.cases.title"
      subtitleKey="doctor.cases.subtitle"
    />
  )
}
