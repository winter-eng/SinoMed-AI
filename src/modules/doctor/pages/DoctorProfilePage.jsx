import { User } from 'lucide-react'
import { DoctorPlaceholder } from '../components/DoctorPlaceholder'

export function DoctorProfilePage() {
  return (
    <DoctorPlaceholder
      icon={User}
      titleKey="doctor.profile.title"
      subtitleKey="doctor.profile.subtitle"
    />
  )
}
