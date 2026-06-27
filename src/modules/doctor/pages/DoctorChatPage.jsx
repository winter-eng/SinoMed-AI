import { MessageCircle } from 'lucide-react'
import { DoctorPlaceholder } from '../components/DoctorPlaceholder'

export function DoctorChatPage() {
  return (
    <DoctorPlaceholder
      icon={MessageCircle}
      titleKey="doctor.chat.title"
      subtitleKey="doctor.chat.subtitle"
    />
  )
}
