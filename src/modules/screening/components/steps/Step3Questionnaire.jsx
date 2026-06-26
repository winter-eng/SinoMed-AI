import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'

function SectionLabel({ children }) {
  return <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</p>
}

function SelectCard({ selected, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-xl border p-3 text-left transition-all text-sm',
        selected
          ? 'border-primary bg-primary/8 text-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/40',
        className,
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

function SymptomCheckbox({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 rounded-xl border p-3 text-sm text-left transition-all w-full',
        checked
          ? 'border-primary bg-primary/8 text-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/30',
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all',
          checked ? 'border-primary bg-primary' : 'border-border',
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 text-white" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

const bmiColors = {
  underweight: 'text-blue-600 dark:text-blue-400',
  normal: 'text-emerald-600 dark:text-emerald-400',
  overweight: 'text-amber-600 dark:text-amber-400',
  obese: 'text-red-600 dark:text-red-400',
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export function Step3Questionnaire({
  form, bmi, bmiCategory, showFamilyMemberQuestion, showVisionQuestion,
  showWeightQuestion, updateForm, updateSymptom, onNext, onBack,
}) {
  const { t } = useTranslation()

  const symptoms = [
    { key: 'thirst', label: t('screening.step3.symptoms.thirst') },
    { key: 'urination', label: t('screening.step3.symptoms.urination') },
    { key: 'fatigue', label: t('screening.step3.symptoms.fatigue') },
    { key: 'vision', label: t('screening.step3.symptoms.vision') },
    { key: 'healing', label: t('screening.step3.symptoms.healing') },
    { key: 'tingling', label: t('screening.step3.symptoms.tingling') },
  ]

  const familyOpts = t('screening.step3.adaptive.familyOpts', { returnObjects: true })
  const visionOpts = t('screening.step3.adaptive.visionOpts', { returnObjects: true })

  const canProceed = form.age && form.gender && form.height && form.weight &&
    form.familyHistory !== null && form.hypertension !== null &&
    form.activityLevel !== null && form.dietType !== null

  const missingCount = [
    !form.age, !form.gender, !form.height, !form.weight,
    form.familyHistory === null, form.hypertension === null,
    form.activityLevel === null, form.dietType === null,
  ].filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t('screening.step3.title')}</h2>
      </div>

      {/* Basics */}
      <section className="space-y-4">
        <SectionLabel>{t('screening.step3.basics.label')}</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('screening.step3.basics.age')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.age}
                onChange={(e) => updateForm('age', e.target.value)}
                placeholder={t('screening.step3.basics.agePlaceholder')}
                min="1" max="120"
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {t('screening.step3.basics.ageUnit')}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('screening.step3.basics.gender')}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['male', 'female'].map((g) => (
                <SelectCard key={g} selected={form.gender === g} onClick={() => updateForm('gender', g)}>
                  <span className="text-xs">{t(`screening.step3.basics.${g}`)}</span>
                </SelectCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Physical */}
      <section className="space-y-4">
        <SectionLabel>{t('screening.step3.physical.label')}</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('screening.step3.physical.height')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.height}
                onChange={(e) => updateForm('height', e.target.value)}
                placeholder={t('screening.step3.physical.heightPlaceholder')}
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">{t('screening.step3.physical.heightUnit')}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('screening.step3.physical.weight')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.weight}
                onChange={(e) => updateForm('weight', e.target.value)}
                placeholder={t('screening.step3.physical.weightPlaceholder')}
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">{t('screening.step3.physical.weightUnit')}</span>
            </div>
          </div>
        </div>
        {bmi && bmiCategory && (
          <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3">
            <span className="text-xs text-muted-foreground">{t('screening.step3.physical.bmiLabel')}</span>
            <span className={cn('ml-auto text-sm font-bold', bmiColors[bmiCategory])}>{bmi}</span>
            <span className={cn('text-xs font-medium', bmiColors[bmiCategory])}>
              — {t(`screening.step3.physical.bmi${cap(bmiCategory)}`)}
            </span>
          </div>
        )}
      </section>

      {/* Symptoms */}
      <section className="space-y-3">
        <SectionLabel>{t('screening.step3.symptoms.label')}</SectionLabel>
        <p className="text-xs text-muted-foreground -mt-1">{t('screening.step3.symptoms.note')}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {symptoms.map(({ key, label }) => (
            <SymptomCheckbox
              key={key}
              label={label}
              checked={form.symptoms[key]}
              onChange={(v) => updateSymptom(key, v)}
            />
          ))}
        </div>
      </section>

      {/* History */}
      <section className="space-y-4">
        <SectionLabel>{t('screening.step3.history.label')}</SectionLabel>
        <div className="space-y-2">
          <p className="text-sm text-foreground">{t('screening.step3.history.family')}</p>
          <div className="grid grid-cols-2 gap-2">
            <SelectCard selected={form.familyHistory === true} onClick={() => updateForm('familyHistory', true)}>
              <div>
                <p className="text-xs font-medium">{t('screening.step3.history.familyYes')}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('screening.step3.history.familyYesSub')}</p>
              </div>
            </SelectCard>
            <SelectCard selected={form.familyHistory === false} onClick={() => updateForm('familyHistory', false)}>
              <span className="text-xs font-medium">{t('screening.step3.history.familyNo')}</span>
            </SelectCard>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-foreground">{t('screening.step3.history.hypertension')}</p>
          <div className="grid grid-cols-2 gap-2">
            <SelectCard selected={form.hypertension === true} onClick={() => updateForm('hypertension', true)}>
              <span className="text-xs font-medium">{t('screening.step3.history.hypertensionYes')}</span>
            </SelectCard>
            <SelectCard selected={form.hypertension === false} onClick={() => updateForm('hypertension', false)}>
              <span className="text-xs font-medium">{t('screening.step3.history.hypertensionNo')}</span>
            </SelectCard>
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="space-y-4">
        <SectionLabel>{t('screening.step3.lifestyle.label')}</SectionLabel>
        <div className="space-y-2">
          <p className="text-sm text-foreground">{t('screening.step3.lifestyle.activity')}</p>
          <div className="space-y-1.5">
            {['low', 'moderate', 'high'].map((level) => (
              <SelectCard key={level} selected={form.activityLevel === level} onClick={() => updateForm('activityLevel', level)}>
                <div>
                  <p className="text-xs font-medium">{t(`screening.step3.lifestyle.activity${cap(level)}`)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t(`screening.step3.lifestyle.activity${cap(level)}Sub`)}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-foreground">{t('screening.step3.lifestyle.diet')}</p>
          <div className="space-y-1.5">
            {['healthy', 'moderate', 'poor'].map((diet) => (
              <SelectCard key={diet} selected={form.dietType === diet} onClick={() => updateForm('dietType', diet)}>
                <div>
                  <p className="text-xs font-medium">{t(`screening.step3.lifestyle.diet${cap(diet)}`)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t(`screening.step3.lifestyle.diet${cap(diet)}Sub`)}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptive */}
      {(showFamilyMemberQuestion || showVisionQuestion || showWeightQuestion) && (
        <section className="space-y-4">
          <div className="rounded-xl bg-muted/50 border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">{t('screening.step3.adaptive.info')}</p>
          </div>
          <SectionLabel>{t('screening.step3.adaptive.label')}</SectionLabel>

          {showFamilyMemberQuestion && (
            <div className="space-y-2">
              <p className="text-sm text-foreground">{t('screening.step3.adaptive.familyMember')}</p>
              <div className="space-y-1.5">
                {(Array.isArray(familyOpts) ? familyOpts : []).map((opt) => (
                  <SelectCard key={opt} selected={form.familyMember === opt} onClick={() => updateForm('familyMember', opt)}>
                    <span className="text-xs">{opt}</span>
                  </SelectCard>
                ))}
              </div>
            </div>
          )}

          {showVisionQuestion && (
            <div className="space-y-2">
              <p className="text-sm text-foreground">{t('screening.step3.adaptive.visionCheck')}</p>
              <div className="space-y-1.5">
                {(Array.isArray(visionOpts) ? visionOpts : []).map((opt) => (
                  <SelectCard key={opt} selected={form.lastVisionCheck === opt} onClick={() => updateForm('lastVisionCheck', opt)}>
                    <span className="text-xs">{opt}</span>
                  </SelectCard>
                ))}
              </div>
            </div>
          )}

          {showWeightQuestion && (
            <div className="space-y-2">
              <p className="text-sm text-foreground">{t('screening.step3.adaptive.weightAttempts')}</p>
              <div className="grid grid-cols-2 gap-2">
                <SelectCard selected={form.weightAttempts === true} onClick={() => updateForm('weightAttempts', true)}>
                  <span className="text-xs">{t('screening.step3.adaptive.weightYes')}</span>
                </SelectCard>
                <SelectCard selected={form.weightAttempts === false} onClick={() => updateForm('weightAttempts', false)}>
                  <span className="text-xs">{t('screening.step3.adaptive.weightNo')}</span>
                </SelectCard>
              </div>
            </div>
          )}
        </section>
      )}

      {!canProceed && missingCount > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          {missingCount === 1
            ? t('screening.step3.oneFieldLeft')
            : t('screening.step3.fieldsLeft', { count: missingCount })}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="md" onClick={onBack} className="flex-1">
          {t('screening.nav.back')}
        </Button>
        <Button size="md" onClick={onNext} disabled={!canProceed} className="flex-1">
          {t('screening.nav.next')}
        </Button>
      </div>
    </motion.div>
  )
}
