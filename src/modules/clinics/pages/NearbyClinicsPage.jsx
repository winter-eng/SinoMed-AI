import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Clock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const CLINICS = [
  {
    id: 1,
    name: 'Republican Specialized Scientific-Practical Medical Center of Endocrinology',
    address: 'Mirzo Ulugbek, Tashkent, Uzbekistan',
    distance: '1.2',
    open: true,
    hours: '08:00–17:00',
    mapsUrl: 'https://maps.google.com/?q=Republican+Specialized+Scientific-Practical+Medical+Center+of+Endocrinology+Tashkent',
  },
  {
    id: 2,
    name: 'Tashkent City Clinical Hospital №1',
    address: 'Yunusabad district, Tashkent',
    distance: '2.5',
    open: true,
    hours: '08:00–18:00',
    mapsUrl: 'https://maps.google.com/?q=Tashkent+City+Clinical+Hospital+1+Yunusabad',
  },
  {
    id: 3,
    name: 'Intermed Clinic',
    address: 'Chilanzar district, Tashkent',
    distance: '3.1',
    open: false,
    hours: '09:00–17:00',
    mapsUrl: 'https://maps.google.com/?q=Intermed+Clinic+Chilanzar+Tashkent',
  },
  {
    id: 4,
    name: 'Akad Medical Centre',
    address: 'Akademgorodok, Tashkent',
    distance: '4.0',
    open: true,
    hours: '08:30–17:30',
    mapsUrl: 'https://maps.google.com/?q=Akad+Medical+Centre+Tashkent',
  },
  {
    id: 5,
    name: 'International Hospital Tashkent',
    address: 'Yakkasaray district, Tashkent',
    distance: '5.3',
    open: false,
    hours: '09:00–18:00',
    mapsUrl: 'https://maps.google.com/?q=International+Hospital+Tashkent',
  },
]

export function NearbyClinicsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('clinics.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('clinics.subtitle')}</p>
      </motion.div>

      <div className="space-y-3">
        {CLINICS.map((clinic, i) => (
          <motion.div
            key={clinic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.3 }}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground leading-snug">{clinic.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{clinic.address}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {clinic.distance} {t('clinics.km')}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{clinic.hours}</span>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        clinic.open ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                      )}
                    >
                      {clinic.open ? t('clinics.open') : t('clinics.closed')}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={clinic.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:border-primary/30 active:scale-[0.98]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t('clinics.openMaps')}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
