import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/utils'

export function Step2PhotoUpload({ imageFile, imagePreviewUrl, onFileChange, onNext, onBack }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    const url = URL.createObjectURL(file)
    onFileChange(file, url)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    onFileChange(null, null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t('screening.step2.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('screening.step2.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {imagePreviewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl border border-border"
          >
            <img src={imagePreviewUrl} alt="Preview" className="w-full object-cover max-h-64" />
            <button
              onClick={clearImage}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
              <p className="text-xs text-white font-medium">{imageFile?.name}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-all',
              dragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-border hover:border-primary/50 hover:bg-muted/40',
            )}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              {dragging ? (
                <Upload className="h-6 w-6 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {dragging ? t('screening.step2.dropActive') : t('screening.step2.dropIdle')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t('screening.step2.formats')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

      <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">{t('screening.step2.warning')}</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="md" onClick={onBack} className="flex-1">
          {t('screening.nav.back')}
        </Button>
        <Button size="md" onClick={onNext} className="flex-1">
          {imageFile ? t('screening.nav.next') : t('screening.step2.skip')}
        </Button>
      </div>
    </motion.div>
  )
}
