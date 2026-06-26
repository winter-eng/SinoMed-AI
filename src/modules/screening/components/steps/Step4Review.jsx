import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CheckCircle2, ImageIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function ReviewRow({ label, value, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 py-2.5 border-b border-border/50 last:border-0', className)}>
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-medium text-foreground text-right">{value}</span>
    </div>
  )
}

export function Step4Review({ form, bmi, bmiCategory, onLaunch, onBack }) {
  const { t } = useTranslation()

  const symptomCount = Object.values(form.symptoms).filter(Boolean).length
  const totalSymptoms = Object.keys(form.symptoms).length

  const genderLabel = form.gender === 'male' ? t('screening.step4.genderMale') : t('screening.step4.genderFemale')
  const activityLabel = form.activityLevel
    ? t(`screening.step4.activity${cap(form.activityLevel)}`)
    : '—'
  const dietLabel = form.dietType
    ? t(`screening.step4.diet${cap(form.dietType)}`)
    : '—'
  const bmiLabel = bmi && bmiCategory
    ? `${bmi} — ${t(`screening.step3.physical.bmi${cap(bmiCategory)}`)}`
    : '—'

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t('screening.step4.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('screening.step4.subtitle')}</p>
      </div>

      <Card variant="subtle" padding="md">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          {t('screening.step4.photoSection')}
        </p>
        {form.imagePreviewUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={form.imagePreviewUrl}
              alt="Preview"
              className="h-14 w-14 rounded-lg object-cover border border-border"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{form.imageFile?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {form.imageFile ? `${(form.imageFile.size / 1024 / 1024).toFixed(1)} MB` : ''}
              </p>
            </div>
            <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500 shrink-0" />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
            <span className="text-sm">{t('screening.step4.photoEmpty')}</span>
          </div>
        )}
      </Card>

      <Card variant="subtle" padding="md">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {t('screening.step4.sectionAbout')}
        </p>
        <ReviewRow label={t('screening.step4.rowAge')} value={`${form.age} ${t('screening.step3.basics.ageUnit')}`} />
        <ReviewRow label={t('screening.step4.rowGender')} value={genderLabel} />
      </Card>

      <Card variant="subtle" padding="md">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {t('screening.step4.sectionPhysical')}
        </p>
        <ReviewRow label={t('screening.step4.rowHeight')} value={`${form.height} ${t('screening.step3.physical.heightUnit')}`} />
        <ReviewRow label={t('screening.step4.rowWeight')} value={`${form.weight} ${t('screening.step3.physical.weightUnit')}`} />
        <ReviewRow label={t('screening.step4.rowBmi')} value={bmiLabel} />
      </Card>

      <Card variant="subtle" padding="md">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {t('screening.step4.sectionSymptoms')}
        </p>
        <ReviewRow
          label={t('screening.step4.rowSymptoms')}
          value={
            symptomCount === 0
              ? t('screening.step4.symptomsNone')
              : t('screening.step4.symptomsOf', { count: symptomCount, total: totalSymptoms })
          }
        />
        <ReviewRow
          label={t('screening.step4.rowFamily')}
          value={form.familyHistory === null ? '—' : form.familyHistory ? t('common.yes') : t('common.no')}
        />
        <ReviewRow
          label={t('screening.step4.rowHypertension')}
          value={form.hypertension === null ? '—' : form.hypertension ? t('common.yes') : t('common.no')}
        />
        <ReviewRow label={t('screening.step4.rowActivity')} value={activityLabel} />
        <ReviewRow label={t('screening.step4.rowDiet')} value={dietLabel} />
      </Card>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="md" onClick={onBack} className="flex-1">
          {t('screening.nav.back')}
        </Button>
        <Button size="lg" onClick={onLaunch} className="flex-[2] shadow-md shadow-primary/20">
          {t('screening.step4.launchButton')}
        </Button>
      </div>
    </motion.div>
  )
}
