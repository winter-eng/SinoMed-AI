import { ClipboardList } from 'lucide-react'
import { DoctorPlaceholder } from '../components/DoctorPlaceholder'

export function PatientHistoryPage() {
  return (
    <DoctorPlaceholder
      icon={ClipboardList}
      titleKey="doctor.history.title"
      subtitleKey="doctor.history.subtitle"
    />
  )
}
