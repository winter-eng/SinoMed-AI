import { AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useScreening } from '../hooks/useScreening'
import { ScreeningHeader } from '../components/ScreeningHeader'
import { CancelScreeningButton } from '../components/CancelScreeningButton'
import { Step1Welcome } from '../components/steps/Step1Welcome'
import { Step2PhotoUpload } from '../components/steps/Step2PhotoUpload'
import { Step3Questionnaire } from '../components/steps/Step3Questionnaire'
import { Step4Review } from '../components/steps/Step4Review'
import { Step5Processing } from '../components/steps/Step5Processing'
import { ROUTES } from '@/shared/constants/routes'

export function ScreeningPage() {
  const navigate = useNavigate()
  const {
    step, totalSteps, form, bmi, bmiCategory,
    showFamilyMemberQuestion, showVisionQuestion, showWeightQuestion,
    updateForm, updateSymptom, goNext, goBack,
  } = useScreening()

  const hasData =
    step > 1 ||
    form.imageFile !== null ||
    form.age !== '' ||
    form.gender !== null ||
    Object.values(form.symptoms).some(Boolean) ||
    form.familyHistory !== null

  const isProcessing = step === totalSteps

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScreeningHeader step={step} totalSteps={totalSteps} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1Welcome key="step1" onNext={goNext} />}
            {step === 2 && (
              <Step2PhotoUpload
                key="step2"
                imageFile={form.imageFile}
                imagePreviewUrl={form.imagePreviewUrl}
                onFileChange={(file, url) => {
                  updateForm('imageFile', file)
                  updateForm('imagePreviewUrl', url)
                }}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <Step3Questionnaire
                key="step3"
                form={form}
                bmi={bmi}
                bmiCategory={bmiCategory}
                showFamilyMemberQuestion={showFamilyMemberQuestion}
                showVisionQuestion={showVisionQuestion}
                showWeightQuestion={showWeightQuestion}
                updateForm={updateForm}
                updateSymptom={updateSymptom}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 4 && (
              <Step4Review
                key="step4"
                form={form}
                bmi={bmi}
                bmiCategory={bmiCategory}
                onLaunch={goNext}
                onBack={goBack}
              />
            )}
            {step === 5 && <Step5Processing key="step5" imageFile={form.imageFile} />}
          </AnimatePresence>

          {!isProcessing && (
            <div className="mt-2 border-t border-border/40 pt-4">
              <CancelScreeningButton
                hasData={hasData}
                onCancel={() => navigate(ROUTES.DASHBOARD)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
