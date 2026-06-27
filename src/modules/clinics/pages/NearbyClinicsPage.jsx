import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Loader2, Phone } from 'lucide-react'
import { clinicApi } from '@/shared/api/clinic.api'

const MOCK_CLINICS = [
  { id: 'm1', name: 'Toshkent Tibbiy Markazi', address: 'Yunusobod tumani, 7-mavze', phone: '+998 71 123 45 67', latitude: 41.3111, longitude: 69.2797 },
  { id: 'm2', name: 'Shifo Klinikasi', address: "Chilonzor tumani, Katartal ko'chasi 12", phone: '+998 71 234 56 78', latitude: 41.2837, longitude: 69.2004 },
  { id: 'm3', name: "Ko'z va Retina Markazi", address: "Mirzo Ulug'bek tumani, Amir Temur ko'chasi 108", phone: '+998 71 345 67 89', latitude: 41.3264, longitude: 69.2878 },
]

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
}

function mapsUrl(clinic) {
  if (clinic.latitude && clinic.longitude) {
    return `https://maps.google.com/?q=${clinic.latitude},${clinic.longitude}`
  }
  return `https://maps.google.com/?q=${encodeURIComponent(clinic.name + ' ' + (clinic.address ?? ''))}`
}

export function NearbyClinicsPage() {
  const { t } = useTranslation()
  const [clinics, setClinics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userLoc, setUserLoc] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchClinics = (lat, lon) => {
      const apiCall = lat != null
        ? clinicApi.nearest(lat, lon)
        : clinicApi.list()

      apiCall
        .then((data) => {
          if (!cancelled) {
            // GET /clinics returns ClinicResponse[] but GET /clinics/nearest
            // returns a single ClinicResponse — normalise to array.
            setClinics(Array.isArray(data) ? data : [data])
          }
        })
        .catch(() => { if (!cancelled) setClinics(MOCK_CLINICS) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return
          const { latitude, longitude } = pos.coords
          setUserLoc({ lat: latitude, lon: longitude })
          fetchClinics(latitude, longitude)
        },
        () => {
          // User denied geolocation or error — fall back to full list
          if (!cancelled) fetchClinics(null, null)
        },
        { timeout: 5000 },
      )
    } else {
      fetchClinics(null, null)
    }

    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('clinics.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('clinics.subtitle')}</p>
      </motion.div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      )}

      {!loading && clinics?.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">{t('clinics.noneFound')}</p>
      )}

      {!loading && clinics && clinics.length > 0 && (
        <div className="space-y-3">
          {clinics.map((clinic, i) => {
            const distance =
              userLoc && clinic.latitude && clinic.longitude
                ? haversineKm(userLoc.lat, userLoc.lon, clinic.latitude, clinic.longitude)
                : null

            return (
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
                      {clinic.address && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{clinic.address}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {distance && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {distance} {t('clinics.km')}
                          </span>
                        )}
                        {clinic.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {clinic.phone}
                          </span>
                        )}
                        {/* TODO: hours / open-closed status not available in ClinicResponse */}
                      </div>
                    </div>
                  </div>

                  <a
                    href={mapsUrl(clinic)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:border-primary/30 active:scale-[0.98]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t('clinics.openMaps')}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
