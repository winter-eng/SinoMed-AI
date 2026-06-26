import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronLeft, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'
import { useHealthProfile } from '../hooks/useHealthProfile'
import { ROUTES } from '@/shared/constants/routes'

const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']

const BMI_CONFIG = {
  underweight: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    badge: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  normal: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  overweight: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  obese: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
}

function FieldLabel({ children }) {
  return (
    <p className="mb-1.5 text-xs font-medium text-muted-foreground">{children}</p>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', unit, className }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
          className,
        )}
      />
      {unit && (
        <span className="shrink-0 text-xs text-muted-foreground">{unit}</span>
      )}
    </div>
  )
}

function GenderButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center gap-2 rounded-xl border p-3 text-sm transition-all',
        selected
          ? 'border-primary bg-primary/8 text-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/40',
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          selected ? 'border-primary bg-primary' : 'border-border',
        )}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      {children}
    </button>
  )
}

function BloodTypeChip({ value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-10 items-center justify-center rounded-xl border text-sm font-medium transition-all',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50',
      )}
    >
      {value}
    </button>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] },
  }),
}

export function HealthProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, updateField, bmi, bmiCategory } = useHealthProfile()

  const bmiConf = bmiCategory ? BMI_CONFIG[bmiCategory] : null

  const bmiLabelKey = bmiCategory
    ? `healthProfile.bmi${bmiCategory.charAt(0).toUpperCase()}${bmiCategory.slice(1)}`
    : null

  return (
    <div className="max-w-lg mx-auto space-y-5 pb-4">
      {/* Back header */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="flex items-center gap-2"
      >
        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={t('common.back')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t('healthProfile.title')}</h1>
          <p className="text-xs text-muted-foreground">{t('healthProfile.subtitle')}</p>
        </div>
      </motion.div>

      {/* BMI Card */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="show">
        <Card
          variant="default"
          padding="md"
          className={cn(
            'transition-colors duration-300',
            bmiConf ? bmiConf.bg : 'bg-card',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/70 shadow-sm">
              <Activity className="h-4 w-4 text-primary" />
            </div>

            {bmiConf && (
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                  bmiConf.badge,
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', bmiConf.dot)} />
                {t(bmiLabelKey)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-muted-foreground">{t('healthProfile.bmiCard')}</p>
            {bmi ? (
              <p className={cn('mt-0.5 text-3xl font-bold tracking-tight', bmiConf?.text ?? 'text-foreground')}>
                {bmi}
              </p>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">{t('healthProfile.bmiNotEnough')}</p>
            )}
            {profile.height && profile.weight && (
              <p className="mt-1 text-xs text-muted-foreground">
                {profile.height} {t('healthProfile.heightUnit')} · {profile.weight} {t('healthProfile.weightUnit')}
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Personal Info */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="show">
        <Card variant="default" padding="md">
          <p className="mb-4 text-sm font-semibold text-foreground">{t('healthProfile.personal')}</p>

          <div className="space-y-4">
            <div>
              <FieldLabel>{t('healthProfile.fullName')}</FieldLabel>
              <TextInput
                value={profile.fullName}
                onChange={(v) => updateField('fullName', v)}
                placeholder={t('healthProfile.fullNamePlaceholder')}
              />
            </div>

            <div>
              <FieldLabel>{t('healthProfile.age')}</FieldLabel>
              <TextInput
                type="number"
                value={profile.age}
                onChange={(v) => updateField('age', v)}
                placeholder={t('healthProfile.agePlaceholder')}
                unit={t('healthProfile.ageUnit')}
                className="max-w-[120px]"
              />
            </div>

            <div>
              <FieldLabel>{t('healthProfile.gender')}</FieldLabel>
              <div className="flex gap-2">
                <GenderButton
                  selected={profile.gender === 'male'}
                  onClick={() => updateField('gender', 'male')}
                >
                  {t('healthProfile.male')}
                </GenderButton>
                <GenderButton
                  selected={profile.gender === 'female'}
                  onClick={() => updateField('gender', 'female')}
                >
                  {t('healthProfile.female')}
                </GenderButton>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Physical */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="show">
        <Card variant="default" padding="md">
          <p className="mb-4 text-sm font-semibold text-foreground">{t('healthProfile.physical')}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>{t('healthProfile.height')}</FieldLabel>
              <TextInput
                type="number"
                value={profile.height}
                onChange={(v) => updateField('height', v)}
                placeholder={t('healthProfile.heightPlaceholder')}
                unit={t('healthProfile.heightUnit')}
              />
            </div>
            <div>
              <FieldLabel>{t('healthProfile.weight')}</FieldLabel>
              <TextInput
                type="number"
                value={profile.weight}
                onChange={(v) => updateField('weight', v)}
                placeholder={t('healthProfile.weightPlaceholder')}
                unit={t('healthProfile.weightUnit')}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Medical */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="show">
        <Card variant="default" padding="md">
          <p className="mb-4 text-sm font-semibold text-foreground">{t('healthProfile.medical')}</p>

          <div className="space-y-5">
            <div>
              <FieldLabel>{t('healthProfile.bloodType')}</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map((bt) => (
                  <BloodTypeChip
                    key={bt}
                    value={bt}
                    selected={profile.bloodType === bt}
                    onClick={() =>
                      updateField('bloodType', profile.bloodType === bt ? null : bt)
                    }
                  />
                ))}
              </div>
              {!profile.bloodType && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {t('healthProfile.bloodTypeNone')}
                </p>
              )}
            </div>

            <div>
              <FieldLabel>{t('healthProfile.allergies')}</FieldLabel>
              <textarea
                value={profile.allergies}
                onChange={(e) => updateField('allergies', e.target.value)}
                placeholder={t('healthProfile.allergiesPlaceholder')}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <FieldLabel>{t('healthProfile.chronicDiseases')}</FieldLabel>
              <textarea
                value={profile.chronicDiseases}
                onChange={(e) => updateField('chronicDiseases', e.target.value)}
                placeholder={t('healthProfile.chronicDiseasesPlaceholder')}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
